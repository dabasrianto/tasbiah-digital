"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Calendar,
  MapPin,
  RefreshCw,
  Locate,
  Clock,
  Moon,
  Sun,
} from "lucide-react";

interface Prayer {
  name: string;
  time: string;
  arabicName?: string;
}

interface Location {
  country: string;
  region: string;
  subDistrict: string;
  latitude: number;
  longitude: number;
}

interface PrayerMethod {
  id: number;
  name: string;
  description: string;
}

export default function PrayerSchedule() {
  const [prayers, setPrayers] = useState<Prayer[]>([
    { name: "Fajr", arabicName: "الفجر", time: "05:30" },
    { name: "Sunrise", arabicName: "الشروق", time: "06:45" },
    { name: "Dhuhr", arabicName: "الظهر", time: "12:30" },
    { name: "Asr", arabicName: "العصر", time: "15:45" },
    { name: "Maghrib", arabicName: "المغرب", time: "18:15" },
    { name: "Isha", arabicName: "العشاء", time: "19:45" },
  ]);
  const [location, setLocation] = useState<Location>({
    country: "Indonesia",
    region: "Jakarta",
    subDistrict: "Central Jakarta",
    latitude: -6.2088,
    longitude: 106.8456,
  });
  const [locationString, setLocationString] = useState(
    "Central Jakarta, Jakarta, Indonesia",
  );
  const [date, setDate] = useState("");
  const [hijriDate, setHijriDate] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextPrayer, setNextPrayer] = useState<Prayer | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState("");
  const [countries, setCountries] = useState([
    "Indonesia",
    "Malaysia",
    "Saudi Arabia",
    "United Arab Emirates",
    "Turkey",
    "United States",
    "United Kingdom",
  ]);
  const [regions, setRegions] = useState([
    "Jakarta",
    "Bali",
    "Surabaya",
    "Bandung",
  ]);
  const [subDistricts, setSubDistricts] = useState([
    "Central Jakarta",
    "South Jakarta",
    "East Jakarta",
    "West Jakarta",
  ]);
  const [usingGPS, setUsingGPS] = useState(false);
  const [calculationMethod, setCalculationMethod] = useState<number>(3); // Default to Indonesian Ministry of Religious Affairs
  const [adjustments, setAdjustments] = useState({
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  });
  const [activeTab, setActiveTab] = useState("daily");
  const [monthlyPrayers, setMonthlyPrayers] = useState<{
    [key: string]: Prayer[];
  }>({});

  const calculationMethods: PrayerMethod[] = [
    { id: 1, name: "Muslim World League", description: "Fajr: 18°, Isha: 17°" },
    {
      id: 2,
      name: "Egyptian General Authority",
      description: "Fajr: 19.5°, Isha: 17.5°",
    },
    {
      id: 3,
      name: "Indonesian Ministry of Religious Affairs",
      description: "Fajr: 20°, Isha: 18°",
    },
    {
      id: 4,
      name: "Umm al-Qura University, Makkah",
      description: "Fajr: 18.5°, Isha: 90min after Maghrib",
    },
    {
      id: 5,
      name: "University of Islamic Sciences, Karachi",
      description: "Fajr: 18°, Isha: 18°",
    },
    {
      id: 6,
      name: "Islamic Society of North America",
      description: "Fajr: 15°, Isha: 15°",
    },
    {
      id: 7,
      name: "Union des Organisations Islamiques de France",
      description: "Fajr: 12°, Isha: 12°",
    },
  ];

  // Set current date and detect timezone on component mount
  useEffect(() => {
    updateDate(new Date());
    detectUserLocation();
  }, []);

  const updateDate = (date: Date) => {
    // Set Gregorian date
    setDate(
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );

    // Calculate Hijri date (simplified approximation)
    // In a real app, you would use a proper Hijri calendar library
    const timestamp = date.getTime();
    const hijriYear = Math.floor(timestamp / 31556952000 + 1390); // Rough approximation
    const hijriMonths = [
      "Muharram",
      "Safar",
      "Rabi' al-Awwal",
      "Rabi' al-Thani",
      "Jumada al-Awwal",
      "Jumada al-Thani",
      "Rajab",
      "Sha'ban",
      "Ramadan",
      "Shawwal",
      "Dhu al-Qi'dah",
      "Dhu al-Hijjah",
    ];
    const hijriMonth =
      hijriMonths[Math.floor((timestamp % 31556952000) / 2629746000)];
    const hijriDay = Math.floor((timestamp % 2629746000) / 86400000 + 1);

    setHijriDate(`${hijriDay} ${hijriMonth} ${hijriYear} H`);
  };

  // Update location string when location changes
  useEffect(() => {
    setLocationString(
      `${location.subDistrict}, ${location.region}, ${location.country}`,
    );
  }, [location]);

  // Calculate next prayer time
  useEffect(() => {
    const calculateNextPrayer = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      // Convert prayer times to minutes since midnight for comparison
      const prayerMinutes = prayers.map((prayer) => {
        const [hours, minutes] = prayer.time.split(":").map(Number);
        return { ...prayer, minutesSinceMidnight: hours * 60 + minutes };
      });

      // Find the next prayer
      const next = prayerMinutes.find(
        (prayer) => prayer.minutesSinceMidnight > currentTime,
      );

      // If no prayer is found, the next prayer is the first prayer of tomorrow
      const nextPrayerTime = next || prayerMinutes[0];

      setNextPrayer({
        name: nextPrayerTime.name,
        arabicName: nextPrayerTime.arabicName,
        time: nextPrayerTime.time,
      });

      // Calculate time until next prayer
      let minutesUntil;
      if (next) {
        minutesUntil = next.minutesSinceMidnight - currentTime;
      } else {
        // If next prayer is tomorrow, add 24 hours worth of minutes
        minutesUntil =
          prayerMinutes[0].minutesSinceMidnight + (24 * 60 - currentTime);
      }

      const hoursUntil = Math.floor(minutesUntil / 60);
      const remainingMinutes = minutesUntil % 60;

      setTimeUntilNext(`${hoursUntil}h ${remainingMinutes}m`);
    };

    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [prayers]);

  // Detect user's location and timezone using browser APIs
  const detectUserLocation = () => {
    // Get timezone information
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log("Detected timezone:", timezone);

      // Try to extract country/region from timezone
      const parts = timezone.split("/");
      if (parts.length >= 2) {
        const region = parts[1].replace(/_/g, " ");
        // Set approximate location based on timezone
        setLocationFromTimezone(timezone, region);
      }
    } catch (err) {
      console.error("Error detecting timezone:", err);
    }
  };

  // Set location based on timezone information
  const setLocationFromTimezone = (timezone: string, region: string) => {
    // Map of common timezones to approximate coordinates
    const timezoneMap: Record<
      string,
      { country: string; region: string; lat: number; lng: number }
    > = {
      "Asia/Jakarta": {
        country: "Indonesia",
        region: "Jakarta",
        lat: -6.2088,
        lng: 106.8456,
      },
      "Asia/Makassar": {
        country: "Indonesia",
        region: "Makassar",
        lat: -5.1477,
        lng: 119.4327,
      },
      "Asia/Kuala_Lumpur": {
        country: "Malaysia",
        region: "Kuala Lumpur",
        lat: 3.139,
        lng: 101.6869,
      },
      "Asia/Riyadh": {
        country: "Saudi Arabia",
        region: "Riyadh",
        lat: 24.7136,
        lng: 46.6753,
      },
      "Asia/Dubai": {
        country: "United Arab Emirates",
        region: "Dubai",
        lat: 25.2048,
        lng: 55.2708,
      },
      "Asia/Istanbul": {
        country: "Turkey",
        region: "Istanbul",
        lat: 41.0082,
        lng: 28.9784,
      },
      "America/New_York": {
        country: "United States",
        region: "New York",
        lat: 40.7128,
        lng: -74.006,
      },
      "Europe/London": {
        country: "United Kingdom",
        region: "London",
        lat: 51.5074,
        lng: -0.1278,
      },
      // Add more mappings as needed
    };

    if (timezone in timezoneMap) {
      const locationData = timezoneMap[timezone];
      setLocation({
        country: locationData.country,
        region: locationData.region,
        subDistrict: region,
        latitude: locationData.lat,
        longitude: locationData.lng,
      });

      // Update regions and subdistricts based on country
      if (locationData.country === "Indonesia") {
        setRegions(["Jakarta", "Bali", "Surabaya", "Bandung"]);
        setSubDistricts([
          "Central Jakarta",
          "South Jakarta",
          "East Jakarta",
          "West Jakarta",
        ]);
      } else if (locationData.country === "Malaysia") {
        setRegions(["Kuala Lumpur", "Penang", "Johor", "Sabah"]);
        setSubDistricts(["KLCC", "Bukit Bintang", "Chow Kit", "Bangsar"]);
      }
      // Add more country-specific settings as needed
    }
  };

  // Get timezone offset for a specific location
  const getTimezoneOffset = (
    lat: number,
    lng: number,
    date: Date,
  ): number | null => {
    try {
      // This is a simplified approach - in a real app, you would use a timezone API
      // or a library like moment-timezone with a database of timezone boundaries

      // Estimate timezone based on longitude
      // Each 15 degrees of longitude corresponds to approximately 1 hour time difference
      const estimatedOffset = Math.round(lng / 15);

      // Adjust for DST if applicable
      const isDST = isDaylightSavingTime(date, lat, lng);
      const dstAdjustment = isDST ? 1 : 0;

      return estimatedOffset + dstAdjustment;
    } catch (error) {
      console.error("Error calculating timezone offset:", error);
      return null;
    }
  };

  // Simple DST detection (very approximate)
  const isDaylightSavingTime = (
    date: Date,
    lat: number,
    lng: number,
  ): boolean => {
    // Northern hemisphere: DST typically from March to October
    // Southern hemisphere: DST typically from September to April
    const month = date.getMonth();
    const isNorthern = lat > 0;

    if (isNorthern) {
      return month >= 2 && month <= 9; // March to October
    } else {
      return month >= 8 || month <= 3; // September to April
    }
  };

  // Get user's location using browser geolocation API
  const getUserLocation = () => {
    setUsingGPS(true);
    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Try to get location details using reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            );

            if (response.ok) {
              const data = await response.json();
              const country = data.address.country || "Unknown Country";
              const region =
                data.address.state || data.address.city || "Unknown Region";
              const subDistrict =
                data.address.suburb ||
                data.address.town ||
                data.address.village ||
                "Current Location";

              setLocation({
                country,
                region,
                subDistrict,
                latitude,
                longitude,
              });
            } else {
              // Fallback if geocoding fails
              setLocation({
                ...location,
                latitude,
                longitude,
                subDistrict: "Current Location",
                region: "GPS Detected",
                country: "Your Country",
              });
            }
          } catch (error) {
            console.error("Error with reverse geocoding:", error);
            // Fallback if geocoding fails
            setLocation({
              ...location,
              latitude,
              longitude,
              subDistrict: "Current Location",
              region: "GPS Detected",
              country: "Your Country",
            });
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setUsingGPS(false);
          setLoading(false);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUsingGPS(false);
      setLoading(false);
    }
  };

  // Update regions when country changes
  const handleCountryChange = (value: string) => {
    setUsingGPS(false);
    const newLocation = { ...location, country: value };

    // In a real app, you would fetch regions based on the selected country
    // For demo purposes, we'll use predefined lists
    if (value === "Indonesia") {
      setRegions(["Jakarta", "Bali", "Surabaya", "Bandung"]);
      newLocation.region = "Jakarta";
      setSubDistricts([
        "Central Jakarta",
        "South Jakarta",
        "East Jakarta",
        "West Jakarta",
      ]);
      newLocation.subDistrict = "Central Jakarta";
      newLocation.latitude = -6.2088;
      newLocation.longitude = 106.8456;
    } else if (value === "Malaysia") {
      setRegions(["Kuala Lumpur", "Penang", "Johor", "Sabah"]);
      newLocation.region = "Kuala Lumpur";
      setSubDistricts(["KLCC", "Bukit Bintang", "Chow Kit", "Bangsar"]);
      newLocation.subDistrict = "KLCC";
      newLocation.latitude = 3.139;
      newLocation.longitude = 101.6869;
    } else if (value === "Saudi Arabia") {
      setRegions(["Makkah", "Madinah", "Riyadh", "Jeddah"]);
      newLocation.region = "Makkah";
      setSubDistricts(["Al Haram", "Aziziyah", "Rusaifah", "Misfalah"]);
      newLocation.subDistrict = "Al Haram";
      newLocation.latitude = 21.4225;
      newLocation.longitude = 39.8262;
    } else if (value === "United Arab Emirates") {
      setRegions(["Dubai", "Abu Dhabi", "Sharjah", "Ajman"]);
      newLocation.region = "Dubai";
      setSubDistricts(["Downtown", "Jumeirah", "Deira", "Al Barsha"]);
      newLocation.subDistrict = "Downtown";
      newLocation.latitude = 25.2048;
      newLocation.longitude = 55.2708;
    } else if (value === "Turkey") {
      setRegions(["Istanbul", "Ankara", "Izmir", "Bursa"]);
      newLocation.region = "Istanbul";
      setSubDistricts(["Fatih", "Beyoglu", "Kadikoy", "Uskudar"]);
      newLocation.subDistrict = "Fatih";
      newLocation.latitude = 41.0082;
      newLocation.longitude = 28.9784;
    } else if (value === "United States") {
      setRegions(["New York", "California", "Texas", "Florida"]);
      newLocation.region = "New York";
      setSubDistricts(["Manhattan", "Brooklyn", "Queens", "Bronx"]);
      newLocation.subDistrict = "Manhattan";
      newLocation.latitude = 40.7128;
      newLocation.longitude = -74.006;
    } else if (value === "United Kingdom") {
      setRegions(["London", "Manchester", "Birmingham", "Liverpool"]);
      newLocation.region = "London";
      setSubDistricts(["Westminster", "Camden", "Kensington", "Hackney"]);
      newLocation.subDistrict = "Westminster";
      newLocation.latitude = 51.5074;
      newLocation.longitude = -0.1278;
    }

    setLocation(newLocation);
  };

  // Update subdistricts when region changes
  const handleRegionChange = (value: string) => {
    setUsingGPS(false);
    const newLocation = { ...location, region: value };

    // In a real app, you would fetch subdistricts based on the selected region
    // For demo purposes, we'll use predefined lists and approximate coordinates
    if (location.country === "Indonesia") {
      if (value === "Jakarta") {
        setSubDistricts([
          "Central Jakarta",
          "South Jakarta",
          "East Jakarta",
          "West Jakarta",
        ]);
        newLocation.subDistrict = "Central Jakarta";
        newLocation.latitude = -6.2088;
        newLocation.longitude = 106.8456;
      } else if (value === "Bali") {
        setSubDistricts(["Denpasar", "Ubud", "Kuta", "Seminyak"]);
        newLocation.subDistrict = "Denpasar";
        newLocation.latitude = -8.6705;
        newLocation.longitude = 115.2126;
      } else if (value === "Surabaya") {
        setSubDistricts([
          "Central Surabaya",
          "North Surabaya",
          "East Surabaya",
          "South Surabaya",
        ]);
        newLocation.subDistrict = "Central Surabaya";
        newLocation.latitude = -7.2575;
        newLocation.longitude = 112.7521;
      } else if (value === "Bandung") {
        setSubDistricts([
          "Bandung City",
          "North Bandung",
          "South Bandung",
          "East Bandung",
        ]);
        newLocation.subDistrict = "Bandung City";
        newLocation.latitude = -6.9175;
        newLocation.longitude = 107.6191;
      }
    } else if (location.country === "Malaysia") {
      if (value === "Kuala Lumpur") {
        setSubDistricts(["KLCC", "Bukit Bintang", "Chow Kit", "Bangsar"]);
        newLocation.subDistrict = "KLCC";
        newLocation.latitude = 3.139;
        newLocation.longitude = 101.6869;
      } else if (value === "Penang") {
        setSubDistricts([
          "Georgetown",
          "Bayan Lepas",
          "Butterworth",
          "Balik Pulau",
        ]);
        newLocation.subDistrict = "Georgetown";
        newLocation.latitude = 5.4141;
        newLocation.longitude = 100.3288;
      }
    } else if (location.country === "Saudi Arabia") {
      if (value === "Makkah") {
        setSubDistricts(["Al Haram", "Aziziyah", "Rusaifah", "Misfalah"]);
        newLocation.subDistrict = "Al Haram";
        newLocation.latitude = 21.4225;
        newLocation.longitude = 39.8262;
      } else if (value === "Madinah") {
        setSubDistricts(["Al Masjid an Nabawi", "Quba", "Al Arid", "Al Awali"]);
        newLocation.subDistrict = "Al Masjid an Nabawi";
        newLocation.latitude = 24.4672;
        newLocation.longitude = 39.6111;
      }
    }
    // Add more conditions for other countries as needed

    setLocation(newLocation);
  };

  // Calculate prayer times based on location and method
  const calculatePrayerTimes = (
    date: Date,
    lat: number,
    lng: number,
    method: number,
  ) => {
    // Get timezone offset for the location
    // This is more accurate than using the browser's timezone
    const tzOffset = getTimezoneOffset(lat, lng, date);

    // This is a simplified calculation - in a real app, you would use a proper prayer time calculation library
    // or API like Aladhan API (https://aladhan.com/prayer-times-api)

    // Get day of year
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        86400000,
    );

    // Use calculated timezone offset or fall back to browser's timezone
    const timezoneOffset = tzOffset || -date.getTimezoneOffset() / 60;

    // Calculate solar declination and equation of time
    const D = dayOfYear;
    const g = (357.529 + 0.98560028 * D) % 360; // Mean anomaly of the sun
    const q = (280.459 + 0.98564736 * D) % 360; // Mean longitude of the sun
    const L =
      (q +
        1.915 * Math.sin((g * Math.PI) / 180) +
        0.02 * Math.sin((2 * g * Math.PI) / 180)) %
      360; // Ecliptic longitude of the sun

    // Equation of time in minutes
    const e =
      229.8 *
      (0.000075 +
        0.001868 * Math.cos((q * Math.PI) / 180) -
        0.032077 * Math.sin((q * Math.PI) / 180) -
        0.014615 * Math.cos((2 * q * Math.PI) / 180) -
        0.040849 * Math.sin((2 * q * Math.PI) / 180));

    // Solar declination
    const decl = 0.4093 * Math.sin(((284 + dayOfYear) * 2 * Math.PI) / 365);

    // Get angles for each prayer time based on calculation method
    let fajrAngle = 18;
    let ishaAngle = 17;

    switch (method) {
      case 1: // Muslim World League
        fajrAngle = 18;
        ishaAngle = 17;
        break;
      case 2: // Egyptian General Authority
        fajrAngle = 19.5;
        ishaAngle = 17.5;
        break;
      case 3: // Indonesian Ministry of Religious Affairs
        fajrAngle = 20;
        ishaAngle = 18;
        break;
      case 4: // Umm al-Qura University, Makkah
        fajrAngle = 18.5;
        ishaAngle = 0; // Isha is 90 minutes after Maghrib
        break;
      case 5: // University of Islamic Sciences, Karachi
        fajrAngle = 18;
        ishaAngle = 18;
        break;
      case 6: // Islamic Society of North America
        fajrAngle = 15;
        ishaAngle = 15;
        break;
      case 7: // Union des Organisations Islamiques de France
        fajrAngle = 12;
        ishaAngle = 12;
        break;
    }

    // Calculate prayer times
    // Convert latitude and longitude to radians
    const latRad = (lat * Math.PI) / 180;

    // Calculate noon time (Dhuhr)
    const noonTime = 12 + timezoneOffset - lng / 15 - e / 60;

    // Calculate Dhuhr time (with adjustment)
    const dhuhrTime = noonTime + adjustments.dhuhr / 60;

    // Calculate Asr time (Shafi'i - shadow length = 1)
    const asrFactor = 1; // Shafi'i (use 2 for Hanafi)
    const asrAngle = Math.atan(
      1 / (asrFactor + Math.tan(Math.abs(latRad - decl))),
    );
    const asrTime = noonTime + (asrAngle * 4) / Math.PI + adjustments.asr / 60;

    // Calculate Maghrib time (sunset)
    const sunsetAngle = Math.acos(
      -Math.sin(latRad) * Math.sin(decl) + Math.cos(latRad) * Math.cos(decl),
    );
    const maghribTime =
      noonTime + (sunsetAngle * 4) / Math.PI + adjustments.maghrib / 60;

    // Calculate Isha time
    let ishaTime;
    if (method === 4) {
      // Umm al-Qura
      ishaTime = maghribTime + 1.5 + adjustments.isha / 60; // 90 minutes after Maghrib
    } else {
      const ishaAngleRad = (ishaAngle * Math.PI) / 180;
      ishaTime =
        noonTime +
        (Math.acos(
          (-Math.sin(ishaAngleRad) - Math.sin(latRad) * Math.sin(decl)) /
            (Math.cos(latRad) * Math.cos(decl)),
        ) *
          4) /
          Math.PI +
        adjustments.isha / 60;
    }

    // Calculate Fajr time
    const fajrAngleRad = (fajrAngle * Math.PI) / 180;
    const fajrTime =
      noonTime -
      (Math.acos(
        (-Math.sin(fajrAngleRad) - Math.sin(latRad) * Math.sin(decl)) /
          (Math.cos(latRad) * Math.cos(decl)),
      ) *
        4) /
        Math.PI +
      adjustments.fajr / 60;

    // Calculate Sunrise time
    const sunriseTime =
      noonTime - (sunsetAngle * 4) / Math.PI + adjustments.sunrise / 60;

    // Format times
    const formatTime = (time: number) => {
      const hours = Math.floor(time);
      const minutes = Math.floor((time - hours) * 60);
      return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    };

    return [
      { name: "Fajr", arabicName: "الفجر", time: formatTime(fajrTime) },
      { name: "Sunrise", arabicName: "الشروق", time: formatTime(sunriseTime) },
      { name: "Dhuhr", arabicName: "الظهر", time: formatTime(dhuhrTime) },
      { name: "Asr", arabicName: "العصر", time: formatTime(asrTime) },
      { name: "Maghrib", arabicName: "المغرب", time: formatTime(maghribTime) },
      { name: "Isha", arabicName: "العشاء", time: formatTime(ishaTime) },
    ];
  };

  // Fetch prayer times based on location
  const fetchPrayerTimes = () => {
    setLoading(true);

    // Calculate prayer times for today
    const today = new Date();
    const calculatedPrayers = calculatePrayerTimes(
      today,
      location.latitude,
      location.longitude,
      calculationMethod,
    );

    setPrayers(calculatedPrayers);
    setLoading(false);

    // If monthly tab is active, calculate for the whole month
    if (activeTab === "monthly") {
      generateMonthlyPrayerTimes();
    }
  };

  // Generate prayer times for the entire month
  const generateMonthlyPrayerTimes = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthlyData: { [key: string]: Prayer[] } = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const prayerTimes = calculatePrayerTimes(
        date,
        location.latitude,
        location.longitude,
        calculationMethod,
      );

      monthlyData[day.toString()] = prayerTimes;
    }

    setMonthlyPrayers(monthlyData);
  };

  // Handle location change and refresh prayer times
  useEffect(() => {
    fetchPrayerTimes();
  }, [location, calculationMethod, adjustments]);

  const handleRefresh = () => {
    fetchPrayerTimes();
  };

  const handleNotificationToggle = () => {
    if (!notificationsEnabled) {
      // Request notification permission
      if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            setNotificationsEnabled(true);
          }
        });
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "monthly" && Object.keys(monthlyPrayers).length === 0) {
      generateMonthlyPrayerTimes();
    }
  };

  // Render monthly prayer times
  const renderMonthlyPrayerTimes = () => {
    const today = new Date();
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Fajr</th>
              <th className="p-2 border">Sunrise</th>
              <th className="p-2 border">Dhuhr</th>
              <th className="p-2 border">Asr</th>
              <th className="p-2 border">Maghrib</th>
              <th className="p-2 border">Isha</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => {
              const dayPrayers = monthlyPrayers[day.toString()];
              if (!dayPrayers) return null;

              const isToday = day === today.getDate();

              return (
                <tr key={day} className={isToday ? "bg-primary/10" : ""}>
                  <td className="p-2 border font-medium">{day}</td>
                  {dayPrayers.map((prayer, index) => (
                    <td key={index} className="p-2 border text-center">
                      {prayer.time}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Prayer Times</CardTitle>
            <div className="text-xs text-muted-foreground">{hijriDate}</div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={getUserLocation}
              disabled={loading}
              className="h-8 w-8"
              title="Use GPS location"
            >
              <Locate size={14} className={usingGPS ? "text-primary" : ""} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={loading}
              className="h-8 w-8"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={14} />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={14} />
          <span>{locationString}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <Tabs
            defaultValue="daily"
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="space-y-4">
              {!usingGPS && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="country" className="text-xs">
                        Country
                      </Label>
                      <Select
                        value={location.country}
                        onValueChange={handleCountryChange}
                      >
                        <SelectTrigger id="country" className="h-8">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="region" className="text-xs">
                        Region
                      </Label>
                      <Select
                        value={location.region}
                        onValueChange={handleRegionChange}
                      >
                        <SelectTrigger id="region" className="h-8">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="subDistrict" className="text-xs">
                        Sub-district
                      </Label>
                      <Select
                        value={location.subDistrict}
                        onValueChange={(value) =>
                          setLocation({ ...location, subDistrict: value })
                        }
                      >
                        <SelectTrigger id="subDistrict" className="h-8">
                          <SelectValue placeholder="Select sub-district" />
                        </SelectTrigger>
                        <SelectContent>
                          {subDistricts.map((subDistrict) => (
                            <SelectItem key={subDistrict} value={subDistrict}>
                              {subDistrict}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="calculationMethod" className="text-xs">
                        Calculation Method
                      </Label>
                      <Select
                        value={calculationMethod.toString()}
                        onValueChange={(value) =>
                          setCalculationMethod(parseInt(value))
                        }
                      >
                        <SelectTrigger id="calculationMethod" className="h-8">
                          <SelectValue placeholder="Select calculation method" />
                        </SelectTrigger>
                        <SelectContent>
                          {calculationMethods.map((method) => (
                            <SelectItem
                              key={method.id}
                              value={method.id.toString()}
                            >
                              {method.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {
                          calculationMethods.find(
                            (m) => m.id === calculationMethod,
                          )?.description
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {nextPrayer && (
                <div className="bg-primary/10 p-3 rounded-md">
                  <div className="text-sm font-medium">Next Prayer</div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <div className="text-lg font-bold">{nextPrayer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {nextPrayer.arabicName}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-bold">{nextPrayer.time}</div>
                      <div className="text-xs text-muted-foreground">
                        in {timeUntilNext}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {prayers.map((prayer) => (
                  <div
                    key={prayer.name}
                    className="flex justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex flex-col">
                      <div className="font-medium">{prayer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {prayer.arabicName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {prayer.name === "Fajr" && (
                        <Moon size={14} className="text-blue-500" />
                      )}
                      {prayer.name === "Sunrise" && (
                        <Sun size={14} className="text-orange-500" />
                      )}
                      {prayer.name === "Dhuhr" && (
                        <Sun size={14} className="text-yellow-500" />
                      )}
                      {prayer.name === "Asr" && (
                        <Sun size={14} className="text-amber-500" />
                      )}
                      {prayer.name === "Maghrib" && (
                        <Sun size={14} className="text-red-500" />
                      )}
                      {prayer.name === "Isha" && (
                        <Moon size={14} className="text-indigo-500" />
                      )}
                      <div>{prayer.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Adhan Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications at prayer times
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={handleNotificationToggle}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monthly">
              {Object.keys(monthlyPrayers).length > 0 ? (
                renderMonthlyPrayerTimes()
              ) : (
                <div className="flex justify-center items-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw
                      size={24}
                      className={loading ? "animate-spin" : ""}
                    />
                    <p>Loading monthly prayer times...</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
