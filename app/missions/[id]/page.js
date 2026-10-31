"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import LessonViewer from "@/components/lessons/LessonViewer";
import { MISSIONS } from "@/lib/lessons/lesson-data";
import {
  useUserProgress,
  recordCommandAttempt,
  recordHintReveal,
  completeCheckpoint,
} from "@/lib/progress/progress-store";
import { useAuth } from "@/lib/auth/auth-context";

export default function MissionWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const missionId = params?.id;
  const { user } = useAuth();
  const { progressState } = useUserProgress();

  const mission = MISSIONS[missionId];

  if (!mission) {
    return (
      <AppShell>
        <div className="p-8 text-center text-cyber-muted space-y-3">
          <p className="text-base font-semibold text-cyber-text">Mission Not Found</p>
          <p className="text-xs">The requested mission ({missionId}) does not exist in the curriculum.</p>
          <Link href="/missions" className="text-xs text-cyber-emerald hover:underline">
            Back to Missions
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleRecordCommandAttempt = (mId, isSuccess, rawCommand) => {
    recordCommandAttempt(mId, isSuccess, rawCommand, user?.id);
  };

  const handleRecordHintReveal = (mId, level) => {
    recordHintReveal(mId, level);
  };

  const handleCompleteCheckpoint = (mId) => {
    completeCheckpoint(mId, user?.id);
  };

  const handleSelectMission = (nextMId) => {
    if (!nextMId) {
      router.push("/missions");
    } else {
      router.push(`/missions/${nextMId}`);
    }
  };

  return (
    <AppShell>
      <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
        <LessonViewer
          missionId={missionId}
          progressState={progressState}
          onRecordCommandAttempt={handleRecordCommandAttempt}
          onRecordHintReveal={handleRecordHintReveal}
          onCompleteCheckpoint={handleCompleteCheckpoint}
          onSelectMission={handleSelectMission}
        />
      </div>
    </AppShell>
  );
}
