'use client';

import { edenTreatyApi } from '@backend/src/lib/eden';
import React, { useState } from 'react';

interface Email {
    id: string;
    from: string;
    createdAt: Date; // ISO string from API
    subject: string;
    html: string;
    text: string;
    attachments: string[];
}

interface ReplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    originalEmail: Email | null;
}

const EmailReplyModal: React.FC<ReplyModalProps> = ({
    isOpen,
    onClose,
    originalEmail,
}) => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [file, setFile] = useState<File | undefined>(undefined);


    // Auto-fill subject and body when modal opens
    React.useEffect(() => {
        if (originalEmail && isOpen) {
            setSubject(
                originalEmail.subject.startsWith('Re:')
                    ? originalEmail.subject
                    : `Re: ${originalEmail.subject}`
            );

            // Simple quoted reply format
            const quotedText = `\n\n\nOn ${new Date(originalEmail.createdAt).toLocaleString()}, ${originalEmail.from} wrote:\n> ${originalEmail.text.replace(/\n/g, '\n> ')}`;

            setBody(quotedText);
        }
    }, [originalEmail, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSendReply = async () => {
        if (!originalEmail || !body.trim()) return;

        setIsSending(true);

        try {
            const res = await edenTreatyApi.admin.email.reply.post({
                file: file,
                body: body,
                subject: subject,
                id: originalEmail.id
            })
            if (res.status === 200) {
                alert('Reply sent successfully!');
                onClose();
                // Optional: refresh email list or show success toast
            } else {
                alert('Failed to send reply');
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            alert('Something went wrong while sending reply');
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen || !originalEmail) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-3xl">
                <h3 className="font-bold text-2xl mb-6">Reply</h3>

                {/* To Field */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text font-medium">To</span>
                    </label>
                    <input
                        type="text"
                        value={originalEmail.from}
                        disabled
                        className="input input-bordered bg-base-200"
                    />
                </div>

                {/* Subject Field */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text font-medium">Subject</span>
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="input input-bordered"
                        placeholder="Subject"
                    />
                </div>

                {/* Reply Body */}
                <div className="form-control mb-6">
                    <label className="label">
                        <span className="label-text font-medium">Message</span>
                    </label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="textarea textarea-bordered h-80 font-mono text-sm"
                        placeholder="Write your reply here..."
                    />
                </div>
                <div className="form-control mb-6">
                    <label className="label">
                        <span className="label-text font-medium">Attachment</span>
                    </label>
                    <input type="file" className="file-input"
                        onChange={handleFileChange}

                    />
                </div>
                {/* Modal Actions */}
                <div className="modal-action">
                    <button
                        onClick={onClose}
                        className="btn btn-ghost"
                        disabled={isSending}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSendReply}
                        disabled={isSending || !body.trim()}
                        className="btn btn-primary"
                    >
                        {isSending ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Sending...
                            </>
                        ) : (
                            'Send Reply'
                        )}
                    </button>
                </div>
            </div>

            {/* Backdrop */}
            <div className="modal-backdrop" onClick={onClose}>
                <button>close</button>
            </div>
        </div>
    );
};

export default EmailReplyModal;