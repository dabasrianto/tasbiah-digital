"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, RotateCcw, Settings } from "lucide-react";

interface TasbihCounterProps {
  initialCount?: number;
  theme?: string;
  fontSize?: string;
  widgetSize?: "small" | "medium" | "large" | "custom";
  customWidth?: number;
  customHeight?: number;
  background?: string;
  customImageUrl?: string;
  onOpenSettings?: () => void;
  onSaveSession?: (count: number) => void;
}

export default function TasbihCounter({
  initialCount = 0,
  theme = "default",
  fontSize = "large",
  widgetSize = "medium",
  customWidth = 320,
  customHeight = 320,
  background = "default",
  customImageUrl = "",
  onOpenSettings,
  onSaveSession,
}: TasbihCounterProps) {
  const [count, setCount] = useState(initialCount);
  const [totalCount, setTotalCount] = useState(0);
  const [lastReset, setLastReset] = useState<Date | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Load counter data from localStorage on component mount
  useEffect(() => {
    const savedCounterData = localStorage.getItem("tasbihCounterData");
    if (savedCounterData) {
      try {
        const data = JSON.parse(savedCounterData);
        setCount(data.count ?? initialCount);
        setTotalCount(data.totalCount ?? 0);
        setLastReset(data.lastReset ? new Date(data.lastReset) : null);
        setSessionStartTime(
          data.sessionStartTime ? new Date(data.sessionStartTime) : new Date(),
        );
      } catch (error) {
        console.error("Error parsing tasbih counter data:", error);
        setSessionStartTime(new Date());
      }
    } else {
      // Start a new session if there's no saved data
      setSessionStartTime(new Date());
    }
  }, [initialCount]);

  // Save counter data to localStorage whenever they change
  useEffect(() => {
    try {
      const counterData = {
        count,
        totalCount,
        lastReset: lastReset?.toISOString() || null,
        sessionStartTime: sessionStartTime?.toISOString() || null,
      };
      localStorage.setItem("tasbihCounterData", JSON.stringify(counterData));
    } catch (error) {
      console.error("Error saving tasbih counter data:", error);
    }
  }, [count, totalCount, lastReset, sessionStartTime]);

  // Size mappings
  const sizeClasses = {
    small: "w-64 h-64",
    medium: "w-80 h-80",
    large: "w-96 h-96",
    custom: "", // Will use inline style for custom size
  };

  // Font size mappings
  const fontSizeClasses = {
    small: "text-4xl",
    medium: "text-5xl",
    large: "text-6xl",
    "extra-large": "text-7xl",
    "2x-large": "text-8xl",
    "3x-large": "text-9xl",
    "4x-large": "text-[10rem]",
    "5x-large": "text-[12rem]",
    // Button styles (these will be handled separately)
    "button-circle": "text-6xl",
    "button-square": "text-6xl",
    "button-pill": "text-6xl",
    "button-minimal": "text-6xl",
  };

  // Theme mappings
  const themeClasses: Record<string, string> = {
    default: "bg-card",
    light: "bg-slate-100",
    dark: "bg-slate-800 text-white",
    blue: "bg-blue-100",
    green: "bg-green-100",
    purple: "bg-purple-100",
    gold: "bg-amber-100",
  };

  // Background mappings
  const backgroundClasses: Record<string, string> = {
    default: "",
    // Gradients
    "gradient-blue": "bg-gradient-to-r from-blue-400 to-blue-600",
    "gradient-green": "bg-gradient-to-r from-green-400 to-green-600",
    "gradient-purple": "bg-gradient-to-r from-purple-400 to-purple-600",
    "gradient-rose": "bg-gradient-to-r from-rose-400 to-rose-600",
    "gradient-amber": "bg-gradient-to-r from-amber-400 to-amber-600",
    // Solid Colors
    "color-slate": "bg-slate-200",
    "color-zinc": "bg-zinc-200",
    "color-stone": "bg-stone-200",
    "color-red": "bg-red-200",
    "color-orange": "bg-orange-200",
    "color-amber": "bg-amber-200",
    "color-yellow": "bg-yellow-200",
    "color-lime": "bg-lime-200",
    "color-green": "bg-green-200",
    "color-emerald": "bg-emerald-200",
    "color-teal": "bg-teal-200",
    "color-cyan": "bg-cyan-200",
    "color-sky": "bg-sky-200",
    "color-blue": "bg-blue-200",
    "color-indigo": "bg-indigo-200",
    "color-violet": "bg-violet-200",
    "color-purple": "bg-purple-200",
    "color-fuchsia": "bg-fuchsia-200",
    "color-pink": "bg-pink-200",
    "color-rose": "bg-rose-200",
    // Patterns
    "pattern-dots":
      "bg-[url('https://www.transparenttextures.com/patterns/dots.png')]",
    "pattern-waves":
      "bg-[url('https://www.transparenttextures.com/patterns/waves.png')]",
    "pattern-grid":
      "bg-[url('https://www.transparenttextures.com/patterns/grid.png')]",
    "pattern-lines":
      "bg-[url('https://www.transparenttextures.com/patterns/diagonal-lines.png')]",
    // Abstract Images
    "image-abstract1":
      "bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80')] bg-cover bg-center",
    "image-abstract2":
      "bg-[url('https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&q=80')] bg-cover bg-center",
    "image-abstract3":
      "bg-[url('https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&q=80')] bg-cover bg-center",
    "image-abstract4":
      "bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80')] bg-cover bg-center",
    // Nature Images
    "image-nature":
      "bg-[url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80')] bg-cover bg-center",
    "image-mountains":
      "bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80')] bg-cover bg-center",
    "image-ocean":
      "bg-[url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80')] bg-cover bg-center",
    "image-forest":
      "bg-[url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80')] bg-cover bg-center",
    // Custom Image
    "custom-image": "",
  };

  const incrementCount = () => {
    setCount((prev) => prev + 1);
    setTotalCount((prev) => prev + 1);
  };

  const resetCount = () => {
    // Save the current session to history if count > 0
    if (count > 0 && sessionStartTime) {
      saveSessionToHistory();
    }

    // Reset the counter
    setCount(0);
    setLastReset(new Date());
    setSessionStartTime(new Date());
  };

  // Save the current session to history
  const saveSessionToHistory = () => {
    if (!sessionStartTime || count === 0) return;

    try {
      const now = new Date();
      const durationMs = now.getTime() - sessionStartTime.getTime();

      // Format duration as mm:ss or hh:mm:ss
      let durationStr = "";
      const seconds = Math.floor(durationMs / 1000) % 60;
      const minutes = Math.floor(durationMs / (1000 * 60)) % 60;
      const hours = Math.floor(durationMs / (1000 * 60 * 60));

      if (hours > 0) {
        durationStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      } else {
        durationStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }

      // Create history entry
      const historyEntry = {
        date: now.toISOString(),
        count,
        duration: durationStr,
      };

      // Get existing history or create new array
      const savedHistory = localStorage.getItem("tasbihHistory");
      let history = [];

      if (savedHistory) {
        try {
          history = JSON.parse(savedHistory);
          if (!Array.isArray(history)) history = [];
        } catch (e) {
          console.error("Error parsing history:", e);
          history = [];
        }
      }

      // Add new entry and save back to localStorage
      history.unshift(historyEntry); // Add to beginning of array
      localStorage.setItem("tasbihHistory", JSON.stringify(history));

      // Call the onSaveSession callback if provided
      if (onSaveSession) {
        onSaveSession(count);
      }
    } catch (error) {
      console.error("Error saving session to history:", error);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        incrementCount();
      } else if (e.key === "r") {
        resetCount();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Determine background style
  let backgroundStyle = {};
  if (background === "custom-image" && customImageUrl) {
    backgroundStyle = {
      backgroundImage: `url(${customImageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  // Determine style based on widget size
  const widgetStyle =
    widgetSize === "custom"
      ? {
          ...backgroundStyle,
          width: `${customWidth}px`,
          height: `${customHeight}px`,
        }
      : background === "custom-image"
        ? backgroundStyle
        : {};

  return (
    <Card
      className={`${widgetSize !== "custom" ? sizeClasses[widgetSize] : ""} ${themeClasses[theme] || themeClasses.default} ${backgroundClasses[background] || ""} flex flex-col items-center justify-center p-4 rounded-xl shadow-lg overflow-hidden`}
      style={widgetStyle}
    >
      <CardContent className="flex flex-col items-center justify-between h-full w-full p-0">
        <div className="flex justify-end w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings size={20} />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
          <div
            className={`${fontSizeClasses[fontSize as keyof typeof fontSizeClasses] || fontSizeClasses.large} font-bold text-center`}
          >
            {count}
          </div>

          <div className="text-sm text-muted-foreground">
            Total: {totalCount}
            {lastReset && (
              <span className="ml-2">
                | Last Reset: {lastReset.toLocaleDateString()}
              </span>
            )}
            {sessionStartTime && (
              <span className="ml-2">
                | Session started: {sessionStartTime.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={resetCount}
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12"
            >
              <RotateCcw size={20} />
            </Button>

            <Button
              onClick={incrementCount}
              variant="default"
              size="icon"
              className={`${
                fontSize.includes("button-")
                  ? fontSize === "button-square"
                    ? "rounded-md"
                    : fontSize === "button-pill"
                      ? "rounded-full px-8"
                      : fontSize === "button-minimal"
                        ? "bg-transparent hover:bg-transparent text-primary hover:text-primary/90 shadow-none"
                        : "rounded-full"
                  : "rounded-full"
              } h-16 w-16 ${fontSize !== "button-minimal" ? "bg-primary hover:bg-primary/90" : ""}`}
            >
              <PlusCircle size={24} />
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mt-4">
          Press space or tap to count
        </div>
      </CardContent>
    </Card>
  );
}
