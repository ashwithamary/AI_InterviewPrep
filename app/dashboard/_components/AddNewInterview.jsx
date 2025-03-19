"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button.jsx";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {chatSession} from '@/utils/geminiai_modal';
import { LoaderCircle } from 'lucide-react';
import {db} from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import {v4 as uuidv4} from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [JsonResponse, setJsonResponse] = useState([]);
  const {user} = useUser();
  
  const onSubmit = async(e) => {
    setLoading(true);
    e.preventDefault()
    console.log(jobPosition, jobDesc, jobExperience);
    const InputPrompt = "Job Position: "+jobPosition+", job description: "+jobDesc+",  year of experience: "+jobExperience+", please give me "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" questions and answers in json format, the fields should be question and answer. \n"

    const result = await chatSession.sendMessage(InputPrompt)
    const MockJsonResponse = (result.response.text()).replace('```json', '').replace('```', '')
    console.log(JSON.parse(MockJsonResponse));
    setJsonResponse(MockJsonResponse);

    if(MockJsonResponse){
    const resp=await db.insert(MockInterview).values({
      mockId:uuidv4(),
      jsonMockResponse:MockJsonResponse,
      jobPosition:jobPosition,
      jobDesc:jobDesc,
      jobExperience:jobExperience,
      createdBy:user?.primaryEmailAddress?.emailAddress,
      createdAt:moment().format('MM-DD-YYYY')
    }).returning({mockId:MockInterview.mockId})

    console.log("Inserted ID:",resp)
    if(resp){
      setLoading(false);
    }
  }else{
    console.log("ERROR");
  }
    setLoading(false);
  }
  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={() => setOpenDialog(true)} >
        <h2 className='text-lg text-center'>+ Add New</h2>
      </div>
      <Dialog open={openDialog} >
        <DialogContent className="absolute top-1/2 inset-x-0 mx-auto max-w-[600px] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tell us more about your job interview</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className="space-y-4 mt-4">
                  <h2>Add details about your job position/role, job description and years of experience</h2>
                  <div>
                    <label className="block text-sm font-medium mb-2">Job role/Position</label>
                    <Input placeholder='Ex: Full Stack Developer' required onChange={(event)=>setJobPosition(event.target.value)}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Description/Tech Stack(In short)</label>
                    <Textarea placeholder='Ex: React, Angula, NodeJs, MySQL, etc.' required onChange={(event)=>setJobDesc(event.target.value)}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <Input placeholder='Ex: 5' type="number" max="50" required onChange={(event)=>setJobExperience(event.target.value)}/>
                  </div>
                </div>
                
                <div className='flex gap-5 justify-end mt-6'>
                  <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {loading?
                    <>
                    <LoaderCircle className='animate-spin' />'Generating from AI'
                    </>: 'Start Interview'}
                    </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default AddNewInterview
