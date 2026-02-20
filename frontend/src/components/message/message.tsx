import { authClient } from "@lib/auth-client";
import { edenTreatyApi } from "@lib/eden";
import React, { useEffect, useState } from "react";


type Message = {
  messageId: number;
  businessName: string | null;
  businessId: string | null
  message: string;
  subject: string;
  senderName: string | null; 
  senderId: string | null;
  replyToId: number | null
  senderRole: string;
  date: Date;
};

// Mock data shown before fetch completes
const mockProfile: Message = {
  messageId: 0,
  businessName: "Loading business...",
  businessId: "none",
  message: "Loading message...",
  subject: "Loading subject...",
  senderId: "loading id...",
  senderName: "Loading name",
  senderRole: "Dummy",
  replyToId: null,
  date: new Date()

};

interface MessageProps {
  id: string;
  businessId:string;
  recursionDepth: number
}

export const Message: React.FC<MessageProps> = ({ id, recursionDepth, businessId }) => {
  const { data: session, isPending } = authClient.useSession();
  const [message, setMessage] = useState<Message>(mockProfile);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sentMessage, setSentMessage] = useState("");
  const [subject, setSubject] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (session?.user.role === "user") {
      const sentId = parseInt(id)
      const res = await edenTreatyApi.message.user.reply.post({ message: sentMessage, subject: subject, id: sentId })
      if (res.error) {
        setError("something happened bruh")
        setLoading(false)
        return;
      } else {
        setLoading(false)
        return;
      }
    }
    if (session?.user.role === "business") {

    }
    setLoading(false);

  }


  useEffect(() => {
    const fetchProfile = async () => {
      if (session !== null) {
        if (session?.user.role === "user") {
          try {
            const res = await edenTreatyApi.message.user.viewmessage({ id: id }).get();
            if (!res.data) throw new Error("Failed to fetch message");
            const data: Message = res.data;
            setMessage(data);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }
        else if (session?.user.role === "business") {
          try {
            const res = await edenTreatyApi.message.business.viewmessage({id:id}).business({businessId : businessId}).get();
            if (!res.data) throw new Error("Failed to fetch message");
            const data: Message = res.data;
            setMessage(data);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }
      }
    }


    fetchProfile();
  }, [id, isPending]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            {message.senderRole === "business" ? <div>
              <h2 className ="card-title text-2xl">{message.businessName}</h2> 
              <h3 className="card-title text-2x1">sender:{message.senderName}</h3>
              </div>
              :
              <h2 className="card-title text-2xl">{message.senderName}</h2>}
            <p className="leading-relaxed">subject: {message.subject}</p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title">message</h3>
          <p className="leading-relaxed">{message.message}</p>
          {message.replyToId !== null && <div>
            <h3>in reply to: </h3>
            <Message recursionDepth={1} businessId={businessId} id={message.replyToId.toString()} /> </div>}
        </div>
      </div>

      {recursionDepth !== 1 && message.senderId !== session?.user.id && <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <h1 className="text-xl font-semibold">Reply</h1>
        <input
          type="text"
          placeholder="subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="message"
          required
          value={sentMessage}
          onChange={(e) => setSentMessage(e.target.value)}
          className="w-full border p-2 rounded"
        /> 
      

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {loading ? "sending message ..." : "send message"}
        </button>
      </form>
      }
      {businessId && recursionDepth !== 0 && <a className="btn btn-lg" href={`viewmail.html?id=${id}&businessId=${businessId}`} > Go to post </a> }
      {businessId === null && recursionDepth !== 0 && <a className="btn btn-lg" href={`viewmail.html?id=${id}`} > Go to post </a> }
    </div>

  );
};
