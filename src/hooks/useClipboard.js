import { useState } from 'react';

/**
 * Hook for copying text to the clipboard with status feedback.
 */
export function useClipboard(timeout = 2500) {
  const [hasCopied, setHasCopied] = useState(false);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), timeout);
      return true;
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      setHasCopied(false);
      return false;
    }
  };

  return { hasCopied, copy };
}
