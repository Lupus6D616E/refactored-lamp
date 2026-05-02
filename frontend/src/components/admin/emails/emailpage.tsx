'use client';

import { edenTreatyApi } from '@lib/eden';
import React, { useState, useEffect } from 'react';
import { Letter } from 'react-letter';
import EmailReplyModal from './emailreplymodal';

interface Email {
  id: string;
  from: string;
  createdAt: Date; // ISO string from API
  subject: string;
  html: string;
  text: string;
  attachments: string[];
}

interface Pagination {
  page: number;
  totalPages: number;
  totalEmails: number;
}

const EmailInbox: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const fetchEmails = async (page: number) => {
    setLoading(true);
    try {
      const res = await edenTreatyApi.admin.getemails({page:page}).get()
      if(res.data){
        const data = res.data
      setEmails(data.emails || []);
      setPagination(data.pagination || null);
      setCurrentPage(page);
      }

    } catch (error) {
      console.error('Failed to fetch emails:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page < 1 || (pagination && page > pagination.totalPages)) return;
    fetchEmails(page);
  };

  const getAttachment = (attachmentId: string) => {
    window.open(`/admin/email/getfile/${attachmentId}`,"_blank")
  }

  const openEmail = (email: Email) => {
    setSelectedEmail(email);
  };

  return (
    <div className="flex h-screen bg-base-100">
      {/* Inbox Sidebar */}
      <div className="w-2/5 border-r border-base-300 flex flex-col">
        <div className="p-4 border-b border-base-300 bg-base-200">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="btn btn-sm btn-outline flex-1"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination || currentPage === pagination.totalPages || loading}
              className="btn btn-sm btn-outline flex-1"
            >
              Next
            </button>
          </div>

          {/* Page Input */}
          {pagination && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-base-content/70">Page</span>
              <input
                type="number"
                min={1}
                max={pagination.totalPages}
                value={currentPage}
                onChange={(e) => handlePageChange(parseInt(e.target.value))}
                className="input input-bordered input-sm w-20 text-center"
              />
              <span className="text-sm text-base-content/70">
                of {pagination.totalPages}
              </span>
            </div>
          )}
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : emails.length === 0 ? (
            <div className="p-8 text-center text-base-content/60">No emails found</div>
          ) : (
            <div className="divide-y divide-base-300">
              {emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => openEmail(email)}
                  className={`p-4 hover:bg-base-200 cursor-pointer transition-colors ${
                    selectedEmail?.id === email.id ? 'bg-base-300' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium truncate">{email.from}</div>
                    <div className="text-xs text-base-content/60 whitespace-nowrap ml-2">
                    
                    </div>
                  </div>
                  <div className="font-semibold mt-1 line-clamp-1">{email.subject}</div>
                  <div className="text-sm text-base-content/70 line-clamp-2 mt-1">
                    {email.text}
                  </div>
                  {email.attachments.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      <div className="badge badge-sm badge-outline">
                        {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Email Preview */}
      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <div className="flex-1 p-8 overflow-auto">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold">{selectedEmail.subject}</h2>
                <div className="mt-4 flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content w-12 rounded-full flex items-center justify-center font-bold">
                      {selectedEmail.from[0].toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">{selectedEmail.from}</div>
                    <div className="text-sm text-base-content/60">
                      {selectedEmail.createdAt.toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-base max-w-none">
                <Letter 
                html={selectedEmail.html}
                text={selectedEmail.text}
                />
              </div>
              {selectedEmail.attachments.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-semibold mb-3">Attachments</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedEmail.attachments.map((attachment, idx) => (
                      <div
                        key={idx}
                        onClick={() => {getAttachment(attachment)}}
                        className="flex items-center gap-3 p-4 border border-base-300 rounded-xl hover:bg-base-200 cursor-pointer"
                      >
                        <div className="text-3xl">📎</div>
                        <div className="truncate">
                          <div className="font-medium">{attachment}</div>
                          <div className="text-xs text-base-content/60">Click to download</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
              )}

               <div className="p-4 border-t border-base-300 bg-base-200">
    <button
      onClick={() => setIsReplyModalOpen(true)}
      className="btn btn-primary gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6 6-6" />
      </svg>
      Reply
    </button>
  </div>

            </div>
            
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-base-content/50">
            <div className="text-center">
              <div className="text-6xl mb-4">✉️</div>
              <p className="text-xl">Select an email to read</p>
            </div>
          </div>
        )}
      </div>
      <EmailReplyModal
  isOpen={isReplyModalOpen}
  onClose={() => setIsReplyModalOpen(false)}
  originalEmail={selectedEmail}
/>

    </div>

    
  );
};

export default EmailInbox;