"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Edit2, Trash2, ChevronRight } from "lucide-react";
import { Goal } from "./DhikrGoals";

interface GoalListProps {
  goals: Goal[];
  onSelect: (goal: Goal) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export default function GoalList({
  goals,
  onSelect,
  onEdit,
  onDelete,
}: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No goals yet. Create your first dhikr goal!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {goals.map((goal) => {
        const progress = Math.round(
          (goal.currentCount / goal.targetCount) * 100,
        );

        return (
          <Card
            key={goal.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardContent className="p-0">
              <div
                className="p-4 cursor-pointer"
                onClick={() => onSelect(goal)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{goal.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {goal.schedule}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(goal);
                      }}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(goal.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>
                      {goal.currentCount} / {goal.targetCount}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex justify-end mt-2">
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
