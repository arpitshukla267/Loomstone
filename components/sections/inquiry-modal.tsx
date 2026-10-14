'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';

export interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productDetails?: string;
}

export function InquiryModal({ isOpen, onClose, productName, productDetails }: InquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState(
    productName ? `Inquiring about ${productName}. Please share lead times, custom sizes, and swatches.` : ""
  );

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed z-[90] inset-0 grid place-items-center p-5 bg-navy/75 backdrop-blur-[8px]"
      role="presentation"
      onClick={handleClose}
    >
      <div
        className="relative w-[min(680px,100%)] max-h-[90vh] overflow-y-auto p-[29px_22px] md:p-[38px] bg-white border-t-4 border-gold shadow-2xl"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute top-5 right-5 grid place-items-center text-cool bg-transparent border-0 cursor-pointer hover:text-navy transition-colors"
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center py-[34px] px-3 text-center">
            <div className="grid place-items-center w-[54px] h-[54px] mb-5 text-gold border border-gold rounded-full">
              <Check size={25} />
            </div>
            <span className="inline-flex items-center gap-2 text-gold text-[10px] font-bold tracking-[.13em] uppercase">
              <i className="w-2 h-2 inline-block bg-gold not-italic" />
              COMMISSION BRIEF RECEIVED
            </span>
            <h2 className="my-3 text-navy font-manrope font-normal text-[28px] md:text-[32px]">
              Your consultation is on its way.
            </h2>
            <p className="max-w-[460px] mb-[22px] text-cool text-[13px] leading-[1.7]">
              Thank you. An Atelier Terroir textile curator will reach out within
              24 hours with yarn recommendations and technical parameters.
            </p>
            <button
              className="inline-flex items-center justify-center min-h-[50px] px-6 text-white bg-navy text-[10px] font-bold tracking-[.13em] uppercase border-0 cursor-pointer hover:bg-navy/90 transition-colors"
              onClick={handleClose}
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            <span className="inline-flex items-center gap-2 text-gold text-[10px] font-bold tracking-[.13em] uppercase">
              <i className="w-2 h-2 inline-block bg-gold not-italic" />
              DIRECT ARCHITECTURAL COMMISSION
            </span>
            <h2 className="mt-3 mb-2.5 text-navy font-manrope font-normal text-[26px] md:text-[32px] capitalize">
              {productName ? `Inquire: ${productName}` : "Initiate project consultation"}
            </h2>
            {productName && (
              <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-gold/15 px-3 py-1.5 text-xs font-semibold text-navy">
                Selected Piece: <span className="font-bold text-navy">{productName}</span>
                {productDetails && <span className="text-cool/80">({productDetails})</span>}
              </div>
            )}
            <p className="m-0 text-cool text-[13px] leading-[1.7]">
              Complete the spatial brief below. Our design directors will
              respond with yarn recommendations, custom scale renderings, and an
              estimated loom timeline.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-[17px] mt-[26px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-[7px] text-navy text-[10px] font-bold tracking-[.1em] uppercase">
                  Architect / Client Name
                  <input
                    required
                    placeholder="e.g. Elena Rostova"
                    className="w-full p-3 text-ink bg-ash border border-line outline-none text-[13px] normal-case tracking-normal focus:border-gold"
                  />
                </label>
                <label className="flex flex-col gap-[7px] text-navy text-[10px] font-bold tracking-[.1em] uppercase">
                  Design Practice / Private Client
                  <input
                    required
                    placeholder="e.g. Studio Rostova Architecture"
                    className="w-full p-3 text-ink bg-ash border border-line outline-none text-[13px] normal-case tracking-normal focus:border-gold"
                  />
                </label>
                <label className="flex flex-col gap-[7px] text-navy text-[10px] font-bold tracking-[.1em] uppercase">
                  Direct Email
                  <input
                    required
                    type="email"
                    placeholder="studio@rostova.com"
                    className="w-full p-3 text-ink bg-ash border border-line outline-none text-[13px] normal-case tracking-normal focus:border-gold"
                  />
                </label>
                <label className="flex flex-col gap-[7px] text-navy text-[10px] font-bold tracking-[.1em] uppercase">
                  Approximate Dimensions / Size
                  <input
                    placeholder="e.g. 8x10 ft or 5.5m × 4.0m"
                    className="w-full p-3 text-ink bg-ash border border-line outline-none text-[13px] normal-case tracking-normal focus:border-gold"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-[7px] text-navy text-[10px] font-bold tracking-[.1em] uppercase">
                Project Notes / Custom Requirements
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share room dimensions, lighting conditions, and chromatic constraints..."
                  className="w-full p-3 text-ink bg-ash border border-line outline-none text-[13px] normal-case tracking-normal focus:border-gold"
                />
              </label>
              <button
                className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 px-6 text-white bg-navy text-[10px] font-bold tracking-[.13em] uppercase border-0 cursor-pointer hover:bg-navy/90 transition-colors"
                type="submit"
              >
                Submit Commission Brief <ArrowRight size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default InquiryModal;
