"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Sparkles,
  Grid,
  Layers,
  Smile,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar as CalendarIcon,
  Clock,
  Mail,
  Phone,
  FileText,
  CheckCircle
} from "lucide-react";

import Container from "@/components/layout/Container";
// 1. Extreme Server Isolation: Import server actions to handle secure endpoints
import { checkAvailability, createBooking, type BookingDetails } from "@/app/book/actions";

// Types
export type BookingData = {
  treatmentId: string;
  treatmentName: string;
  dentistId: string;
  dentistName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientNotes: string;
};

const treatments = [
  { id: "general", name: "General Dentistry", description: "Routine exams, scale, clean, and fillings.", icon: Shield },
  { id: "cosmetic", name: "Cosmetic Dentistry", description: "Veneers, whitening, and aesthetic bonding.", icon: Sparkles },
  { id: "ortho", name: "Orthodontics", description: "Clear aligners and corrective braces.", icon: Grid },
  { id: "implants", name: "Dental Implants", description: "Biocompatible implants and custom crowns.", icon: Layers },
  { id: "pediatric", name: "Pediatric Dentistry", description: "Gentle, fear-free treatments for children.", icon: Smile },
  { id: "emergency", name: "Emergency Care", description: "Same-day treatment for acute pain or trauma.", icon: HeartPulse },
];

const dentists = [
  { id: "maya", name: "Dr. Maya Sharma", specialty: "Cosmetic & Restorative Dentistry", qualification: "BDS, MDS (Prosthodontics)" },
  { id: "arjun", name: "Dr. Arjun Mehta", specialty: "Orthodontics & Clear Aligners", qualification: "BDS, MDS (Orthodontics)" },
  { id: "elena", name: "Dr. Elena Rodrigues", specialty: "Pediatric Dentistry", qualification: "BDS, PG Dip (Paediatric Dentistry)" },
  { id: "daniel", name: "Dr. Daniel Okafor", specialty: "Implants & Oral Surgery", qualification: "BDS, MDS (Oral Surgery)" },
];

function formatDateLabel(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };
  return d.toLocaleDateString("en-US", options);
}

