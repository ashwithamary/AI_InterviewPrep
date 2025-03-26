"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { chatSession } from '@/utils/geminiai_modal';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';

function SpeechToTextSection({ userAnswer, setUserAnswer, mockInterviewQuestion, activeQuestionIndex, interviewData }) {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });
    useEffect(()=>{
        if(!isRecording&&userAnswer.length>10){
            UpdateUserAnswer();
        }

        // if (userAnswer?.length < 10) {
        //     setLoading(false);
        //     toast("Error while saving your answer. Please record again!")
        //     return;
        // }
    },[userAnswer, isRecording])

    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText()
            
        } else {
            startSpeechToText();
        }
    }

    const UpdateUserAnswer = async () => {
        setLoading(true);
        const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.question +
            ", User Answer:" + userAnswer + ",Depending on the question and the user answer for the given interview question" +
            "please give the rating for this answer and feedback as area of improvement if there is any" +
            "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field"

        const result = await chatSession.sendMessage(feedbackPrompt);
        const MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '')
        console.log(MockJsonResp)
        const JsonFeedbackResp = JSON.parse(MockJsonResp);

        const resp = await db.insert(UserAnswer).values({
            mockIdRef: interviewData?.mockId,
            question: mockInterviewQuestion[activeQuestionIndex]?.question,
            correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
            userAnswer: userAnswer,
            feedback: JsonFeedbackResp?.feedback,
            rating: JsonFeedbackResp?.rating,
            userEmail: user.primaryEmailAddress.emailAddress,
            createdAt: moment().format('DD-MM-yyyy')

        })

        if (resp) {
            toast('User Answer Recorded Successfully');
            setUserAnswer('');
            setResults([]);
            setLoading(false);
        } else {
            toast.error('Failed to save answer');
            setLoading(false);
        }
    }

    useEffect(() => {
        if (results && results.length > 0) {
            results.forEach((result) => {
                setUserAnswer(prevAns => prevAns + result.transcript);
            });
        }
    }, [results, setUserAnswer]);

    return (
        <>
            <Button
                disabled={loading}
                variant="outline"
                className="my-10"
                onClick={StartStopRecording}
            >
                {isRecording ?
                    <h2 className='text-red-600 flex items-center gap-2'>
                        <Mic />Stop Recording
                    </h2> : 'Record Answer'
                }
            </Button>

        </>
    );
}

export default SpeechToTextSection;