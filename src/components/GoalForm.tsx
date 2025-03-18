"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Goal } from "./DhikrGoals";

interface GoalFormProps {
  onSubmit: (goal: Omit<Goal, "id" | "createdAt">) => void;
  onCancel: () => void;
  initialData?: Goal;
}

export default function GoalForm({
  onSubmit,
  onCancel,
  initialData,
}: GoalFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [targetCount, setTargetCount] = useState(
    initialData?.targetCount.toString() || "33",
  );
  const [currentCount, setCurrentCount] = useState(
    initialData?.currentCount.toString() || "0",
  );
  const [schedule, setSchedule] = useState(initialData?.schedule || "Daily");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      targetCount: parseInt(targetCount),
      currentCount: parseInt(currentCount),
      schedule,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Dhikr Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Subhanallah"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetCount">Target Count</Label>
        <Input
          id="targetCount"
          type="number"
          min="1"
          value={targetCount}
          onChange={(e) => setTargetCount(e.target.value)}
          required
        />
      </div>

      {initialData && (
        <div className="space-y-2">
          <Label htmlFor="currentCount">Current Progress</Label>
          <Input
            id="currentCount"
            type="number"
            min="0"
            max={targetCount}
            value={currentCount}
            onChange={(e) => setCurrentCount(e.target.value)}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="schedule">Schedule</Label>
        <Select value={schedule} onValueChange={setSchedule}>
          <SelectTrigger id="schedule">
            <SelectValue placeholder="Select schedule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="One-time">One-time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update" : "Create"} Goal</Button>
      </div>
    </form>
  );
}
