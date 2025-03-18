"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ThemeSettingsProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function ThemeSettings({
  currentTheme,
  onThemeChange,
}: ThemeSettingsProps) {
  const themes = [
    { id: "default", name: "Default", color: "bg-card" },
    { id: "light", name: "Light", color: "bg-slate-100" },
    { id: "dark", name: "Dark", color: "bg-slate-800" },
    { id: "blue", name: "Blue", color: "bg-blue-100" },
    { id: "green", name: "Green", color: "bg-green-100" },
    { id: "purple", name: "Purple", color: "bg-purple-100" },
    { id: "gold", name: "Gold", color: "bg-amber-100" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Theme</h3>
      <p className="text-sm text-muted-foreground">
        Choose a background theme for your counter
      </p>

      <RadioGroup
        value={currentTheme}
        onValueChange={onThemeChange}
        className="grid grid-cols-2 gap-4 pt-2"
      >
        {themes.map((theme) => (
          <div key={theme.id} className="flex items-center space-x-2">
            <RadioGroupItem value={theme.id} id={`theme-${theme.id}`} />
            <Label
              htmlFor={`theme-${theme.id}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full ${theme.color} border`}
              ></div>
              <span>{theme.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
