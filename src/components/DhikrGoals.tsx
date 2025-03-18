"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import GoalForm from "./GoalForm";
import GoalList from "./GoalList";
import GoalProgress from "./GoalProgress";

export interface Goal {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  schedule?: string;
  createdAt: string;
}

export default function DhikrGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem("dhikrGoals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Set some example goals for first-time users
      const exampleGoals: Goal[] = [
        {
          id: "1",
          title: "Subhanallah",
          targetCount: 33,
          currentCount: 15,
          schedule: "Daily",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Alhamdulillah",
          targetCount: 33,
          currentCount: 10,
          schedule: "Daily",
          createdAt: new Date().toISOString(),
        },
      ];
      setGoals(exampleGoals);
      localStorage.setItem("dhikrGoals", JSON.stringify(exampleGoals));
    }
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("dhikrGoals", JSON.stringify(goals));
    }
  }, [goals]);

  const addGoal = (goal: Omit<Goal, "id" | "createdAt">) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setGoals([...goals, newGoal]);
    setShowForm(false);
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(
      goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)),
    );
    setSelectedGoal(null);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
    if (selectedGoal?.id === id) {
      setSelectedGoal(null);
    }
  };

  const incrementGoalCount = (id: string) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === id && goal.currentCount < goal.targetCount) {
          return { ...goal, currentCount: goal.currentCount + 1 };
        }
        return goal;
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Dhikr Goals</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedGoal(null);
            setShowForm(true);
          }}
          className="flex items-center gap-1"
        >
          <PlusCircle size={16} />
          <span>New Goal</span>
        </Button>
      </div>

      {showForm ? (
        <GoalForm
          onSubmit={addGoal}
          onCancel={() => setShowForm(false)}
          initialData={selectedGoal || undefined}
        />
      ) : selectedGoal ? (
        <GoalProgress
          goal={selectedGoal}
          onIncrement={incrementGoalCount}
          onBack={() => setSelectedGoal(null)}
        />
      ) : (
        <GoalList
          goals={goals}
          onSelect={setSelectedGoal}
          onDelete={deleteGoal}
          onEdit={(goal) => {
            setSelectedGoal(goal);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}
