'use client';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/ToastContext';
import StickyCTA from '@/components/StickyCTA';

export default function ClientRoot({ children }) {
  const pathname = usePathname();
  const hideCTA = pathname?.startsWith('/contact');

  return (
    <ToastProvider>
      {!hideCTA && <StickyCTA />}
      {children}
    </ToastProvider>
  );
}
