"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PracticeLab from "@/components/practice/PracticeLab";
import { recordCommandAttempt } from "@/lib/progress/progress-store";
import { useAuth } from "@/lib/auth/auth-context";

export default function PracticePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleRecordCommandAttempt = (missionId, isSuccess, rawCommand) => {
    recordCommandAttempt(missionId, isSuccess, rawCommand, user?.id);
  };

  return (
    <AppShell>
      <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto">
        <PracticeLab
          onRecordCommandAttempt={handleRecordCommandAttempt}
          onOpenGlossary={() => {
            router.push("/glossary");
          }}
        />
      </div>
    </AppShell>
  );
}
