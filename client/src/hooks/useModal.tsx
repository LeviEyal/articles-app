import { useState } from "react";

/**
 * Custom hook for managing a modal state.
 *
 * @returns An object containing the `isOpen`, `open`, and `close` functions.
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close };
};
