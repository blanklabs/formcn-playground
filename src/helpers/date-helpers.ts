/**
 * Date Helper Functions
 *
 * This module contains reusable date utility functions for formatting,
 * validation, and conversion between different date formats.
 * Used throughout the application for consistent date handling.
 */

/**
 * Get the number of days in a specific month and year
 * Handles leap years correctly
 */
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Validate if a date is valid (month 1-12, day within month limits, year >= 1000)
 */
export function isValidDate(month: number, day: number, year: number): boolean {
  if (month < 1 || month > 12 || day < 1 || year < 1000) return false;
  return day <= getDaysInMonth(month, year);
}

/**
 * Convert YYYY-MM-DD format to MM/DD/YYYY format
 * Avoids timezone issues by parsing string directly
 */
export function formatDateFromValue(dateString: string): string {
  if (!dateString) return "";

  // Parse the date string directly without creating Date object to avoid timezone issues
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    if (year.length === 4 && month.length === 2 && day.length === 2) {
      return `${month}/${day}/${year}`;
    }
  }
  return "";
}

/**
 * Convert MM/DD/YYYY format to YYYY-MM-DD format
 * Includes validation to ensure the date is valid
 */
export function formatDateForValue(dateString: string): string {
  if (!dateString) return "";

  const parts = dateString.split("/");
  if (parts.length === 3) {
    const [month, day, year] = parts;
    if (year.length === 4 && month.length === 2 && day.length === 2) {
      const monthNum = parseInt(month, 10);
      const dayNum = parseInt(day, 10);
      const yearNum = parseInt(year, 10);

      if (isValidDate(monthNum, dayNum, yearNum)) {
        return `${year}-${month}-${day}`;
      }
    }
  }
  return "";
}

/**
 * Format user input as MM/DD/YYYY with smart validation and auto-correction
 * - Automatically adds leading zeros
 * - Validates month (1-12) and corrects invalid values
 * - Validates day based on month/year and corrects invalid values
 * - Progressive formatting as user types
 */
export function formatDateInput(value: string): string {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length === 0) return "";

  let month = numbers.slice(0, 2);
  let day = numbers.slice(2, 4);
  const year = numbers.slice(4, 8);

  // Smart month formatting
  if (month.length === 1) {
    if (parseInt(month) > 1) {
      month = `0${month}`;
    }
  } else if (month.length === 2) {
    const monthNum = parseInt(month);
    if (monthNum > 12) {
      month = "12";
    } else if (monthNum === 0) {
      month = "01";
    }
  }

  // Smart day formatting
  if (day.length === 1) {
    if (parseInt(day) > 3) {
      day = `0${day}`;
    }
  } else if (day.length === 2 && month.length === 2) {
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = year.length === 4 ? parseInt(year) : new Date().getFullYear();

    if (dayNum === 0) {
      day = "01";
    } else if (dayNum > getDaysInMonth(monthNum, yearNum)) {
      day = getDaysInMonth(monthNum, yearNum).toString().padStart(2, "0");
    }
  }

  // Build result progressively
  let result = month;
  if (numbers.length > 2) result += `/${day}`;
  if (numbers.length > 4) result += `/${year}`;

  return result;
}

/**
 * Create a Date object from YYYY-MM-DD string avoiding timezone issues
 * Uses local timezone by constructing Date with separate parameters
 */
export function createDateFromValue(dateString: string): Date | undefined {
  if (!dateString) return undefined;
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts.map((p) => parseInt(p, 10));
    return new Date(year, month - 1, day); // month is 0-indexed in Date constructor
  }
  return undefined;
}

/**
 * Convert a Date object to YYYY-MM-DD string format
 * Uses local timezone to avoid timezone shifts
 */
export function formatDateToValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
