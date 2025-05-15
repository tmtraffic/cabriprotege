
import {
  format,
  parse,
  isValid,
  parseISO,
  formatDistanceToNow,
  formatDistance,
} from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Format a date with a specified format string
 */
export const formatDate = (
  date: Date | string | number | null | undefined,
  formatStr: string = "dd/MM/yyyy"
): string => {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    if (!isValid(dateObj)) return "";
    
    return format(dateObj, formatStr, { locale: ptBR });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (
  date: Date | string | number | null | undefined,
  baseDate?: Date
): string => {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    if (!isValid(dateObj)) return "";
    
    return baseDate 
      ? formatDistance(dateObj, baseDate, { 
          addSuffix: true, 
          locale: ptBR 
        })
      : formatDistanceToNow(dateObj, { 
          addSuffix: true, 
          locale: ptBR 
        });
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "";
  }
};

/**
 * Parse a date from a string using a format string
 */
export const parseDate = (
  dateString: string | null | undefined,
  formatStr: string = "dd/MM/yyyy"
): Date | null => {
  if (!dateString) return null;
  
  try {
    const parsedDate = parse(dateString, formatStr, new Date());
    return isValid(parsedDate) ? parsedDate : null;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

/**
 * Check if a date is valid
 */
export const isValidDate = (date: any): boolean => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    return isValid(dateObj);
  } catch {
    return false;
  }
};

/**
 * Format a datetime for display
 */
export const formatDateTime = (
  date: Date | string | number | null | undefined
): string => {
  return formatDate(date, "dd/MM/yyyy HH:mm");
};

/**
 * Format a date for API (ISO format)
 */
export const formatDateForApi = (
  date: Date | string | number | null | undefined
): string => {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    if (!isValid(dateObj)) return "";
    
    return dateObj.toISOString();
  } catch (error) {
    console.error("Error formatting date for API:", error);
    return "";
  }
};
