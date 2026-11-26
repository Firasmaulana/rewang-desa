'use client';

import { useState, useTransition, useRef } from 'react';
import { subscribeNewsletter } from '@/actions/subscribers';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isFieldInvalid, setIsFieldInvalid] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const syncFieldAria = () => {
    const el = inputRef.current;
    if (!el) return;
    const invalid = el.matches(':user-invalid');
    setIsFieldInvalid(invalid);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    const el = inputRef.current;
    if (el && !el.checkValidity()) {
      setIsFieldInvalid(true);
      el.focus();
      return;
    }

    startTransition(async () => {
      const res = await subscribeNewsletter(email);
      if (res.success) {
        setFeedback({
          type: res.alreadySubscribed ? 'info' : 'success',
          text: res.message,
        });
        if (!res.alreadySubscribed) {
          setEmail('');
          setIsFieldInvalid(false);
        }
      } else {
        setFeedback({ type: 'error', text: res.message });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5" noValidate>
      <div>
        <label htmlFor="newsletter-email" className="sr-only">
          Alamat Email Anda
        </label>
        <input
          ref={inputRef}
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (isFieldInvalid) syncFieldAria();
            if (feedback) setFeedback(null);
          }}
          onBlur={syncFieldAria}
          aria-invalid={isFieldInvalid ? 'true' : 'false'}
          aria-describedby={isFieldInvalid ? 'newsletter-email-error' : undefined}
          placeholder="Alamat Email Anda"
          className="newsletter-email-input w-full bg-[#241913] border border-[#8a5225]/40 px-3.5 py-2.5 rounded-lg text-white text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#ffdd7d] transition font-body"
        />
        {isFieldInvalid && (
          <p
            id="newsletter-email-error"
            className="mt-1.5 text-xs text-rose-300 flex items-center gap-1.5 font-body"
          >
            <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
            <span>Error: Masukkan email dengan format nama@email.com.</span>
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#8a5225] hover:bg-[#a6622b] disabled:opacity-60 text-[#fffaf5] font-semibold text-sm px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-95 shadow-md font-body cursor-pointer flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            <span>Mendaftarkan...</span>
          </>
        ) : (
          <span>Langganan Kabar Desa</span>
        )}
      </button>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`text-xs rounded-lg p-2.5 flex items-start gap-2 leading-relaxed font-body ${
            feedback.type === 'success'
              ? 'bg-[#5a8514]/25 border border-[#5a8514]/50 text-[#d8f3a8]'
              : feedback.type === 'info'
              ? 'bg-[#ffdd7d]/15 border border-[#ffdd7d]/40 text-[#ffdd7d]'
              : 'bg-rose-500/20 border border-rose-400/40 text-rose-200'
          }`}
        >
          {feedback.type === 'error' ? (
            <AlertCircle size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <CheckCircle2 size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}
    </form>
  );
}
