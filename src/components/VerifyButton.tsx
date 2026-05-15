"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface VerifyButtonProps {
  reportId: string;
  isVerified: boolean;
}

export default function VerifyButton({ reportId, isVerified: initialIsVerified }: VerifyButtonProps) {
  const [isVerified, setIsVerified] = useState(initialIsVerified);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/reports/${reportId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify report');
      }
      
      setIsVerified(true);
      router.refresh();
    } catch (error) {
      console.error('Error verifying report:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isVerified) {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-300">
        ✓ Verified
      </span>
    );
  }
  
  return (
    <button
      onClick={handleVerify}
      disabled={isLoading}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Verifying...' : 'Verify Report'}
    </button>
  );
}