"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Goal } from "./DhikrGoals";

interface GoalProgressProps {
  goal: Goal;
  onIncrement: (id: string) => void;
  onBack: () => void;
}

export default function GoalProgress({
  goal,
  onIncrement,
  onBack,
}: GoalProgressProps) {
  const progress = Math.round((goal.currentCount / goal.targetCount) * 100);
  const isComplete = goal.currentCount >= goal.targetCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <h3 className="text-lg font-medium">{goal.title}</h3>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <div className="text-5xl font-bold">
                {goal.currentCount}{" "}
                <span className="text-muted-foreground text-lg">
                  / {goal.targetCount}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {goal.schedule} goal
              </p>
            </div>

            <Progress value={progress} className="h-2 w-full" />

            <div className="pt-4">
              {isComplete ? (
                <div className="text-center space-y-2">
                  <div className="text-xl font-medium text-green-600 dark:text-green-400">
                    Goal Completed!
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Congratulations on completing your dhikr goal
                  </p>
                </div>
              ) : (
                <Button
                  onClick={() => onIncrement(goal.id)}
                  size="lg"
                  className="rounded-full h-16 w-16 mx-auto flex items-center justify-center"
                >
                  <PlusCircle size={24} />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
