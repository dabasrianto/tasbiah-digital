"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface FontSettingsProps {
  currentFontSize: string;
  onFontChange: (fontSize: string) => void;
}

export default function FontSettings({
  currentFontSize,
  onFontChange,
}: FontSettingsProps) {
  // Map preset sizes to numeric values for the slider
  const fontSizeMap: Record<string, number> = {
    small: 1,
    medium: 2,
    large: 3,
    "extra-large": 4,
    "2x-large": 5,
    "3x-large": 6,
    "4x-large": 7,
    "5x-large": 8,
  };

  // Reverse mapping for slider value to size name
  const sliderToSizeMap: Record<number, string> = {
    1: "small",
    2: "medium",
    3: "large",
    4: "extra-large",
    5: "2x-large",
    6: "3x-large",
    7: "4x-large",
    8: "5x-large",
  };

  // Initialize slider value based on current font size
  const [sliderValue, setSliderValue] = useState<number[]>([
    fontSizeMap[currentFontSize] || 3,
  ]);

  // Update font size when slider changes
  useEffect(() => {
    const newSize = sliderToSizeMap[sliderValue[0]];
    if (newSize && newSize !== currentFontSize) {
      onFontChange(newSize);
    }
  }, [sliderValue, onFontChange, currentFontSize]);

  // Update slider when font size changes externally
  useEffect(() => {
    const mappedValue = fontSizeMap[currentFontSize] || 3;
    if (mappedValue !== sliderValue[0]) {
      setSliderValue([mappedValue]);
    }
  }, [currentFontSize]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Font Size</h3>
        <p className="text-sm text-muted-foreground">
          Choose the size of the counter numbers
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Small</span>
            <span className="text-sm">5X Large</span>
          </div>
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            max={8}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <div className="text-center py-2 px-4 bg-muted/30 rounded-md">
          <span className="text-sm font-medium">
            Current size: {currentFontSize.replace("-", " ").replace("x", "×")}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mt-6">Counter Style</h3>
        <p className="text-sm text-muted-foreground">
          Choose a style for your dhikr counter button
        </p>

        <RadioGroup
          value={
            currentFontSize.includes("button-")
              ? currentFontSize
              : "button-circle"
          }
          onValueChange={(value) => onFontChange(value)}
          className="grid grid-cols-2 gap-4 pt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="button-circle" id="button-circle" />
            <Label htmlFor="button-circle" className="cursor-pointer">
              Circle Button
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="button-square" id="button-square" />
            <Label htmlFor="button-square" className="cursor-pointer">
              Square Button
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="button-pill" id="button-pill" />
            <Label htmlFor="button-pill" className="cursor-pointer">
              Pill Button
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="button-minimal" id="button-minimal" />
            <Label htmlFor="button-minimal" className="cursor-pointer">
              Minimal
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
