import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";

type SizeGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const sizeChartData = [
  { size: "S", chest: '38 - 40"', shoulder: '17.5"', length: '28"' },
  { size: "M", chest: '40 - 42"', shoulder: '18.5"', length: '29"' },
  { size: "L", chest: '42 - 44"', shoulder: '19.5"', length: '30"' },
  { size: "XL", chest: '44 - 46"', shoulder: '20.5"', length: '31"' },
  { size: "XXL", chest: '46 - 48"', shoulder: '21.5"', length: '32"' },
];

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Size Guide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[var(--line)] bg-white p-6 shadow-2xl sm:p-8"
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-[var(--ink)]" />
              <h3 className="text-xl font-bold tracking-wider text-[var(--ink)] uppercase">
                Aylee Size Guide
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)] transition hover:bg-[var(--panel)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Size Chart Table */}
          <div className="mt-6">
            <p className="mb-4 text-xs text-[var(--muted)]">
              All measurements are in inches. Standard Pakistani & European
              sizing fit.
            </p>
            <div className="overflow-x-auto rounded-lg border border-[var(--line)]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[var(--panel)] font-semibold tracking-wider text-[var(--ink)] uppercase">
                  <tr>
                    <th className="border-b border-[var(--line)] p-3">Size</th>
                    <th className="border-b border-[var(--line)] p-3">Chest</th>
                    <th className="border-b border-[var(--line)] p-3">
                      Shoulder
                    </th>
                    <th className="border-b border-[var(--line)] p-3">
                      Length
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] text-[var(--ink)]">
                  {sizeChartData.map((row) => (
                    <tr
                      key={row.size}
                      className="transition hover:bg-[var(--panel)]"
                    >
                      <td className="p-3 font-bold">{row.size}</td>
                      <td className="p-3">{row.chest}</td>
                      <td className="p-3">{row.shoulder}</td>
                      <td className="p-3">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Measurement Advice */}
          <div className="mt-6 space-y-2 rounded-xl bg-[var(--panel)] p-4 text-xs text-[var(--muted)]">
            <p className="font-semibold tracking-wider text-[var(--ink)] uppercase">
              How to Measure:
            </p>
            <p>
              • <strong>Chest:</strong> Measure around the fullest part of your
              chest, keeping tape horizontal.
            </p>
            <p>
              • <strong>Shoulder:</strong> Measure from edge of shoulder socket
              to shoulder socket across the back.
            </p>
            <p>
              • <strong>Length:</strong> Measure from highest point of shoulder
              down to bottom hem.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
