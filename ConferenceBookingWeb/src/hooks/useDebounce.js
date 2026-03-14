import { useState, useEffect } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms of
 * inactivity. Prevents expensive operations (e.g. API calls) from firing on
 * every single keystroke — instead they fire once the user pauses typing.
 *
 * @param {any}    value - The value to debounce (typically a search string)
 * @param {number} delay - Milliseconds to wait after last change (default: 400)
 * @returns {any} The debounced value
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 400);
 * useEffect(() => {
 *   if (debouncedSearch) fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export default function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Schedule the update after `delay` ms
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // If `value` changes before the timer fires, cancel the previous timer.
    // This is the core debounce mechanism — only the LAST change within the
    // window will trigger the update.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
