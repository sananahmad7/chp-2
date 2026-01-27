"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import BookConsultationModal from "@/components/BookConsultationModel";

type BookingModalContextValue = {
  open: (title?: string) => void;
  close: () => void;
};

const BookingModalContext = createContext<BookingModalContextValue | null>(
  null,
);

export function BookingModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("Book a consultation");

  const open = useCallback((nextTitle?: string) => {
    if (nextTitle) setTitle(nextTitle);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <BookingModalContext.Provider value={value}>
      {children}

      {/* Render once, globally */}
      <BookConsultationModal open={isOpen} onClose={close} title={title} />
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx)
    throw new Error("useBookingModal must be used within BookingModalProvider");
  return ctx;
}
