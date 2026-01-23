
import { AdvancedSearchBar } from "@components/search/searchjobbar";
import { useState } from "react";
import { SearchResult } from "./types";
import ResultsList from "./results";


export function SearchComponent() {

  const [results, setResults] = useState<SearchResult[]>([]);
  return (
      <div className="bg-base-200 py-12">
        <AdvancedSearchBar onResults={setResults} />
        <ResultsList results={results} />
      </div>
    
  );
}