function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 1. Flow Architecture State Machine (Steps 1 to 6)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  // 2. State Security: Single unified state object keeping all inputs intact
  const [formData, setFormData] = useState<BookingData>({
    treatmentId: "",
    treatmentName: "",
    dentistId: "",
    dentistName: "",
    date: "",
    timeSlot: "",
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientNotes: "",
  });

  // State for available slots loaded from the Google Calendar / Mock Server Action
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  const [validationError, setValidationError] = useState<string | null>(null);

  // Guard client-side dependencies cleanly to preserve absolute SSR safety
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);

  // Pre-select treatment from URL query parameters (if present)
  useEffect(() => {
    if (!mounted) return;
    const tParam = searchParams.get("treatment");
    if (tParam && treatments.some((t) => t.id === tParam)) {
      const selectedT = treatments.find((t) => t.id === tParam);
      setFormData((prev) => ({
        ...prev,
        treatmentId: tParam,
        treatmentName: selectedT?.name || "",
      }));
      // Autoselect dentist specialist
      const specialist = dentists.find((d) => {
        if (tParam === "cosmetic" || tParam === "general") return d.id === "maya";
        if (tParam === "ortho") return d.id === "arjun";
        if (tParam === "pediatric") return d.id === "elena";
        if (tParam === "implants" || tParam === "emergency") return d.id === "daniel";
        return false;
      });
      if (specialist) {
        setFormData((prev) => ({
          ...prev,
          dentistId: specialist.id,
          dentistName: specialist.name,
        }));
      }
      setStep(3); // Jump straight to date selection
    }
  }, [searchParams, mounted]);

  // 2. Live FreeBusy Queries: Load available slots from server when date changes
  useEffect(() => {
    if (!formData.date) return;

    setLoadingSlots(true);
    setSlotError(null);
    setAvailableSlots([]);

    checkAvailability(formData.date)
      .then((slots) => {
        setAvailableSlots(slots);
        setLoadingSlots(false);
      })
      .catch((err) => {
        console.error("Availability check error:", err);
        setSlotError("Failed to fetch slots from Google Calendar API. Using fallback slots.");
        setLoadingSlots(false);
      });
  }, [formData.date]);

  if (!mounted) {
    return (
      <div className="flex-1 py-16 flex items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0A5C5C] border-t-transparent" />
      </div>
    );
  }

  // Generate next 14 available days (skipping Sundays)
  const availableDates: Date[] = [];
  const startDay = new Date();
  for (let i = 1; i <= 20; i++) {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    if (d.getDay() !== 0) { // Skip Sundays
      availableDates.push(d);
    }
    if (availableDates.length >= 12) break;
  }

  const handleNext = () => {
    if (step === 1 && !formData.treatmentId) return;
    if (step === 2 && !formData.dentistId) return;
    if (step === 3 && !formData.date) return;
    if (step === 4 && !formData.timeSlot) return;

    if (step === 5) {
      // 3. Client-Side Validation on Step 5 before moving to Step 6
      if (!formData.patientName.trim()) {
        setValidationError("Full Name is required.");
        return;
      }
      if (!formData.patientEmail.trim()) {
        setValidationError("Email Address is required.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.patientEmail)) {
        setValidationError("Please enter a valid email address.");
        return;
      }
      if (!formData.patientPhone.trim()) {
        setValidationError("Phone Number is required.");
        return;
      }
      setValidationError(null);
    }

    setStep((prev) => (prev + 1) as any);
  };

  const handleBack = () => {
    setStep((prev) => (prev - 1) as any);
  };

  // 3. Automatic Scheduling Action: Insert event into Google Calendar
  const handleConfirmSubmit = () => {
    setValidationError(null);
    startTransition(async () => {
      try {
        const res = await createBooking({
          treatmentId: formData.treatmentId,
          treatmentName: formData.treatmentName,
          dentistName: formData.dentistName,
          date: formData.date,
          time: formData.timeSlot,
          patientName: formData.patientName,
          patientEmail: formData.patientEmail,
          patientPhone: formData.patientPhone,
          notes: formData.patientNotes,
        });

        if (res.success) {
          setStep(7);
        } else {
          // Handle API blocks/dropouts gracefully
          setValidationError(res.error || "Failed to schedule appointment. Please try again.");
        }
      } catch (err: any) {
        console.error("Booking submission error:", err);
        setValidationError("A network error occurred. Please verify your connection.");
      }
    });
  };

  const stepProgress = ((step - 1) / 5) * 100;

  // Partition available slots into morning / afternoon
  const morningAvailable = availableSlots.filter((slot) => slot.endsWith("AM"));
  const afternoonAvailable = availableSlots.filter((slot) => slot.endsWith("PM"));

  return (
    <section className="relative flex-1 py-12 flex flex-col justify-center bg-background">
      {/* Background decoration */}
      <div aria-hidden="true" className="absolute -top-12 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#0A5C5C]/5 blur-3xl pointer-events-none" />

      <Container className="flex flex-col items-center">
        {step < 7 && (
          <div className="max-w-xl text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#0F1717]">Book an Appointment</h1>
            <p className="mt-2 text-sm text-[#0F1717]/70 leading-relaxed">
              Secure your treatment time with our premium clinical specialists.
            </p>
          </div>
        )}

        <div className="w-full max-w-2xl rounded-[1.25rem] border border-[#0F1717]/5 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,23,0.05),0_4px_12px_rgba(15,23,23,0.06)] dark:border-white/10 sm:p-10">
          
          {/* Progress Indicators */}
          {step < 7 && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-semibold text-[#0A5C5C] uppercase tracking-wider">
                <span>Step {step} of 6</span>
                <span className="text-[#0F1717]/60">
                  {step === 1 && "Treatment"}
                  {step === 2 && "Dentist"}
                  {step === 3 && "Date"}
                  {step === 4 && "Time Slot"}
                  {step === 5 && "Patient Details"}
                  {step === 6 && "Review & Confirm"}
                </span>
              </div>
              <div className="mt-3 h-1 w-full bg-[#0F1717]/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#0A5C5C] transition-all duration-300 ease-out" 
                  style={{ width: `${stepProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Step Panels */}
          <div className="min-h-[20rem]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-[#0F1717]">Select a Treatment</h2>
                    <p className="text-xs text-[#0F1717]/60 mt-1">Choose the service you wish to schedule.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {treatments.map((t) => {
                      const Icon = t.icon;
                      const isSelected = formData.treatmentId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, treatmentId: t.id, treatmentName: t.name }))}
                          className={`flex items-start gap-4 rounded-[1rem] border p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C5C] hover:border-[#0A5C5C]/30 hover:shadow-[0_2px_8px_rgba(10,92,92,0.05)] ${
                            isSelected
                              ? "border-[#0A5C5C] bg-[#0A5C5C]/5 ring-1 ring-[#0A5C5C]"
                              : "border-[#0F1717]/5"
                          }`}
                        >
                          <div className={`p-2 rounded-full shrink-0 ${isSelected ? "bg-[#0A5C5C] text-white" : "bg-[#0F1717]/5 text-[#0A5C5C]"}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="block text-sm font-semibold text-[#0F1717]">{t.name}</span>
                            <span className="block text-xs text-[#0F1717]/60 mt-1 leading-relaxed">{t.description}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      disabled={!formData.treatmentId}
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 bg-[#0A5C5C] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#0A5C5C]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next Step <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-[#0F1717]">Choose a Dentist</h2>
                    <p className="text-xs text-[#0F1717]/60 mt-1">Select a practitioner or our specialist recommendation.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {dentists.map((d) => {
                      const isSelected = formData.dentistId === d.id;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, dentistId: d.id, dentistName: d.name }))}
                          className={`flex flex-col items-start gap-1 rounded-[1rem] border p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C5C] hover:border-[#0A5C5C]/30 hover:shadow-[0_2px_8px_rgba(10,92,92,0.05)] ${
                            isSelected
                              ? "border-[#0A5C5C] bg-[#0A5C5C]/5 ring-1 ring-[#0A5C5C]"
                              : "border-[#0F1717]/5"
                          }`}
                        >
                          <span className="text-sm font-semibold text-[#0F1717]">{d.name}</span>
                          <span className="text-xs text-[#0A5C5C] font-medium">{d.specialty}</span>
                          <span className="text-[0.7rem] text-[#0F1717]/55 mt-2 leading-relaxed">{d.qualification}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A5C5C] hover:underline"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                    <button
                      type="button"
                      disabled={!formData.dentistId}
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 bg-[#0A5C5C] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#0A5C5C]/90 disabled:opacity-50 transition-colors"
                    >
                      Next Step <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-[#0F1717]">Select a Date</h2>
                    <p className="text-xs text-[#0F1717]/60 mt-1">Available dates for the next two weeks.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {availableDates.map((date) => {
                      const yyyy = date.getFullYear();
                      const mm = String(date.getMonth() + 1).padStart(2, "0");
                      const dd = String(date.getDate()).padStart(2, "0");
                      const dateStr = `${yyyy}-${mm}-${dd}`;
                      const label = formatDateLabel(dateStr);
                      const isSelected = formData.date === dateStr;

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, date: dateStr }))}
                          className={`flex flex-col items-center justify-center rounded-[1rem] border py-4 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C5C] hover:border-[#0A5C5C]/30 hover:shadow-[0_2px_8px_rgba(10,92,92,0.05)] ${
                            isSelected
                              ? "border-[#0A5C5C] bg-[#0A5C5C]/5 ring-1 ring-[#0A5C5C]"
                              : "border-[#0F1717]/5"
                          }`}
                        >
                          <span className="text-[0.65rem] text-[#0F1717]/50 font-medium uppercase tracking-wider">
                            {label.split(",")[0]}
                          </span>
                          <span className="mt-1 text-sm font-bold text-[#0F1717]">
                            {label.split(",")[1]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A5C5C] hover:underline"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                    <button
                      type="button"
                      disabled={!formData.date}
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 bg-[#0A5C5C] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#0A5C5C]/90 disabled:opacity-50 transition-colors"
                    >
                      Next Step <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-[#0F1717]">Select a Time</h2>
                    <p className="text-xs text-[#0F1717]/60 mt-1">
                      Showing schedule availability for {formatDateLabel(formData.date)}.
                    </p>
                  </div>

                  {/* 2. Live FreeBusy Queries: Loader, errors, and empty filtering */}
                  {loadingSlots ? (
                    <div className="flex h-32 flex-col items-center justify-center gap-3">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0A5C5C] border-t-transparent" />
                      <span className="text-xs text-[#0F1717]/60">Checking Google Calendar availability...</span>
                    </div>
                  ) : slotError ? (
                    <div className="p-4 rounded-card border border-red-500/10 bg-red-500/5 text-center text-xs text-red-500">
                      {slotError}
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-[1rem] border border-dashed border-[#0F1717]/10 p-6 text-center">
                      <span className="text-xs font-bold text-[#0F1717]">No slots available</span>
                      <span className="text-[0.7rem] text-[#0F1717]/55">Please choose another date.</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {morningAvailable.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F1717]/60 mb-3">Morning Slots</h3>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {morningAvailable.map((slot) => {
                              const isSelected = formData.timeSlot === slot;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot }))}
                                  className={`rounded-full border py-3 text-center text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C5C] hover:border-[#0A5C5C]/35 ${
                                    isSelected
                                      ? "bg-[#0A5C5C] border-[#0A5C5C] text-white"
                                      : "border-[#0F1717]/5 text-[#0F1717]/80"
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {afternoonAvailable.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F1717]/60 mb-3">Afternoon Slots</h3>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {afternoonAvailable.map((slot) => {
                              const isSelected = formData.timeSlot === slot;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot }))}
                                  className={`rounded-full border py-3 text-center text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C5C] hover:border-[#0A5C5C]/35 ${
                                    isSelected
                                      ? "bg-[#0A5C5C] border-[#0A5C5C] text-white"
                                      : "border-[#0F1717]/5 text-[#0F1717]/80"
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A5C5C] hover:underline"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                    <button
                      type="button"
                      disabled={!formData.timeSlot || loadingSlots}
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 bg-[#0A5C5C] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#0A5C5C]/90 disabled:opacity-50 transition-colors"
                    >
                      Next Step <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-[#0F1717]">Patient Details</h2>
                    <p className="text-xs text-[#0F1717]/60 mt-1">Please provide your contact information.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col">
                        <label htmlFor="patient-name" className="text-xs font-semibold text-[#0F1717]">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="patient-name"
                          value={formData.patientName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, patientName: e.target.value }))}
                          placeholder="Sarah Jenkins"
                          className="mt-2 rounded-[0.625rem] border border-[#0F1717]/10 bg-white px-4 py-2.5 text-xs text-[#0F1717] focus:border-[#0A5C5C] focus:outline-none focus:ring-1 focus:ring-[#0A5C5C]"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="patient-email" className="text-xs font-semibold text-[#0F1717]">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="patient-email"
                          value={formData.patientEmail}
                          onChange={(e) => setFormData((prev) => ({ ...prev, patientEmail: e.target.value }))}
                          placeholder="sarah@example.com"
                          className="mt-2 rounded-[0.625rem] border border-[#0F1717]/10 bg-white px-4 py-2.5 text-xs text-[#0F1717] focus:border-[#0A5C5C] focus:outline-none focus:ring-1 focus:ring-[#0A5C5C]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="patient-phone" className="text-xs font-semibold text-[#0F1717]">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="patient-phone"
                        value={formData.patientPhone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, patientPhone: e.target.value }))}
                        placeholder="+1 (555) 012-3456"
                        className="mt-2 rounded-[0.625rem] border border-[#0F1717]/10 bg-white px-4 py-2.5 text-xs text-[#0F1717] focus:border-[#0A5C5C] focus:outline-none focus:ring-1 focus:ring-[#0A5C5C]"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="patient-notes" className="text-xs font-semibold text-[#0F1717]">
                        Special Notes or Remarks (Optional)
                      </label>
                      <textarea
                        id="patient-notes"
                        rows={3}
                        value={formData.patientNotes}
                        onChange={(e) => setFormData((prev) => ({ ...prev, patientNotes: e.target.value }))}
                        placeholder="Please specify if you have any sensitivities or specific requests."
                        className="mt-2 rounded-[0.625rem] border border-[#0F1717]/10 bg-white px-4 py-2.5 text-xs text-[#0F1717] focus:border-[#0A5C5C] focus:outline-none focus:ring-1 focus:ring-[#0A5C5C]"
                      />
                    </div>

                    {validationError && (
                      <p className="text-xs font-semibold text-red-500">{validationError}</p>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A5C5C] hover:underline"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 bg-[#0A5C5C] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#0A5C5C]/90 transition-colors"
                    >
                      Next Step <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-[#0F1717]">Confirmation Screen</h2>
                    <p className="text-xs text-[#0F1717]/60 mt-1">Review your selections before securing your appointment.</p>
                  </div>

                  {/* Summary Card */}
                  <div className="rounded-[1rem] border border-[#0F1717]/5 bg-[#F9F9F9] p-6 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A5C5C]">Appointment Overview</h3>
                    <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed text-[#0F1717]/90">
                      <div className="flex gap-2">
                        <Shield className="h-4 w-4 shrink-0 text-[#0A5C5C]" />
                        <div>
                          <strong className="block text-[#0F1717]">Treatment:</strong>
                          <span>{formData.treatmentName}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <User className="h-4 w-4 shrink-0 text-[#0A5C5C]" />
                        <div>
                          <strong className="block text-[#0F1717]">Dentist:</strong>
                          <span>{formData.dentistName}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CalendarIcon className="h-4 w-4 shrink-0 text-[#0A5C5C]" />
                        <div>
                          <strong className="block text-[#0F1717]">Date:</strong>
                          <span>{formatDateLabel(formData.date)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-[#0A5C5C]" />
                        <div>
                          <strong className="block text-[#0F1717]">Time Slot:</strong>
                          <span>{formData.timeSlot}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1rem] border border-[#0F1717]/5 bg-[#F9F9F9] p-6 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A5C5C]">Patient Details</h3>
                    <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed text-[#0F1717]/90">
                      <div className="flex gap-2">
                        <User className="h-4 w-4 shrink-0 text-[#0A5C5C]" />
                        <div>
                          <strong className="block text-[#0F1717]">Name:</strong>
                          <span>{formData.patientName}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Mail className="h-4 w-4 shrink-0 text-[#0A5C5C]" />
                        <div>
                          <strong className="block text-[#0F1717]">Email:</strong>
                          <span>{formData.patientEmail}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-[#0A5C5C]" />
                        <div>
                          <strong className="block text-[#0F1717]">Phone:</strong>
                          <span>{formData.patientPhone}</span>
                        </div>
                      </div>
                      {formData.patientNotes && (
                        <div className="flex gap-2 sm:col-span-2">
                          <FileText className="h-4 w-4 shrink-0 text-[#0A5C5C]" />
                          <div>
                            <strong className="block text-[#0F1717]">Notes:</strong>
                            <span>{formData.patientNotes}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {validationError && (
                    <div className="p-3 rounded-card border border-red-500/10 bg-red-500/5 text-center text-xs text-red-500 font-semibold">
                      {validationError}
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={handleBack}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A5C5C] hover:underline disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={handleConfirmSubmit}
                      className="inline-flex items-center gap-2 bg-[#0A5C5C] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-[0_4px_12px_rgba(10,92,92,0.15)] hover:bg-[#0A5C5C]/90 disabled:opacity-50 transition-colors"
                    >
                      {isPending ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Scheduling...
                        </>
                      ) : (
                        "Confirm Appointment"
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 7 && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-6 space-y-6"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0A5C5C]/10 text-[#0A5C5C]">
                    <CheckCircle className="h-10 w-10" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#0F1717]">Appointment Secured!</h2>
                    <p className="mt-2 text-sm text-[#0F1717]/65 max-w-sm mx-auto leading-relaxed">
                      Thank you, {formData.patientName}. Your appointment has been scheduled successfully.
                    </p>
                  </div>

                  <div className="rounded-[1rem] border border-[#0F1717]/5 bg-[#F9F9F9] p-6 w-full max-w-sm text-left">
                    <dl className="space-y-3 text-xs leading-relaxed text-[#0F1717]/85">
                      <div className="flex justify-between border-b border-[#0F1717]/5 pb-2">
                        <dt className="text-[#0F1717]/60">Treatment:</dt>
                        <dd className="font-semibold">{formData.treatmentName}</dd>
                      </div>
                      <div className="flex justify-between border-b border-[#0F1717]/5 pb-2">
                        <dt className="text-[#0F1717]/60">Dentist:</dt>
                        <dd className="font-semibold">{formData.dentistName}</dd>
                      </div>
                      <div className="flex justify-between border-b border-[#0F1717]/5 pb-2">
                        <dt className="text-[#0F1717]/60">Date:</dt>
                        <dd className="font-semibold">{formatDateLabel(formData.date)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-[#0F1717]/60">Time Slot:</dt>
                        <dd className="font-semibold">{formData.timeSlot}</dd>
                      </div>
                    </dl>
                  </div>

                  <p className="text-[0.7rem] text-[#0F1717]/50 max-w-sm mx-auto leading-relaxed">
                    A calendar invitation has been sent to <strong className="text-[#0F1717]/80">{formData.patientEmail}</strong>. If you need to make changes, please contact us at least 24 hours prior.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full justify-center">
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="rounded-full border border-[#0F1717]/15 px-6 py-3 text-xs font-bold text-[#0F1717] hover:border-[#0A5C5C]/40 hover:text-[#0A5C5C] transition-colors"
                    >
                      Return Home
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          treatmentId: "",
                          treatmentName: "",
                          dentistId: "",
                          dentistName: "",
                          date: "",
                          timeSlot: "",
                          patientName: "",
                          patientEmail: "",
                          patientPhone: "",
                          patientNotes: "",
                        });
                        setStep(1);
                      }}
                      className="rounded-full bg-[#0A5C5C] text-white px-6 py-3 text-xs font-bold hover:bg-[#0A5C5C]/90 shadow-soft transition-colors"
                    >
                      Book Another Visit
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </Container>
    </section>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 py-16 flex items-center justify-center bg-background">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0A5C5C] border-t-transparent" />
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}
