"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Palette,
  Type,
  Maximize,
  Target,
  X,
  Image,
  Clock,
  Compass,
} from "lucide-react";
import ThemeSettings from "./ThemeSettings";
import FontSettings from "./FontSettings";
import WidgetSettings from "./WidgetSettings";
import DhikrGoals from "./DhikrGoals";
import BackgroundSettings from "./BackgroundSettings";
import PrayerSchedule from "./PrayerSchedule";
import QiblaDirection from "./QiblaDirection";

interface SettingsPanelProps {
  onClose: () => void;
  onThemeChange: (theme: string) => void;
  onFontChange: (fontSize: string) => void;
  onWidgetSizeChange: (size: "small" | "medium" | "large" | "custom") => void;
  onCustomWidthChange?: (width: number) => void;
  onCustomHeightChange?: (height: number) => void;
  onBackgroundChange?: (background: string) => void;
  onCustomImageChange?: (imageUrl: string) => void;
  currentTheme: string;
  currentFontSize: string;
  currentWidgetSize: "small" | "medium" | "large" | "custom";
  currentBackground?: string;
  customWidth?: number;
  customHeight?: number;
}

export default function SettingsPanel({
  onClose,
  onThemeChange,
  onFontChange,
  onWidgetSizeChange,
  onCustomWidthChange,
  onCustomHeightChange,
  onBackgroundChange = () => {},
  onCustomImageChange = () => {},
  currentTheme = "default",
  currentFontSize = "large",
  currentWidgetSize = "medium",
  currentBackground = "default",
  customWidth = 320,
  customHeight = 320,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState("theme");

  return (
    <Card className="w-full max-w-md bg-card shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Customize your tasbih counter</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger
              value="theme"
              className="flex flex-col items-center gap-1 py-2"
            >
              <Palette size={16} />
              <span className="text-xs">Theme</span>
            </TabsTrigger>
            <TabsTrigger
              value="font"
              className="flex flex-col items-center gap-1 py-2"
            >
              <Type size={16} />
              <span className="text-xs">Font</span>
            </TabsTrigger>
            <TabsTrigger
              value="size"
              className="flex flex-col items-center gap-1 py-2"
            >
              <Maximize size={16} />
              <span className="text-xs">Size</span>
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="flex flex-col items-center gap-1 py-2"
            >
              <Target size={16} />
              <span className="text-xs">Goals</span>
            </TabsTrigger>
            <TabsTrigger
              value="background"
              className="flex flex-col items-center gap-1 py-2"
            >
              <Image size={16} />
              <span className="text-xs">BG</span>
            </TabsTrigger>
            <TabsTrigger
              value="prayer"
              className="flex flex-col items-center gap-1 py-2"
            >
              <Clock size={16} />
              <span className="text-xs">Prayer</span>
            </TabsTrigger>
            <TabsTrigger
              value="qibla"
              className="flex flex-col items-center gap-1 py-2"
            >
              <Compass size={16} />
              <span className="text-xs">Qibla</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theme" className="p-4">
            <ThemeSettings
              currentTheme={currentTheme}
              onThemeChange={onThemeChange}
            />
          </TabsContent>

          <TabsContent value="font" className="p-4">
            <FontSettings
              currentFontSize={currentFontSize}
              onFontChange={onFontChange}
            />
          </TabsContent>

          <TabsContent value="size" className="p-4">
            <WidgetSettings
              currentWidgetSize={currentWidgetSize}
              customWidth={customWidth}
              customHeight={customHeight}
              onWidgetSizeChange={onWidgetSizeChange}
              onCustomWidthChange={onCustomWidthChange}
              onCustomHeightChange={onCustomHeightChange}
            />
          </TabsContent>

          <TabsContent value="goals" className="p-4">
            <DhikrGoals />
          </TabsContent>

          <TabsContent value="background" className="p-4">
            <BackgroundSettings
              currentBackground={currentBackground}
              onBackgroundChange={onBackgroundChange}
              onCustomImageChange={onCustomImageChange}
            />
          </TabsContent>

          <TabsContent value="prayer" className="p-4">
            <PrayerSchedule />
          </TabsContent>

          <TabsContent value="qibla" className="p-4">
            <QiblaDirection />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
