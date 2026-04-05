import { differenceInDays, parseISO } from "date-fns";

export function getDaysTogether(dateString: string | null | undefined): number {
  if (!dateString) return 0;
  try {
    const start = parseISO(dateString);
    return Math.max(0, differenceInDays(new Date(), start));
  } catch (e) {
    return 0;
  }
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (e) {
    return "";
  }
}
