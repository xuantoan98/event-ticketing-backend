import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function toUTC(date: string | Date): Date {
  return dayjs(date).utc().toDate();
}

export function toLocal(date: string | Date, format = "YYYY-MM-DD HH:mm"): string {
  return dayjs.utc(date).local().format(format);
}

export function formatDateTime(date: string | Date, format = "YYYY-MM-DD HH:mm", isUTC = false): string {
  return isUTC ? dayjs.utc(date).format(format) : dayjs(date).format(format);
}

export function formatDate(date: string | Date, format = "YYYY-MM-DD", isUTC = false): string {
  return isUTC ? dayjs.utc(date).format(format) : dayjs(date).format(format);
}

export function nowUTC(): string {
  return dayjs().utc().toISOString();
}