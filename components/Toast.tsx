import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export type ToastVariant = 'delete' | 'hired' | 'rejected' | 'ai-screening';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const VARIANT_STYLES: Record<ToastVariant, { bg: string; text: string; border: string; icon: string }> = {
  delete: {
    bg: 'bg-red-500',
    text: 'text-white',
    border: 'border-red-400',
    icon: '🗑️',
  },
  rejected: {
    bg: 'bg-red-500',
    text: 'text-white',
    border: 'border-red-400',
    icon: '✕',
  },
  hired: {
    bg: 'bg-[#046241]',
    text: 'text-white',
    border: 'border-[#035234]',
    icon: '✓',
  },
  'ai-screening': {
    bg: 'bg-[#FFC370]',
    text: 'text-lifewood-serpent',
    border: 'border-[#f0b05a]',
    icon: '✉',
  },
};

const TOAST_DURATION = 4000;

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const styles = VARIANT_STYLES[toast.variant];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onDismiss(toast.id);
    }, TOAST_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.93 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.18)] min-w-[260px] max-w-[360px] ${styles.bg} ${styles.border} ${styles.text}`}
    >
      <span className="text-base leading-none select-none">{styles.icon}</span>
      <p className="flex-1 text-sm font-semibold leading-snug">{toast.message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className={`ml-1 rounded-lg p-0.5 opacity-70 transition hover:opacity-100 ${
          toast.variant === 'ai-screening' ? 'hover:bg-black/10' : 'hover:bg-white/20'
        }`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
};

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────

let _counter = 0;
const uid = () => `toast-${++_counter}-${Date.now()}`;

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = React.useCallback((message: string, variant: ToastVariant) => {
    const id = uid();
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  return { toasts, show, dismiss };
};

export default Toast;