import { useEffect, useState } from 'react';

/**
 * Debounces a value by delaying updates until the specified delay has passed
 * without the value changing. Useful for preventing excessive API calls or 
 * expensive operations on rapidly changing inputs.
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
