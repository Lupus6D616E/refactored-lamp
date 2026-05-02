"use client";

import { edenTreatyApi } from "@lib/eden";
import { useState, useRef, KeyboardEvent } from "react";
import { SearchResult } from "./types";


const cities = [
  "Manila",
  "Caloocan",
  "Las Piñas",
  "Makati",
  "Malabon",
  "Mandaluyong",
  "Marikina",
  "Muntinlupa",
  "Navotas",
  "Parañaque",
  "Pasay",
  "Quezon City",
  "San Juan",
  "Taguig",
  "Valenzuela",
  "Pateros",
];
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const sortedCities = [...cities].sort();
const employments = ["Full Time", "Part Time", "Internship"];

interface SearchFilters {
  searchText: string;
  city: string;
  employments: string;
  salaryMinimum: number | "";
  tags: string[];
  schedule: string[];
  tagsMode: string ;
  scheduleMode: string;
}
interface Props {
  onResults: (results:SearchResult[]) => void;
}

export function AdvancedSearchBar({ onResults }: Props) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchText: "",
    city: "All",
    employments: "All",
    salaryMinimum: "",
    tags: [],
    schedule: [],
    tagsMode: "loose",
    scheduleMode: "loose"
  });


  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };
  const toTitleCase = (str: string): string => {
    return str
      .trim()
      .toLowerCase()
      .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  };
  const [currentTag, setCurrentTag] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    const trimmed = toTitleCase(currentTag.trim());
    if (trimmed && !filters.tags.includes(trimmed)) {
      setFilters((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
      setCurrentTag("");
      tagInputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSearch = async () => {
    console.log("Search submitted:", filters);
    // Optional: you can skip empty values or let backend handle them
    const cleanFilters = {
      title: filters.searchText || undefined,
      city: filters.city || undefined,
      employmentType: filters.employments,
      salaryMinimum: filters.salaryMinimum || undefined,
      tags: filters.tags.length > 0 ? filters.tags : undefined,
      schedule: selectedDays.length > 0 ? selectedDays : undefined,
      tagsMode: filters.tagsMode,
      scheduleMode: filters.scheduleMode
    };

    try {
      const response = await edenTreatyApi.search.jobpost.get({
        query: cleanFilters,
      });

      if (response.error) {
        console.error("Search error:", response.error);
        // Handle error (e.g. toast notification)
        return;
      }

      console.log("Search results:", response.data);
      onResults(response.data.results)
      // Update UI with response.data.results, etc.
    } catch (err) {
      console.error("Network/search failed:", err);
    }
  };
  
  const smartSearch = async () => {
     try {
      const response = await edenTreatyApi.search.jobpost.personalized.get({
      });
      if (response.error) {
        console.error("Search error:", response.error);
        // Handle error (e.g. toast notification)
        return;
      }
      console.log("Search results:", response.data);
      onResults(response.data.results)
      // Update UI with response.data.results, etc.
    } catch (err) {
      console.error("Network/search failed:", err);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="bg-base-100 rounded-xl shadow-lg p-6 border border-base-300">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* 1. Main search text */}
          <div className="lg:col-span-2">
            <label className="label">
              <span className="label-text">Search</span>
            </label>
            <input
              type="text"
              placeholder="Job Title..."
              className="input input-bordered w-full focus:input-primary"
              value={filters.searchText}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchText: e.target.value }))
              }
            />
          </div>

          {/* 2. City select */}
          <div>
            <label className="label">
              <span className="label-text">City</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={filters.city}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, city: e.target.value }))
              }
            >
              <option value={"All"}>All</option>
              {sortedCities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Sort select */}
          <div>
            <label className="label">
              <span className="label-text">Job Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={filters.employments}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, employments: e.target.value }))
              }
            >
              <option value={"All"}>All</option>
              {employments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Min salar */}
          <div>
            <label className="label">
              <span className="label-text">Min Salary</span>
            </label>
            <input
              type="number"
              placeholder="0"
              className="input input-bordered w-full"
              min={0}
              value={filters.salaryMinimum}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  salaryMinimum:
                    e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
            />
          </div>
        </div>

        {/* Tags input */}
        <div className="mt-6">
          <label className="label">
            <span className="label-text">Tags</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {filters.tags.map((tag) => (
              <div key={tag} className="badge badge-primary gap-2">
                {tag}
                <button
                  type="button"
                  className="btn btn-xs btn-ghost p-0 min-h-0 h-auto"
                  onClick={() => removeTag(tag)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div>
            <label className="label">
              <span className="label-text">Tag Strictness</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={filters.tagsMode}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, tagsMode: e.target.value }))
              }
            >
              <option value={"loose"}>Loose</option>
              
              <option value={"exact"}>Exact</option>
   
              <option value={"strict"}>Strict</option>
   
            </select>
          </div>
          <div className="flex gap-2">
            <input
              ref={tagInputRef}
              type="text"
              placeholder="Type tag and press Enter or click Add Tag"
              className="input input-bordered flex-1"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddTag}
              disabled={!currentTag.trim()}
            >
              Add Tag
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="label-text font-semibold">Select days</span>

          {DAYS_OF_WEEK.map((day) => (
            <label
              key={day}
              className="label cursor-pointer justify-start gap-3"
            >
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={selectedDays.includes(day)}
                onChange={() => toggleDay(day)}
              />
              <span className="label-text">{day}</span>
            </label>
          ))}

          {/* Debug / preview */}
          <div className="mt-2 text-sm opacity-70">
            Selected: {selectedDays.join(", ") || "None"}
          </div>
        </div>
        <div>
            <label className="label">
              <span className="label-text">Schedule Strictness</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={filters.scheduleMode}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, scheduleMode: e.target.value }))
              }
            >
              <option value={"loose"}>Loose</option>
              
              <option value={"exact"}>Exact</option>
   
              <option value={"strict"}>Strict</option>
   
            </select>
          </div>
        {/* Search button */}
        <div className="mt-8 flex justify-end">
          <button
            className="btn btn-primary btn-lg w-full sm:w-auto"
            onClick={handleSearch}
          >
            Search
          </button>
           <button
            className="btn btn-primary btn-lg w-full sm:w-auto"
            onClick={smartSearch}
          >
            Personalized
          </button>
        </div>
      </div>
    </div>
  );
}
