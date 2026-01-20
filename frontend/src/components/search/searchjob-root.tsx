"use client";
import { createRoot } from "react-dom/client";
import { authClient } from "backend/src/lib/auth-client";
import { AdvancedSearchBar } from "@components/search/searchjobbar";
import { useState } from "react";
import { SearchResult } from "./types";
import ResultsList from "./results";


function App() {

  const [results, setResults] = useState<SearchResult[]>([]);
  const { data: session, isPending } = authClient.useSession();
  if (!session?.user) {
    return (
      <>
        <p> You are not logged in! </p>
        <p>
          {" "}
          <a href="/public/signin.html">Return to Sign-In</a>
        </p>
      </>
    );
  }
  return (
    <main>
      <div className="min-h-screen bg-base-200 py-12">
        <AdvancedSearchBar onResults={setResults} />
        <ResultsList results={results} />
      </div>
    </main>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
