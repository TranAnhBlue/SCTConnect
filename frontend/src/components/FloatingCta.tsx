import React from 'react';

interface FloatingCtaProps {
  onOpenContact: () => void;
}

export const FloatingCta: React.FC<FloatingCtaProps> = ({ onOpenContact }) => {
  return (
    <button
      type="button"
      className="float-cta"
      onClick={onOpenContact}
      aria-label="Mở form liên hệ tư vấn"
    >
      <span>💬</span>
      <span>Tư vấn miễn phí</span>
    </button>
  );
};
