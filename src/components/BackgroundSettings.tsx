"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface BackgroundSettingsProps {
  currentBackground: string;
  onBackgroundChange: (background: string) => void;
  onCustomImageChange: (imageUrl: string) => void;
}

export default function BackgroundSettings({
  currentBackground,
  onBackgroundChange,
  onCustomImageChange,
}: BackgroundSettingsProps) {
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const backgrounds = [
    { id: "default", name: "Default", color: "bg-card" },
    // Gradients
    {
      id: "gradient-blue",
      name: "Blue Gradient",
      color: "bg-gradient-to-r from-blue-400 to-blue-600",
    },
    {
      id: "gradient-green",
      name: "Green Gradient",
      color: "bg-gradient-to-r from-green-400 to-green-600",
    },
    {
      id: "gradient-purple",
      name: "Purple Gradient",
      color: "bg-gradient-to-r from-purple-400 to-purple-600",
    },
    {
      id: "gradient-rose",
      name: "Rose Gradient",
      color: "bg-gradient-to-r from-rose-400 to-rose-600",
    },
    {
      id: "gradient-amber",
      name: "Amber Gradient",
      color: "bg-gradient-to-r from-amber-400 to-amber-600",
    },
    // Solid Colors
    { id: "color-slate", name: "Slate", color: "bg-slate-200" },
    { id: "color-zinc", name: "Zinc", color: "bg-zinc-200" },
    { id: "color-stone", name: "Stone", color: "bg-stone-200" },
    { id: "color-red", name: "Red", color: "bg-red-200" },
    { id: "color-orange", name: "Orange", color: "bg-orange-200" },
    { id: "color-amber", name: "Amber", color: "bg-amber-200" },
    { id: "color-yellow", name: "Yellow", color: "bg-yellow-200" },
    { id: "color-lime", name: "Lime", color: "bg-lime-200" },
    { id: "color-green", name: "Green", color: "bg-green-200" },
    { id: "color-emerald", name: "Emerald", color: "bg-emerald-200" },
    { id: "color-teal", name: "Teal", color: "bg-teal-200" },
    { id: "color-cyan", name: "Cyan", color: "bg-cyan-200" },
    { id: "color-sky", name: "Sky", color: "bg-sky-200" },
    { id: "color-blue", name: "Blue", color: "bg-blue-200" },
    { id: "color-indigo", name: "Indigo", color: "bg-indigo-200" },
    { id: "color-violet", name: "Violet", color: "bg-violet-200" },
    { id: "color-purple", name: "Purple", color: "bg-purple-200" },
    { id: "color-fuchsia", name: "Fuchsia", color: "bg-fuchsia-200" },
    { id: "color-pink", name: "Pink", color: "bg-pink-200" },
    { id: "color-rose", name: "Rose", color: "bg-rose-200" },
    // Patterns
    { id: "pattern-dots", name: "Dots Pattern", color: "bg-slate-100" },
    { id: "pattern-waves", name: "Waves Pattern", color: "bg-slate-100" },
    { id: "pattern-grid", name: "Grid Pattern", color: "bg-slate-100" },
    { id: "pattern-lines", name: "Lines Pattern", color: "bg-slate-100" },
    // Abstract Images
    { id: "image-abstract1", name: "Abstract 1", color: "bg-slate-100" },
    { id: "image-abstract2", name: "Abstract 2", color: "bg-slate-100" },
    { id: "image-abstract3", name: "Abstract 3", color: "bg-slate-100" },
    { id: "image-abstract4", name: "Abstract 4", color: "bg-slate-100" },
    // Nature Images
    { id: "image-nature", name: "Nature", color: "bg-slate-100" },
    { id: "image-mountains", name: "Mountains", color: "bg-slate-100" },
    { id: "image-ocean", name: "Ocean", color: "bg-slate-100" },
    { id: "image-forest", name: "Forest", color: "bg-slate-100" },
    // Custom Image
    { id: "custom-image", name: "Custom Image", color: "bg-slate-100" },
  ];

  const handleCustomImageSubmit = () => {
    if (customImageUrl) {
      onCustomImageChange(customImageUrl);
      onBackgroundChange("custom-image");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Background</h3>
      <p className="text-sm text-muted-foreground">
        Choose a background for your counter
      </p>

      <RadioGroup
        value={currentBackground}
        onValueChange={(value) => {
          onBackgroundChange(value);
          if (value === "custom-image") {
            setShowImageInput(true);
          } else {
            setShowImageInput(false);
          }
        }}
        className="grid grid-cols-2 gap-4 pt-2"
      >
        {backgrounds.map((bg) => (
          <div key={bg.id} className="flex items-center space-x-2">
            <RadioGroupItem value={bg.id} id={`bg-${bg.id}`} />
            <Label
              htmlFor={`bg-${bg.id}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className={`w-5 h-5 rounded-full ${bg.color} border`}></div>
              <span>{bg.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {showImageInput && (
        <div className="pt-2 space-y-2">
          <Label htmlFor="custom-image-url">Image URL</Label>
          <div className="flex gap-2">
            <Input
              id="custom-image-url"
              placeholder="https://example.com/image.jpg"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
            />
            <Button onClick={handleCustomImageSubmit} size="icon">
              <Upload size={16} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter a URL for your custom background image
          </p>
        </div>
      )}
    </div>
  );
}
