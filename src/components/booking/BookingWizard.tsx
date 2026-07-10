"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { checkAvailability, createBooking, type BookingDetails } from "@/app/book/actions";
import { springs } from "@/lib/motion";
import Magnetic from "@/components/ui/Magnetic";

type Step = "treatment" | "date" | "time" | "details" | "confirmation";

const stepsOrder: Step[] = ["treatment", "date", "time", "details", "confirmation"];

type FieldErrors = { name?: string; email?: string; phone?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sleek, height-animated inline field error. */
function FieldError({ id, message }: { id?: string; message?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          key="error"
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={reduceMotion ? { duration: 0 } : { ...springs.press, opacity: { duration: 0.15 } }}
          className="mt-1.5 overflow-hidden text-xs font-medium text-red-500"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

const treatments = [
  { id: "general", name: "General Dentistry", description: "Routine exams, scaling, cleanings, and composite fillings." },
  { id: "cosmetic", name: "Cosmetic Dentistry", description: "Veneers, teeth whitening, smile design, and bonding." },
  { id: "ortho", name: "Orthodontics", description: "Discreet clear aligners and traditional corrective braces." },
  { id: "implants", name: "Dental Implants", description: "Biocompatible titanium implants and lifelike crowns." },
  { id: "pediatric", name: "Pediatric Dentistry", description: "Gentle, fear-free treatments tailored for young children." },
  { id: "emergency", name: "Emergency Care", description: "Immediate treatment for severe pain, tooth fractures, or trauma." },
];

// Helper to format date
function formatDateStr(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateLabel(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function BookingWizardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<Step>("treatment");
  // +1 = advancing, -1 = going back — drives the directional panel slide.
  const [direction, setDirection] = useState(1);
  const [selectedTreatment, setSelectedTreatment] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  // Patient details form state
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientNotes, setPatientNotes] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  
  // Slots and booking state
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookedDetails, setBookedDetails] = useState<BookingDetails | null>(null);
  const [isMocked, setIsMocked] = useState(false);

  // Pre-select treatment if provided in the URL query string
  useEffect(() => {
    const tParam = searchParams.get("treatment");
    if (tParam && treatments.some((t) => t.id === tParam)) {
      setSelectedTreatment(tParam);
      setDirection(1);
      setStep("date");
    }
  }, [searchParams]);

  // Fetch available times when date changes
  useEffect(() => {
    if (!selectedDate) return;

    setLoadingSlots(true);
    setSelectedTime("");
    
    checkAvailability(selectedDate)
      .then((slots) => {
        setAvailableSlots(slots);
        setLoadingSlots(false);
      })
      .catch((err) => {
        console.error("Availability check failed:", err);
        setLoadingSlots(false);
      });
  }, [selectedDate]);

  // Generate next 30 days (excluding Sundays)
  const availableDates: Date[] = [];
  const startDay = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    if (d.getDay() !== 0) {
      availableDates.push(d);
    }
  }

  // Single entry point for step changes so the slide direction stays correct.
  const goToStep = (next: Step) => {
    setDirection(stepsOrder.indexOf(next) >= stepsOrder.indexOf(step) ? 1 : -1);
    setStep(next);
  };

  const handleTreatmentSelect = (id: string) => {
    setSelectedTreatment(id);
    goToStep("date");
  };

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    goToStep("time");
  };

  const handleTimeSelect = (timeStr: string) => {
    setSelectedTime(timeStr);
    goToStep("details");
  };

  const handleBack = () => {
    const currentIndex = stepsOrder.indexOf(step);
    if (currentIndex > 0) {
      goToStep(stepsOrder[currentIndex - 1]);
    }
  };

  const validateDetails = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!patientName.trim()) errs.name = "Please enter your full name.";

    const email = patientEmail.trim();
    if (!email) errs.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(email)) errs.email = "Enter a valid email address.";

    const phoneDigits = patientPhone.replace(/\D/g, "");
    if (!patientPhone.trim()) errs.phone = "Please enter your phone number.";
    else if (phoneDigits.length < 7) errs.phone = "Enter a valid phone number.";

    return errs;
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict, per-field validation — no submit with missing/invalid contact info.
    const errs = validateDetails();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setBookingError(null);
    const treatmentObj = treatments.find((t) => t.id === selectedTreatment);
    const details: BookingDetails = {
      treatmentId: selectedTreatment,
      treatmentName: treatmentObj?.name || selectedTreatment,
      date: selectedDate,
      time: selectedTime,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim(),
      patientPhone: patientPhone.trim(),
      notes: patientNotes.trim(),
    };

    startTransition(async () => {
      try {
        const res = await createBooking(details);
        if (res.success) {
          setBookedDetails(details);
          setIsMocked(!!res.mocked);
          goToStep("confirmation");
        } else {
          setBookingError(res.error || "Something went wrong while booking. Please try again.");
        }
      } catch (err) {
        console.error("Booking request failed:", err);
        setBookingError("We couldn't reach the booking service. Please check your connection and try again.");
      }
    });
  };

  const currentStepIndex = stepsOrder.indexOf(step);
  const progressPercent = Math.min(((currentStepIndex + 1) / (stepsOrder.length - 1)) * 100, 100);

  // Weighted, direction-aware panel slide with spring physics.
  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 56 : -56 }),
    center: {
      opacity: 1,
      x: 0,
      transition: reduceMotion ? { duration: 0 } : springs.panel,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir >= 0 ? -56 : 56,
      transition: reduceMotion ? { duration: 0 } : springs.panel,
    }),
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-card border border-deep-charcoal/5 bg-background p-6 shadow-soft dark:border-white/10 sm:p-10">
      {/* Progress Bar & Header */}
      {step !== "confirmation" && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <span className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">
              Step {currentStepIndex + 1} of {stepsOrder.length - 1}
            </span>
            <span className="text-body-sm font-semibold capitalize text-foreground">
              {step === "details" ? "Patient Information" : step}
            </span>
          </div>
          <div className="mt-3.5 h-1 w-full rounded-full bg-surface dark:bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={reduceMotion ? { duration: 0 } : springs.gentle}
              className="h-full rounded-full bg-clinic-teal dark:bg-clinic-teal-soft"
            />
          </div>
        </div>
      )}

      {/* BookingWizard Steps container */}
      <div className="relative min-h-[22rem] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === "treatment" && (
            <motion.div
              key="treatment"
              variants={slideVariants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <h2 className="text-heading-2">Select a Treatment</h2>
                <p className="mt-2 text-body-sm text-muted">
                  Choose the dental service you wish to schedule an appointment for.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {treatments.map((t) => {
                  const isSelected = selectedTreatment === t.id;
                  return (
                    <motion.button
                      key={t.id}
                      type="button"
                      onClick={() => handleTreatmentSelect(t.id)}
                      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                      transition={springs.press}
                      aria-pressed={isSelected}
                      className={`flex flex-col items-start gap-2 rounded-card border p-5 text-left transition-colors duration-[var(--duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinic-teal ${
                        isSelected
                          ? "border-clinic-teal bg-clinic-teal ring-1 ring-clinic-teal dark:border-clinic-teal-soft dark:bg-clinic-teal-soft"
                          : "border-deep-charcoal/5 hover:border-clinic-teal/30 dark:border-white/5 dark:hover:border-clinic-teal-soft/30"
                      }`}
                    >
                      <span
                        className={`text-body-sm font-semibold ${
                          isSelected ? "text-white dark:text-deep-charcoal" : "text-foreground"
                        }`}
                      >
                        {t.name}
                      </span>
                      <span
                        className={`text-xs leading-relaxed ${
                          isSelected ? "text-white/80 dark:text-deep-charcoal/75" : "text-muted"
                        }`}
                      >
                        {t.description}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === "date" && (
            <motion.div
              key="date"
              variants={slideVariants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <h2 className="text-heading-2">Select a Date</h2>
                <p className="mt-2 text-body-sm text-muted">
                  Appointments are available Monday to Saturday.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {availableDates.map((date) => {
                  const formatted = formatDateStr(date);
                  const label = formatDateLabel(date);
                  return (
                    <motion.button
                      key={formatted}
                      type="button"
                      onClick={() => handleDateSelect(formatted)}
                      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                      transition={springs.press}
                      className={`flex flex-col items-center justify-center rounded-card border py-4 text-center transition-colors duration-[var(--duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinic-teal hover:border-clinic-teal/30 dark:hover:border-clinic-teal-soft/30 ${
                        selectedDate === formatted
                          ? "border-clinic-teal bg-clinic-teal/5 ring-1 ring-clinic-teal dark:border-clinic-teal-soft dark:bg-clinic-teal-soft/5"
                          : "border-deep-charcoal/5 dark:border-white/5"
                      }`}
                    >
                      <span className="text-xs text-muted">{label.split(",")[0]}</span>
                      <span className="mt-1 text-body-sm font-semibold text-foreground">
                        {label.split(",")[1]}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-body-sm font-medium text-clinic-teal transition-colors hover:text-clinic-teal/80 active:text-clinic-teal/80 dark:text-clinic-teal-soft"
                >
                  &larr; Back to treatments
                </button>
              </div>
            </motion.div>
          )}

          {step === "time" && (
            <motion.div
              key="time"
              variants={slideVariants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <h2 className="text-heading-2">Select a Time</h2>
                <p className="mt-2 text-body-sm text-muted">
                  Showing available slots on {selectedDate ? formatDateLabel(new Date(selectedDate)) : ""}.
                </p>
              </div>

              {loadingSlots ? (
                <div className="flex h-32 flex-col items-center justify-center gap-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-clinic-teal border-t-transparent dark:border-clinic-teal-soft" />
                  <span className="text-body-sm text-muted">Fetching calendar availability...</span>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-card border border-dashed border-deep-charcoal/10 p-6 text-center dark:border-white/10">
                  <span className="text-body-sm font-semibold text-foreground">No slots available</span>
                  <span className="text-xs text-muted">Please select another date.</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {availableSlots.map((tSlot) => (
                    <motion.button
                      key={tSlot}
                      type="button"
                      onClick={() => handleTimeSelect(tSlot)}
                      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                      transition={springs.press}
                      className={`rounded-pill border py-3.5 text-center text-body-sm font-semibold transition-colors duration-[var(--duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinic-teal hover:border-clinic-teal/30 dark:hover:border-clinic-teal-soft/30 ${
                        selectedTime === tSlot
                          ? "border-clinic-teal bg-clinic-teal text-white dark:border-clinic-teal-soft dark:bg-clinic-teal-soft dark:text-deep-charcoal"
                          : "border-deep-charcoal/5 bg-background text-foreground/80 dark:border-white/5"
                      }`}
                    >
                      {tSlot}
                    </motion.button>
                  ))}
                </div>
              )}

              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-body-sm font-medium text-clinic-teal transition-colors hover:text-clinic-teal/80 active:text-clinic-teal/80 dark:text-clinic-teal-soft"
                >
                  &larr; Back to dates
                </button>
              </div>
            </motion.div>
          )}

          {step === "details" && (
            <motion.div
              key="details"
              variants={slideVariants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <h2 className="text-heading-2">Contact Details</h2>
                <p className="mt-2 text-body-sm text-muted">
                  Provide your contact details to complete the booking.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label htmlFor="name" className="text-xs font-semibold text-foreground">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? "name-error" : undefined}
                      value={patientName}
                      onChange={(e) => {
                        setPatientName(e.target.value);
                        clearFieldError("name");
                      }}
                      placeholder="Sarah Jenkins"
                      className={`mt-2 rounded-button border bg-background px-4 py-2.5 text-body-sm text-foreground focus:outline-none focus:ring-1 ${
                        fieldErrors.name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-deep-charcoal/10 focus:border-clinic-teal focus:ring-clinic-teal dark:border-white/10"
                      }`}
                    />
                    <FieldError id="name-error" message={fieldErrors.name} />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-xs font-semibold text-foreground">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                      value={patientEmail}
                      onChange={(e) => {
                        setPatientEmail(e.target.value);
                        clearFieldError("email");
                      }}
                      placeholder="sarah@example.com"
                      className={`mt-2 rounded-button border bg-background px-4 py-2.5 text-body-sm text-foreground focus:outline-none focus:ring-1 ${
                        fieldErrors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-deep-charcoal/10 focus:border-clinic-teal focus:ring-clinic-teal dark:border-white/10"
                      }`}
                    />
                    <FieldError id="email-error" message={fieldErrors.email} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-xs font-semibold text-foreground">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    aria-invalid={!!fieldErrors.phone}
                    aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                    value={patientPhone}
                    onChange={(e) => {
                      setPatientPhone(e.target.value);
                      clearFieldError("phone");
                    }}
                    placeholder="+1 (555) 012-3456"
                    className={`mt-2 rounded-button border bg-background px-4 py-2.5 text-body-sm text-foreground focus:outline-none focus:ring-1 ${
                      fieldErrors.phone
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-deep-charcoal/10 focus:border-clinic-teal focus:ring-clinic-teal dark:border-white/10"
                    }`}
                  />
                  <FieldError id="phone-error" message={fieldErrors.phone} />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="notes" className="text-xs font-semibold text-foreground">
                    Special Notes or Reason for Visit (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={patientNotes}
                    onChange={(e) => setPatientNotes(e.target.value)}
                    placeholder="E.g., extreme sensitivity in lower teeth, first checkup in 2 years..."
                    className="mt-2 rounded-button border border-deep-charcoal/10 bg-background px-4 py-2.5 text-body-sm text-foreground focus:border-clinic-teal focus:outline-none focus:ring-1 focus:ring-clinic-teal dark:border-white/10"
                  />
                </div>

                <AnimatePresence initial={false}>
                  {bookingError && (
                    <motion.p
                      key="booking-error"
                      role="alert"
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={reduceMotion ? { duration: 0 } : { ...springs.press, opacity: { duration: 0.15 } }}
                      className="overflow-hidden rounded-button border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-body-sm font-medium text-red-500"
                    >
                      {bookingError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-body-sm font-medium text-clinic-teal transition-colors hover:text-clinic-teal/80 active:text-clinic-teal/80 dark:text-clinic-teal-soft"
                  >
                    &larr; Back to time slots
                  </button>

                  <Magnetic strength={0.22} glow>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex items-center justify-center rounded-pill bg-clinic-teal px-6 py-3 font-semibold text-white shadow-soft transition-colors duration-[var(--duration-fast)] hover:bg-clinic-teal/90 active:bg-clinic-teal/90 disabled:opacity-50"
                    >
                      {isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Scheduling...
                        </span>
                      ) : (
                        "Confirm Appointment"
                      )}
                    </button>
                  </Magnetic>
                </div>
              </form>
            </motion.div>
          )}

          {step === "confirmation" && bookedDetails && (
            <motion.div
              key="confirmation"
              variants={slideVariants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center text-center space-y-6"
            >
              <motion.div
                initial={reduceMotion ? { scale: 1 } : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-clinic-teal/10 text-clinic-teal dark:bg-clinic-teal-soft/10 dark:text-clinic-teal-soft"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <motion.polyline
                    points="20 6 9 17 4 12"
                    initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut", delay: 0.35 }}
                  />
                </svg>
              </motion.div>

              <div>
                <h2 className="text-heading-2">Appointment Scheduled!</h2>
                <p className="mt-2 text-body-sm text-muted">
                  Thank you, {bookedDetails.patientName}. Your appointment has been secured.
                </p>
                {isMocked && (
                  <p className="mt-1 text-[0.7rem] italic text-muted">
                    (Mock integration enabled — simulation successful)
                  </p>
                )}
              </div>

              <div className="w-full max-w-sm rounded-card border border-deep-charcoal/5 bg-surface/50 p-6 text-left dark:border-white/5 dark:bg-white/5">
                <dl className="space-y-3.5 text-body-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Treatment:</dt>
                    <dd className="font-semibold text-foreground">{bookedDetails.treatmentName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Date:</dt>
                    <dd className="font-semibold text-foreground">
                      {formatDateLabel(new Date(bookedDetails.date))}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Time:</dt>
                    <dd className="font-semibold text-foreground">{bookedDetails.time}</dd>
                  </div>
                </dl>
              </div>

              <p className="text-xs leading-relaxed text-muted max-w-sm">
                A calendar invitation and email confirmation have been sent to{" "}
                <strong className="text-foreground">{bookedDetails.patientEmail}</strong>. If you need to reschedule or cancel, please contact us at least 24 hours in advance.
              </p>

              <div className="pt-4 flex flex-col w-full sm:flex-row sm:justify-center gap-3">
                <button
                  onClick={() => router.push("/")}
                  className="rounded-pill border border-deep-charcoal/15 px-6 py-3.5 text-body-sm font-semibold text-foreground transition-colors duration-[var(--duration-fast)] hover:border-clinic-teal/40 active:border-clinic-teal/40 hover:text-clinic-teal active:text-clinic-teal dark:border-white/15 dark:hover:text-clinic-teal-soft dark:active:text-clinic-teal-soft"
                >
                  Return Home
                </button>
                <button
                  onClick={() => {
                    // Reset wizard state to allow a new booking
                    setSelectedTreatment("");
                    setSelectedDate("");
                    setSelectedTime("");
                    setPatientName("");
                    setPatientEmail("");
                    setPatientPhone("");
                    setPatientNotes("");
                    setBookedDetails(null);
                    setFieldErrors({});
                    setBookingError(null);
                    goToStep("treatment");
                  }}
                  className="rounded-pill bg-clinic-teal px-6 py-3.5 text-body-sm font-semibold text-white shadow-soft transition-colors duration-[var(--duration-fast)] hover:bg-clinic-teal/90 active:bg-clinic-teal/90"
                >
                  Book Another Visit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BookingWizard() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-2xl items-center justify-center p-12 text-muted">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-clinic-teal border-t-transparent dark:border-clinic-teal-soft" />
        </div>
      }
    >
      <BookingWizardContent />
    </Suspense>
  );
}
