"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface WidgetSettingsProps {
  currentWidgetSize: "small" | "medium" | "large" | "custom";
  customWidth?: number;
  customHeight?: number;
  onWidgetSizeChange: (size: "small" | "medium" | "large" | "custom") => void;
  onCustomWidthChange?: (width: number) => void;
  onCustomHeightChange?: (height: number) => void;
}

export default function WidgetSettings({
  currentWidgetSize,
  customWidth = 320,
  customHeight = 320,
  onWidgetSizeChange,
  onCustomWidthChange,
  onCustomHeightChange,
}: WidgetSettingsProps) {
  const [showCustomSliders, setShowCustomSliders] = useState(
    currentWidgetSize === "custom",
  );

  const handleSizeChange = (value: string) => {
    onWidgetSizeChange(value as "small" | "medium" | "large" | "custom");
    setShowCustomSliders(value === "custom");
  };

  const widgetSizes = [
    { id: "small", name: "Small", dimensions: "w-16 h-16" },
    { id: "medium", name: "Medium", dimensions: "w-20 h-20" },
    { id: "large", name: "Large", dimensions: "w-24 h-24" },
    { id: "custom", name: "Custom Size", dimensions: "w-20 h-20" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Widget Size</h3>
      <p className="text-sm text-muted-foreground">
        Choose the size of your counter widget
      </p>

      <RadioGroup
        value={currentWidgetSize}
        onValueChange={handleSizeChange}
        className="space-y-3 pt-2"
      >
        {widgetSizes.map((size) => (
          <div key={size.id} className="flex items-center space-x-2">
            <RadioGroupItem value={size.id} id={`size-${size.id}`} />
            <Label
              htmlFor={`size-${size.id}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div
                className={`${size.dimensions} bg-muted rounded-md flex items-center justify-center`}
              >
                <div className="text-xs">Counter</div>
              </div>
              <span>{size.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {showCustomSliders && (
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="width-slider">Width: {customWidth}px</Label>
            </div>
            <Slider
              id="width-slider"
              min={200}
              max={800}
              step={10}
              value={[customWidth]}
              onValueChange={(values) =>
                onCustomWidthChange && onCustomWidthChange(values[0])
              }
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="height-slider">Height: {customHeight}px</Label>
            </div>
            <Slider
              id="height-slider"
              min={200}
              max={800}
              step={10}
              value={[customHeight]}
              onValueChange={(values) =>
                onCustomHeightChange && onCustomHeightChange(values[0])
              }
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
