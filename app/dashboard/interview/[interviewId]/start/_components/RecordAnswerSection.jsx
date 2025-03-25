"use client"
import { Button } from '@/components/ui/button'
import { Mic } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text'

// Dynamically import the speech-to-text hook with no SSR
const SpeechToText = dynamic(
  () => import('react-hook-speech-to-text').then(mod => ({ default: mod.default })),
  { ssr: false }
);

function RecordAnswerSection() {
    const [userAnswer, setUserAnswer] = useState('');
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    if (!isClient) {
        return (
            <div className='flex items-center justify-center flex-col'>
                <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
                    <Image src={'/webcam.svg'} width={200} height={200} className='absolute' alt="Webcam placeholder" />
                    <div style={{ height: 300, width: '100%' }} className="bg-gray-100" />
                </div>
                <Button variant="outline" className="my-10">Loading...</Button>
            </div>
        );
    }
    
    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
                <Image src={'/webcam.svg'} width={200} height={200} className='absolute' alt="Webcam placeholder" 
 />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,
                    }} />
            </div>
            <SpeechToTextSection userAnswer={userAnswer} setUserAnswer={setUserAnswer} />
        </div>
    )
}

// Create a separate component for the speech-to-text functionality
function SpeechToTextSection({ userAnswer, setUserAnswer }) {
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        if (results.length > 0) {
            results.map((result) => (
                setUserAnswer(prevAns => prevAns + result.transcript)
            ))
        }
    }, [results, setUserAnswer]);

    return (
        <>
            <Button 
                variant="outline" 
                className="my-10" 
                onClick={isRecording ? stopSpeechToText : startSpeechToText}
            >
                {isRecording ?
                    <h2 className='text-red-600 flex items-center gap-2'>
                        <Mic/>Stop Recording
                    </h2> : 'Record Answer'
                }
            </Button>

            <Button onClick={() => console.log(userAnswer)}>Show User Answer</Button>
        </>
    )
}

export default RecordAnswerSection