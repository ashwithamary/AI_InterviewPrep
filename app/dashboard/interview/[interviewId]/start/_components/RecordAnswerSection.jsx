"use client"
import { Button } from '@/components/ui/button'
import { Mic } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

const SpeechToTextSection = dynamic(() => import('./SpeechToTextSection'), { ssr: false });


function RecordAnswerSection({mockInterviewQuestion, activeQuestionIndex, interviewData}) {
    const [userAnswer, setUserAnswer] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
                <Image
                    src={'/webcam.svg'}
                    width={200}
                    height={200}
                    className='absolute'
                    alt="Webcam placeholder"
                />
                {isClient ? (
                    <Webcam
                        mirrored={true}
                        style={{
                            height: 300,
                            width: '100%',
                            zIndex: 10,
                        }}
                    />
                ) : (
                    <div style={{ height: 300, width: '100%' }} className="bg-gray-100" />
                )}
            </div>
            {isClient && <SpeechToTextSection 
            userAnswer={userAnswer} 
            setUserAnswer={setUserAnswer} 
            mockInterviewQuestion={mockInterviewQuestion} 
            activeQuestionIndex={activeQuestionIndex} 
            interviewData={interviewData} />}
        </div>
    )
}

export default RecordAnswerSection