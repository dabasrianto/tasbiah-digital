"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Locate, RefreshCw } from "lucide-react";

export default function QiblaDirection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [deviceSupportsCompass, setDeviceSupportsCompass] = useState(false);

  // Check if device supports compass
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDeviceSupportsCompass(
        "DeviceOrientationEvent" in window &&
          typeof (DeviceOrientationEvent as any).requestPermission ===
            "function",
      );
    }
  }, []);

  // Calculate Qibla direction
  const calculateQiblaDirection = (lat: number, lng: number) => {
    // Coordinates of Kaaba in Mecca
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;

    // Convert to radians
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const kaabaLatRad = (kaabaLat * Math.PI) / 180;
    const kaabaLngRad = (kaabaLng * Math.PI) / 180;

    // Calculate the direction
    const y = Math.sin(kaabaLngRad - lngRad);
    const x =
      Math.cos(latRad) * Math.tan(kaabaLatRad) -
      Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

    // Get the angle in degrees
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    // Normalize to 0-360
    angle = (angle + 360) % 360;

    return angle;
  };

  // Get user's location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          const direction = calculateQiblaDirection(latitude, longitude);
          setQiblaDirection(direction);
          setLoading(false);
        },
        (err) => {
          setError("Error getting location: " + err.message);
          setLoading(false);
        },
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  // Request device orientation permission and start compass
  const startCompass = async () => {
    try {
      if (
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        const permission = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        if (permission === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        } else {
          setError("Permission to access device orientation was denied");
        }
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    } catch (err) {
      setError("Error accessing compass: " + (err as Error).message);
    }
  };

  // Handle device orientation event
  const handleOrientation = (event: DeviceOrientationEvent) => {
    // Alpha is the compass direction the device is facing in degrees
    const alpha = event.alpha;
    if (alpha !== null) {
      setCompassHeading(alpha);
    }
  };

  // Clean up event listener
  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Calculate the actual direction to face for Qibla
  const getQiblaDirectionToFace = () => {
    if (qiblaDirection === null || compassHeading === null) return null;

    // Adjust qibla direction based on device heading
    let directionToFace = qiblaDirection - compassHeading;
    // Normalize to 0-360
    directionToFace = (directionToFace + 360) % 360;

    return directionToFace;
  };

  const directionToFace = getQiblaDirectionToFace();

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Qibla Direction</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={getUserLocation}
              disabled={loading}
              className="h-8 w-8"
              title="Get your location"
            >
              <Locate size={14} />
            </Button>
            {deviceSupportsCompass && (
              <Button
                variant="outline"
                size="icon"
                onClick={startCompass}
                className="h-8 w-8"
                title="Start compass"
              >
                <Compass size={14} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw size={24} className="animate-spin" />
            </div>
          ) : qiblaDirection !== null ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Compass size={24} className="text-primary" />
                  </div>
                </div>

                {/* Qibla direction arrow */}
                <div
                  className="absolute top-1/2 left-1/2 w-1 h-24 bg-primary rounded-full origin-bottom transform -translate-x-1/2"
                  style={{
                    transform: `translateX(-50%) rotate(${directionToFace !== null ? directionToFace : qiblaDirection}deg)`,
                    transformOrigin: "bottom center",
                  }}
                >
                  <div className="w-3 h-3 bg-primary absolute -top-1 left-1/2 transform -translate-x-1/2 rotate-45"></div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-lg font-medium">
                  {qiblaDirection !== null
                    ? `${Math.round(qiblaDirection)}°`
                    : "--"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {compassHeading !== null
                    ? `Your device is facing: ${Math.round(compassHeading)}°`
                    : "Enable compass for real-time direction"}
                </p>
                {userLocation && (
                  <p className="text-xs text-muted-foreground">
                    From {userLocation.latitude.toFixed(4)},{" "}
                    {userLocation.longitude.toFixed(4)}
                  </p>
                )}
              </div>

              <div className="text-sm text-center text-muted-foreground">
                <p>Point the arrow toward Mecca for Qibla direction</p>
                {!deviceSupportsCompass && (
                  <p className="mt-2 text-xs">
                    Compass feature not available on this device
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Click the location button to find Qibla direction</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
