import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {dummyInterviews} from "@/constants";
import InterviewCard from "@/components/InterviewCard";
import {getCurrentUser, getInterviewByUserId, getLatestInterviews} from "@/lib/actions/auth.action";

const Page = async () => {
    const user = await getCurrentUser();

    const [userInterview, latestInterviews] = await  Promise.all([
        await getInterviewByUserId(user?.id!),
        await getLatestInterviews({userId: user?.id!}),
    ])


    const hasPastInterviews = userInterview?.length > 0;
    const hasUpcomingInteriew = latestInterviews?.length > 0;
    return (
        <>
            <section className="card-cta">
                <div className="flex flex-col gap-6 maw-w-lg">
                    <h2>Get interview ready with AI powered practice and feedback</h2>
                    <p className={'text-lg'}>Practice on real interview questions and get instant feedback.</p>
                    <Button asChild className={'btn-primary max-sw:w-full'}>
                        <Link href="/interview">Start an Interview</Link>
                    </Button>
                </div>
                <Image src={'/robot.png'} alt={'AI Robot'} width={400} height={400} className={'max-sm:hidden'}/>
            </section>

            <section className="flex flex-col gap-6 mt-8">
                <h2>Your Interviews</h2>
                <div className="interviews-section">
                    {
                        hasPastInterviews ? (
                                userInterview?.map(((interview) => (
                                    <InterviewCard {...interview} key={interview.id}/>)))) :
                           ( <p>You haven't taken any interviews yet</p>)
                    }
                </div>
            </section>

            <section className="flex flex-col gap-6 mt-8">
                <h2>Take an interview</h2>
                <div className="interviews-section">
                    {
                        hasUpcomingInteriew ? (
                                latestInterviews?.map(((interview) => (
                                    <InterviewCard {...interview} key={interview.id}/>)))) :
                            ( <p>There are no new interviews available</p>)
                    }
                </div>
            </section>
        </>
    )
}
export default Page
