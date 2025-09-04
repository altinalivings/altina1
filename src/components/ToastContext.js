'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext({ show: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, variant = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] space-y-2">
        {(toasts || []).map((t) => (
          <div key={t.id} className={`px-4 py-3 rounded-xl shadow-lg text-white ${t.variant==='error'?'bg-red-600':'bg-emerald-600'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
