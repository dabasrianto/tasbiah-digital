"use client";

import { useState, useEffect } from "react";
import TasbihCounter from "./TasbihCounter";
import SettingsPanel from "./SettingsPanel";
import TasbihHistory from "./TasbihHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TasbihApp() {
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState("default");
  const [fontSize, setFontSize] = useState("large");
  const [widgetSize, setWidgetSize] = useState<
    "small" | "medium" | "large" | "custom"
  >("medium");
  const [customWidth, setCustomWidth] = useState(320);
  const [customHeight, setCustomHeight] = useState(320);
  const [background, setBackground] = useState("default");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [appBackground, setAppBackground] = useState("bg-background");
  const [activeTab, setActiveTab] = useState("counter");
  const [historyUpdated, setHistoryUpdated] = useState(0);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("tasbihSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setTheme(settings.theme || "default");
      setFontSize(settings.fontSize || "large");
      setWidgetSize(settings.widgetSize || "medium");
      setCustomWidth(settings.customWidth || 320);
      setCustomHeight(settings.customHeight || 320);
      setBackground(settings.background || "default");
      setCustomImageUrl(settings.customImageUrl || "");
    }
  }, []);

  // Apply app background based on selected background and save settings to localStorage
  useEffect(() => {
    // Only change app background if it's a solid color or gradient
    if (background.startsWith("color-") || background.startsWith("gradient-")) {
      // For solid colors, use a lighter version for the app background
      if (background.startsWith("color-")) {
        const color = background.split("-")[1];
        setAppBackground(`bg-${color}-50`);
      }
      // For gradients, use a very subtle version of the same gradient
      else if (background.startsWith("gradient-")) {
        const color = background.split("-")[1];
        setAppBackground(`bg-gradient-to-r from-${color}-50 to-${color}-100`);
      }
    }
    // For patterns and images, use a neutral background
    else if (
      background.startsWith("pattern-") ||
      background.startsWith("image-")
    ) {
      setAppBackground("bg-slate-50");
    }
    // Default background
    else {
      setAppBackground("bg-background");
    }

    // Save all settings to localStorage whenever any setting changes
    const settings = {
      theme,
      fontSize,
      widgetSize,
      customWidth,
      customHeight,
      background,
      customImageUrl,
    };
    localStorage.setItem("tasbihSettings", JSON.stringify(settings));
  }, [
    background,
    theme,
    fontSize,
    widgetSize,
    customWidth,
    customHeight,
    customImageUrl,
  ]);

  // Handle saving a session to history
  const handleSaveSession = (count: number) => {
    console.log("Session saved with count:", count);
    setHistoryUpdated((prev) => prev + 1); // Trigger history refresh
    // Switch to history tab after saving a session
    setActiveTab("history");
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 ${appBackground} transition-colors duration-300`}
    >
      <h1 className="text-2xl font-bold mb-4">Digital Tasbih Counter</h1>

      <Tabs
        defaultValue="counter"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-4xl mx-auto"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="counter">Counter</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="counter" className="w-full">
          <div className="flex flex-col md:flex-row gap-6 w-full items-center justify-center">
            <div className="flex-1 flex justify-center">
              <TasbihCounter
                theme={theme}
                fontSize={fontSize}
                widgetSize={widgetSize}
                customWidth={customWidth}
                customHeight={customHeight}
                background={background}
                customImageUrl={customImageUrl}
                onOpenSettings={() => setShowSettings(true)}
                onSaveSession={handleSaveSession}
              />
            </div>

            {showSettings && (
              <div className="flex-1">
                <SettingsPanel
                  onClose={() => setShowSettings(false)}
                  onThemeChange={setTheme}
                  onFontChange={setFontSize}
                  onWidgetSizeChange={setWidgetSize}
                  onCustomWidthChange={setCustomWidth}
                  onCustomHeightChange={setCustomHeight}
                  onBackgroundChange={setBackground}
                  onCustomImageChange={setCustomImageUrl}
                  currentTheme={theme}
                  currentFontSize={fontSize}
                  currentWidgetSize={widgetSize}
                  currentBackground={background}
                  customWidth={customWidth}
                  customHeight={customHeight}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="w-full">
          <TasbihHistory key={historyUpdated} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
