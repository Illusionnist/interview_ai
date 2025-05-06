'use server';

import {db, auth} from "@/firebase/admin";
import {cookies} from "next/headers";

const OneWeek = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {

    const {uid, name, email} = params;
    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists'
            }
        }
        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'User created successfully'
        }
    } catch (error: any) {
        console.log('Error creating a user', error)
        if (error.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'This email is already in use'
            }
        }

        return {
            success: false,
            message: 'Fail to create account'
        }
    }
}


export async function signIn(params: SignInParams) {
    const {email, idToken} = params;

    try {
        const useRecord = await auth.getUserByEmail(email);
        if (!useRecord) {
            return {
                success: false,
                message: 'User not found. Create a user'
            }
        }

        await setSessionCookie(idToken)
    } catch (error: any) {
        console.log(error)

        return {
            success: false,
            message: 'Fail to sign in'
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {expiresIn: OneWeek * 1000})
    cookieStore.set('session', sessionCookie, {
        maxAge: OneWeek * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if (!userRecord.exists) return null;
        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (e) {
        console.log('Could not get session cookie', e)
        return null;
    }

}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

export async function getInterviewByUserId(userID: string): Promise<Interview[] | null> {
    const interviews = await db.collection('interviews')
        .where('userId', '==', userID)
        .orderBy('createdAt', 'desc')
        .get();

    return interviews.docs.map((doc)=>({
        id: doc.id,
        ...doc.data()
    })) as  Interview[];
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {

    const {userId, limit = 20} = params;

    const interviews = await
        db.collection('interviews')
        .where('finalized', '==', true)
        .orderBy('createdAt', 'desc')
            .where('userId', '!=', userId)
            .limit(limit)
        .get();

    return interviews.docs.map((doc)=>({
        id: doc.id,
        ...doc.data()
    })) as  Interview[];
}