import { authClient } from "@lib/auth-client";
import { SearchResult } from "./types";

interface Props {
  results: SearchResult[];
}

export default function ResultsList({ results }: Props) {

    const { data: session, isPending } = authClient.useSession();
  if (!results.length) {
    return (
      <div className="text-center text-gray-500">
        No results yet
      </div>
    );
  }

  const truncateDescription = (text:string, maxLength:number) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength).trim() + '...';
};

  return (
    <div className="grid gap-4">
      {results.map((item) => (
        <div key={item.id} className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">{item.title}</h2>
            <p>{truncateDescription(item.description,300)}</p>
            {session?.user.role === "admin" && (
              <p>JOB ID: {item.id}</p>
            )}
            <p>{item.city}</p>
            <p>{item.employmentType}</p>
            <a  className="btn btn-lg" href={`viewpost.html?id=${item.id}`} > Go to post </a>
          </div>
        </div>
      ))}
    </div>
  );
}