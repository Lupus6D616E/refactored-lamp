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
    <div className="w-full max-w-5xl mx-auto p-4 animate-in fade-in duration-300">
  <div className="bg-base-100 rounded-2xl shadow-xl p-6 sm:p-8 border border-base-200 ">
    {/* Section 1: Main Credentials Filters */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
      {/* 1. Main search text */}
      <div className="lg:col-span-2 ">
        <label className="label pt-0">
          <span className="label-text font-semibold text-xs uppercase tracking-wider opacity-70">Search Job</span>
        </label>

        <div className="relative">

          <input
            type="text"
            placeholder="Job Title, keywords, or company..."
            className="input input-bordered w-full focus:input-primary pl-4 transition-all"
            value={filters.searchText}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchText: e.target.value }))
            }
          />
        </div>
      </div>

      {/* 2. City select */}

      <div>
        <label className="label pt-0">
          <span className="label-text font-semibold text-xs uppercase tracking-wider opacity-70">City</span>
        </label>

        <select
          className="select select-bordered w-full focus:border-primary transition-all"
          value={filters.city}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, city: e.target.value }))
          }

        >
          <option value={"All"}>📍 All Cities</option>
          {sortedCities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Job Type select */}

      <div>
        <label className="label pt-0">
          <span className="label-text font-semibold text-xs uppercase tracking-wider opacity-70">Job Type</span>
        </label>

        <select
          className="select select-bordered w-full focus:border-primary transition-all"
          value={filters.employments}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, employments: e.target.value }))
          }
        >
          <option value={"All"}>💼 All Types</option>
          {employments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Min Salary */}

      <div>
        <label className="label pt-0">
          <span className="label-text font-semibold text-xs uppercase tracking-wider opacity-70">Min Salary</span>
        </label>

        <div className="relative">

          <input
            type="number"
            placeholder="0"
            className="input input-bordered w-full focus:input-primary transition-all"
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
    </div>

    <div className="divider my-6 opacity-60"></div>

    {/* Section 2: Advanced Settings (Tags & Schedules Side-by-Side) */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* LEFT COLUMN: Tags Settings */}

      <div className="space-y-4 bg-base-200/40 p-5 rounded-2xl border border-base-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">Filter by Tags</span>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-60 font-medium">Strictness:</span>

            <select
              className="select select-bordered select-xs rounded-lg bg-base-100"
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
        </div>

        {/* Input Bar */}

        <div className="flex gap-2">

          <input
            ref={tagInputRef}
            type="text"
            placeholder="Type tag and press Enter..."
            className="input input-bordered input-sm flex-1 bg-base-100"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            className="btn btn-primary btn-sm px-4"
            onClick={handleAddTag}
            disabled={!currentTag.trim()}
          >
            Add
          </button>
        </div>
      {/* Tags Container */}

        <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-base-100 rounded-xl border border-dashed border-base-300">
          {filters.tags.length === 0 && (
            <span className="text-xs opacity-40 italic m-auto">No tags added yet.</span>
          )}
          {filters.tags.map((tag) => (
            <div key={tag} className="badge badge-primary badge-sm gap-1.5 py-2.5 px-3 font-medium rounded-lg">
              {tag}
              <button
                type="button"
                className="hover:bg-primary-focus rounded-full w-3 h-3 flex items-center justify-center text-[10px] transition-colors"
                onClick={() => removeTag(tag)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Schedule Settings */}

      <div className="space-y-4 bg-base-200/40 p-5 rounded-2xl border border-base-200 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold uppercase tracking-wider text-primary">Availability</span>
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-60 font-medium">Strictness:</span>

              <select
                className="select select-bordered select-xs rounded-lg bg-base-100"
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
          </div>

          {/* Days checkboxes container */}
          <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-4 xl:grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map((day) => {
              const isChecked = selectedDays.includes(day);

              return (
                <label
                  key={day}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                    isChecked
                      ? "bg-primary border-primary text-primary-content shadow-sm scale-95"
                      : "bg-base-100 border-base-300 hover:border-base-400 opacity-80"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isChecked}
                    onChange={() => toggleDay(day)}
                  />
                  <span className="text-xs font-bold tracking-tight">{day.slice(0, 3)}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Subtle Preview Indicator */}
        <div className="text-[11px] opacity-60 mt-2 flex items-center gap-1.5 bg-base-100 px-3 py-1.5 rounded-lg border border-base-300">
          <span className="font-semibold">Selected:</span>
          <span className="truncate italic">{selectedDays.join(", ") || "None selected"}</span>
        </div>
      </div>
    </div>

    {/* Section 3: Action Submission Control Panel */}

    <div className="mt-8 pt-4 border-t border-base-200 flex flex-col-reverse sm:flex-row justify-end gap-3">

      <button
        className="btn btn-outline btn-primary px-8 shadow-sm group"
        onClick={smartSearch}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 opacity-70 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Personalized
      </button>

      <button
        className="btn btn-primary px-10 shadow-md shadow-primary/20"
        onClick={handleSearch}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search Jobs
      </button>
    </div>
  </div>
</div>
  );
} 

