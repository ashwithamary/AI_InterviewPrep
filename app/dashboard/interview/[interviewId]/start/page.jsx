"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { use } from 'react';
import QuestionsSection from './_components/QuestionsSection'
import RecordAnswerSection from './_components/RecordAnswerSection'

function StartInterview({ params }) {
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
    const unwrappedParams = use(params);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);    
    useEffect(() => {
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, unwrappedParams.interviewId));
            
            if (result && result.length > 0) {
                setInterviewData(result[0]);
                
                if (result[0].jsonMockResponse) {
                    const jsonMockResp = JSON.parse(result[0].jsonMockResponse);
                    console.log("Parsed JSON:", jsonMockResp);
                    setMockInterviewQuestion(jsonMockResp);
                } else {
                    console.error("No jsonMockResponse field found in the result");
                }
            } else {
                console.error("No interview found with ID:", unwrappedParams.interviewId);
            }
        } catch (err) {
            console.error("Error fetching interview details:", err);
        }
    }

    if (!interviewData) {
        return <div>Loading interview data...</div>;
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Questions */}
                    <QuestionsSection 
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    />
                {/* Video/Audio Recording */}
                <RecordAnswerSection/>
                
            </div>
        </div>
    );
}

export default StartInterview