"use client";

import { useBookingModal } from "@/components/shared/booking-modal-provider";

type Props = {
  label: string;
  title?: string;
  className?: string;
};

export default function BookConsultationModalTrigger({
  label,
  title = "Request a walkthrough",
  className,
}: Props) {
  const { open } = useBookingModal();

  return (
    <button type="button" className={className} onClick={() => open(title)}>
      {label}
    </button>
  );
}
