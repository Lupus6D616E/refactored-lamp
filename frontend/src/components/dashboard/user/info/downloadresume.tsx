'use client';

import ExperienceList from './experiencelist-parent';
import AddCertificationCard from '@components/dashboard/user/upload/addcertification'
import { ApplicationList } from '@components/dashboard/user/info/seekerapplications'
import AddExperienceCard from '@components/dashboard/user/upload/addexperience'
import { MessageList } from '@components/dashboard/user/info/messages'
import UploadProfilePicture from '@components/dashboard/user/upload/UploadProfilePicture'
import {UpdateProfile} from '@components/dashboard/user/upload/updateprofile'

export function ResumeDownload() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-6 mb-10"> 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        
        <div className="md:col-span-1 space-y-6">
          
          <div className="card bg-base-100 shadow-md p-6 border border-base-200">
            <h3 className="font-bold border-b mb-4 pb-1 text-xs uppercase opacity-50 tracking-widest">
              Resume Management
            </h3>

            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold">DOWNLOAD RESUME</h2>
                <p className="text-xs opacity-60">Get a copy of your uploaded resume.</p>
              </div>

              <div className="card-actions">
                <a 
                  href='/user/downloadmyresume' 
                  className="btn btn-primary btn-sm w-full font-bold"
                  download
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              </div>
            </div>
          </div>

          
          <AddCertificationCard />
          <AddExperienceCard />
          <UploadProfilePicture />
        </div>

       
        <div className="md:col-span-2 space-y-6 min-w-0"> 
          <ExperienceList />
          <ApplicationList />
          <MessageList />
          <UpdateProfile />
        </div>
        
      </div>
    </div>
  );
}