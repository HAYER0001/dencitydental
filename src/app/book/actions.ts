"use server";

import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";

export type BookingDetails = {
  treatmentId: string;
  treatmentName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  notes?: string;
};

// Returns a google calendar client, or null if credentials are missing
function getCalendarClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey) {
    return null;
  }

  try {
    const formattedKey = privateKey.replace(/\\n/g, "\n");
    const auth = new google.auth.JWT({
      email,
      key: formattedKey,
      scopes: SCOPES,
    });
    return google.calendar({ version: "v3", auth });
  } catch (error) {
    console.error("Failed to initialize Google Calendar client:", error);
    return null;
  }
}

// Generate deterministic mock busy slots for local dev
function getMockBusySlots(dateStr: string, allSlots: string[]): string[] {
  // Sum character codes of the date string to create a seed
  const seed = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Deterministically select 2-3 slots to be busy
  const busySlots: string[] = [];
  allSlots.forEach((slot, idx) => {
    // A simple hash function to make busy slots look organic
    const hash = (seed * (idx + 1)) % 7;
    if (hash === 1 || hash === 3) {
      busySlots.push(slot);
    }
  });

  return busySlots;
}

// Appointments run in 45-minute increments (slots spaced 45 mins apart).
const SLOT_DURATION_MIN = 45;
const OPEN_MIN = 10 * 60; // Clinic opens 10:00 AM every open day.

// Closing time (minutes from midnight) per weekday. Sunday is closed — the
// booking UI already excludes Sundays from the date picker.
function closingMinutes(day: number): number | null {
  if (day === 0) return null; // Sunday: closed
  if (day === 2) return 19 * 60; // Tuesday: until 7:00 PM
  return 19 * 60 + 30; // Mon, Wed–Sat: until 7:30 PM
}

// Format minutes-from-midnight into a "hh:mm AM/PM" slot label (parsed by slotToDate).
function minutesToSlotLabel(total: number): string {
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

// Build the 45-minute slot grid for a given date, respecting that day's hours.
// A slot is only offered if the full 45-minute appointment finishes by closing.
function getSlotsForDate(dateStr: string): string[] {
  const day = new Date(`${dateStr}T00:00:00`).getDay();
  const close = closingMinutes(day);
  if (close === null) return [];

  const slots: string[] = [];
  for (let t = OPEN_MIN; t + SLOT_DURATION_MIN <= close; t += SLOT_DURATION_MIN) {
    slots.push(minutesToSlotLabel(t));
  }
  return slots;
}

// Helper to convert slot e.g. "09:00 AM" on date "2026-07-04" to ISO string
function slotToDate(dateStr: string, slotStr: string): Date {
  const [time, period] = slotStr.split(" ");
  const [rawHours, minutes] = time.split(":").map(Number);
  let hours = rawHours;
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }
  
  // Create date using the user's local timezone (represented in dateStr)
  // We'll construct it in local timezone
  const date = new Date(`${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
  return date;
}

export async function checkAvailability(dateStr: string): Promise<string[]> {
  const calendar = getCalendarClient();
  const daySlots = getSlotsForDate(dateStr);

  // Clinic closed on this day (e.g. Sunday) — no slots.
  if (daySlots.length === 0) return [];

  if (!calendar) {
    // Local dev or credentials missing: return mock available slots
    const busy = getMockBusySlots(dateStr, daySlots);
    return daySlots.filter((slot) => !busy.includes(slot));
  }

  try {
    // Time boundaries for this day's operating hours.
    const timeMin = slotToDate(dateStr, daySlots[0]);
    const timeMax = slotToDate(dateStr, daySlots[daySlots.length - 1]);
    // extend past the last slot start to cover its full appointment duration
    timeMax.setMinutes(timeMax.getMinutes() + SLOT_DURATION_MIN);

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        items: [{ id: CALENDAR_ID }],
      },
    });

    const busyPeriods = response.data.calendars?.[CALENDAR_ID]?.busy || [];

    // Filter this day's slots against busy periods.
    const availableSlots = daySlots.filter((slot) => {
      const slotStart = slotToDate(dateStr, slot);
      const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MIN * 60 * 1000);

      // Check if slot overlaps with any busy period
      const isBusy = busyPeriods.some((period) => {
        if (!period.start || !period.end) return false;
        const busyStart = new Date(period.start);
        const busyEnd = new Date(period.end);

        // Overlap check: slotStart < busyEnd && slotEnd > busyStart
        return slotStart < busyEnd && slotEnd > busyStart;
      });

      return !isBusy;
    });

    return availableSlots;
  } catch (error) {
    console.error("Error fetching Google Calendar availability:", error);
    // Graceful fallback to mock availability
    const busy = getMockBusySlots(dateStr, daySlots);
    return daySlots.filter((slot) => !busy.includes(slot));
  }
}

export async function createBooking(details: BookingDetails): Promise<{
  success: boolean;
  eventId?: string;
  error?: string;
  mocked?: boolean;
}> {
  const calendar = getCalendarClient();

  if (!calendar) {
    // Local dev fallback
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      eventId: `mock-event-${Date.now()}`,
      mocked: true,
    };
  }

  try {
    const start = slotToDate(details.date, details.time);
    const end = new Date(start.getTime() + SLOT_DURATION_MIN * 60 * 1000); // 45-minute appointment

    const eventDescription = `
Treatment: ${details.treatmentName}
Patient Name: ${details.patientName}
Patient Phone: ${details.patientPhone}
Notes: ${details.notes || "None"}
    `.trim();

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      sendUpdates: "all", // Send email updates to attendees (the patient)
      requestBody: {
        summary: `Dental Appointment: ${details.patientName} - ${details.treatmentName}`,
        description: eventDescription,
        start: {
          dateTime: start.toISOString(),
        },
        end: {
          dateTime: end.toISOString(),
        },
        attendees: [
          { email: details.patientEmail, displayName: details.patientName },
        ],
        reminders: {
          useDefault: true,
        },
      },
    });

    return {
      success: true,
      eventId: response.data.id || undefined,
    };
  } catch (error) {
    console.error("Error inserting Google Calendar event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create Google Calendar event.",
    };
  }
}
