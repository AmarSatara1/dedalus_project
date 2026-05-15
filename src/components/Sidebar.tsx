"use client";

import { useState } from "react";
import { useSidebar } from "@/components/SidebarProvider";
import { useReport } from "@/contexts/ReportContext";
import { fetchCorrections, type Correction } from "@/lib/corrections";
import { editorEvents } from "@/lib/editorEvents";
import CorrectionResult from "./CorrectionResult";

export function SidebarToggle() {
  const { open, toggle } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      aria-label={open ? "Close sidebar" : "Open sidebar"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}

export default function Sidebar() {
  const { open } = useSidebar();
  const [activeTab, setActiveTab] = useState<"patient-info" | "correction">(
    "patient-info",
  );
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [isLoadingCorrections, setIsLoadingCorrections] = useState(false);
  const [hasRequestedCorrections, setHasRequestedCorrections] = useState(false);
  
  const report = useReport();
  const isVerified = report?.isVerified || false;

  const requestCorrections = async () => {
    if (!report?.content) return;
    
    setIsLoadingCorrections(true);
    setHasRequestedCorrections(true);
    
    const contentString = JSON.stringify(report.content);
    const newCorrections = await fetchCorrections(contentString);
    
    setCorrections(newCorrections);
    setIsLoadingCorrections(false);
  };

  const applyCorrection = (correctionText: string) => {
    editorEvents.applyCorrection(correctionText);
    setCorrections(corrections.filter(c => c.text !== correctionText));
  };

  return (
    <aside
      className={`shrink-0 border-r border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-700 dark:bg-zinc-900 ${
        open ? "w-64" : "w-0"
      } overflow-hidden`}
    >
      <div className="flex h-full w-64 flex-col">
        <div className="grid grid-cols-2 border-b border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setActiveTab("patient-info")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "patient-info"
                ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                : "text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            Patient info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("correction")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "correction"
                ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                : "text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            Corrections
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "patient-info" ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Patient Name
                </p>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {report?.patientName || "Not loaded yet"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Age
                </p>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {report?.patientAge ?? "N/A"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {isVerified && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-sm text-amber-700 dark:text-amber-400 text-center">
                    ⚠️ This report is verified. Corrections cannot be requested or applied.
                  </p>
                </div>
              )}
              
              {!hasRequestedCorrections ? (
                <button
                  onClick={requestCorrections}
                  disabled={isLoadingCorrections || isVerified}
                  className={`w-full rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                    isVerified 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isVerified 
                    ? "Cannot request corrections (verified)" 
                    : isLoadingCorrections 
                      ? "Requesting corrections..." 
                      : "Request Corrections"}
                </button>
              ) : isLoadingCorrections ? (
                <div className="text-center py-4">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600"></div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Reviewing the report...
                  </p>
                </div>
              ) : corrections.length === 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center py-4">
                  No corrections suggested.
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {corrections.length} suggestion{corrections.length !== 1 ? 's' : ''}:
                  </p>
                  {corrections.map((correction, index) => (
                    <CorrectionResult
                      key={index}
                      correction={correction}
                      onApply={() => applyCorrection(correction.text)}
                      disabled={isVerified}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}