import { differenceInDays, parseISO, format, setYear, addYears, isAfter } from "date-fns";
import { id } from "date-fns/locale";

export function getDaysTogether(dateString: string | null | undefined): number {
  if (!dateString) return 0;
  try {
    const start = parseISO(dateString);
    return Math.max(0, differenceInDays(new Date(), start));
  } catch {
    return 0;
  }
}

export function getAnniversaryCountdown(dateString: string | null | undefined): { days: number; months: number; nextDate: Date } | null {
  if (!dateString) return null;
  try {
    const original = parseISO(dateString);
    const now = new Date();
    const thisYear = now.getFullYear();
    let nextAnniversary = setYear(original, thisYear);
    if (!isAfter(nextAnniversary, now)) {
      nextAnniversary = addYears(nextAnniversary, 1);
    }
    const totalDays = differenceInDays(nextAnniversary, now);
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;
    return { days, months, nextDate: nextAnniversary };
  } catch {
    return null;
  }
}

export function getBirthdayCountdown(dateString: string | null | undefined): { days: number; nextDate: Date } | null {
  if (!dateString) return null;
  try {
    const original = parseISO(dateString);
    const now = new Date();
    const thisYear = now.getFullYear();
    let nextBirthday = setYear(original, thisYear);
    if (!isAfter(nextBirthday, now)) {
      nextBirthday = addYears(nextBirthday, 1);
    }
    const days = differenceInDays(nextBirthday, now);
    return { days, nextDate: nextBirthday };
  } catch {
    return null;
  }
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    return format(date, "d MMMM yyyy", { locale: id });
  } catch {
    return "";
  }
}

export function formatShortDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    return format(date, "d MMM", { locale: id });
  } catch {
    return "";
  }
}
