"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";

interface HistoryEntry {
  date: string;
  count: number;
  duration?: string;
  notes?: string;
}

export default function TasbihHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("tasbihHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setHistory(parsedHistory);
        } else {
          console.error("History is not an array", parsedHistory);
          setHistory([]);
        }
      } catch (error) {
        console.error("Error parsing tasbih history:", error);
        setHistory([]);
      }
    }
  }, []);

  // Delete a history entry
  const deleteEntry = (index: number) => {
    const updatedHistory = [...history];
    updatedHistory.splice(index, 1);
    setHistory(updatedHistory);
    localStorage.setItem("tasbihHistory", JSON.stringify(updatedHistory));
  };

  // Clear all history
  const clearHistory = () => {
    if (confirm("Are you sure you want to delete all history?")) {
      setHistory([]);
      localStorage.removeItem("tasbihHistory");
    }
  };

  // Export history as JSON file
  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `tasbih-history-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Tasbih History</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportHistory}
            disabled={history.length === 0}
            title="Export History"
          >
            <Download size={16} className="mr-1" />
            Export
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearHistory}
            disabled={history.length === 0}
            title="Clear All History"
          >
            <Trash2 size={16} className="mr-1" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No history recorded yet. Complete a tasbih session to see it here.
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {history.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-card rounded-lg border shadow-sm"
              >
                <div>
                  <div className="font-medium">
                    {new Date(entry.date).toLocaleDateString()}{" "}
                    {new Date(entry.date).toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Count: <span className="font-semibold">{entry.count}</span>
                    {entry.duration && (
                      <span className="ml-3">Duration: {entry.duration}</span>
                    )}
                    {entry.notes && (
                      <div className="mt-1 italic">Note: {entry.notes}</div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteEntry(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
