"use client";

import { createContext, useContext, ReactNode } from "react";

interface ReportContextType {
  patientName: string;
  patientAge: number | null;
  reportId: string;
  content: any;
  isVerified: boolean;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ 
  children, 
  value 
}: { 
  children: ReactNode; 
  value: ReportContextType;
}) {
  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
}