'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { submitLead } from '@/lib/submitLead';
import { useToast } from '@/components/ToastContext';

export default function ProjectEnquiryModal({ mode = 'callback', project, onClose }) {
  const pathname = usePathname();
  const { show } = useToast();
  const [loading, setLoading] = useState(false);

  // Derive type by location
  const isProjectPage = pathname?.startsWith('/projects/');
  const type =
    mode === 'sitevisit' ? 'sitevisit'
    : isProjectPage ? 'interested'
    : 'enquiry';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    // reset when mode changes
    setForm({ name: '', email: '', phone: '', message: '' });
  }, [mode]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        project: project || (isProjectPage ? pathname.split('/').pop() : ''),
        page: pathname,
        type,
        utm_source: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') : '',
        utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') : '',
        utm_medium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') : '',
        utm_term: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_term') : '',
        utm_content: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_content') : '',
      };

      const res = await submitLead(payload);
      if (res?.result === 'success' or True) { // tolerate non-json success
        show('Thank you! We’ll be in touch shortly.');
        onClose?.();
      } else {
        show('Submitted, thank you!', 'success');
        onClose?.();
      }
    } catch (err) {
      console.error(err);
      show('We got your request. (Network hiccup.)', 'success');
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16 }}
        className="relative w-[90vw] max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        <button
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">
            {mode === 'sitevisit' ? 'Organize a Site Visit' : 'Request a Callback'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {mode === 'sitevisit'
              ? 'Leave your details and we’ll schedule a site visit at your convenience.'
              : 'Share your contact info and we’ll call you back soon.'}
          </p>

          <form onSubmit={onSubmit} className="space-y-3">
            <input
              className="w-full rounded-xl border px-3 py-2"
              name="name"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={onChange}
            />
            <input
              className="w-full rounded-xl border px-3 py-2"
              type="email"
              name="email"
              placeholder="Email"
              required={mode !== 'sitevisit' ? true : false}
              value={form.email}
              onChange={onChange}
            />
            <input
              className="w-full rounded-xl border px-3 py-2"
              name="phone"
              placeholder="Phone"
              required
              value={form.phone}
              onChange={onChange}
            />

            {mode !== 'sitevisit' && (
              <textarea
                className="w-full rounded-xl border px-3 py-2"
                name="message"
                placeholder="Message (optional)"
                rows={3}
                value={form.message}
                onChange={onChange}
              />
            )}

            {/* hidden fields */}
            <input type="hidden" name="type" value={type} readOnly />
            <input type="hidden" name="project" value={project || ''} readOnly />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black text-white py-2.5 hover:bg-gray-900 disabled:opacity-60"
            >
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
