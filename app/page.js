"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Bike } from "lucide-react";
import CustomDatePicker from "@/components/boarding/CustomDatePicker";
import Dropdown from "@/components/boarding/Dropdown";
import useLocations from "@/features/onboarding/hooks/useLocations";
import useVehicleTypes from "@/features/onboarding/hooks/useVehicleTypes";
import Button from "@/components/core/Button";



export default function BoardingPage() {
  const router = useRouter();
  const { locations, loading: loadingLocations } = useLocations();
  const { vehicleTypes, loading: loadingVehicleTypes } = useVehicleTypes();

  const loading = loadingLocations || loadingVehicleTypes;

  const [errors, setErrors] = useState({
    location: false,
    vehicleType: false,
    date: false,
  });

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Memoized options
  const locationOptions = useMemo(
    () => (locations || []).map((p) => ({ value: p.id, label: p.name })),
    [locations]
  );

  const vehicleOptions = useMemo(
    () => (vehicleTypes || []).map((v) => ({ value: v.id, label: v.name })),
    [vehicleTypes]
  );

  function validate() {
    const newErrors = {
      location: !selectedLocation,
      vehicleType: !selectedVehicleType,
      date: !selectedDate,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }

  function handleContinue() {
    if (!validate()) return;

    // Convert date to YYYY-MM-DD
    const date = selectedDate.toISOString().split("T")[0];

    // Build the URL
    const url = `/vehicles?location=${encodeURIComponent(
      selectedLocation
    )}&start=${date}&end=${date}&type=${encodeURIComponent(
      selectedVehicleType
    )}`;

    router.push(url);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="px-3 w-full max-w-sm space-y-5">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="text-white">
              <h1 className="text-3xl font-semibold">Destination</h1>
              <p className="mt-1 text-md opacity-80">
                Select your location, vehicle type, and travel date
              </p>
            </div>

            <div className="px-2 py-2 space-y-2 bg-white/80 rounded-lg">
              <Dropdown
                options={locationOptions}
                value={selectedLocation}
                onChange={setSelectedLocation}
                placeholder="Select a province"
                icon={MapPin}
                error={errors.location}
              />

              <Dropdown
                options={vehicleOptions}
                value={selectedVehicleType}
                onChange={setSelectedVehicleType}
                placeholder="Select vehicle type"
                icon={Bike}
                error={errors.vehicleType}
              />

              <CustomDatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                error={errors.date}
              />
            </div>

            <div className="flex justify-between items-center gap-2">
              <Button onClick={handleContinue} disabled={loading}>
                Continue
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}