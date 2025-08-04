// components/magazine/NewsletterSubscription.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { subscribeToNewsletter } from '../../services/magazine/magazineService';

export default function NewsletterSubscription() {
  const t = useTranslations('Newsletter');

  const [email, setEmail] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  /* ------------------------------------------------------------ */
  /* event handlers                                               */
  /* ------------------------------------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubmitting(true);
      await subscribeToNewsletter(email);          // ← فراخوانی API واقعی
      toast.success(t('successTitle'), {
        description: t('successMessage'),
      });
      setEmail('');
    } catch (err) {
      toast.error(t('errorTitle'), {
        description: t('errorMessage'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------------------------------------ */
  /* UI                                                           */
  /* ------------------------------------------------------------ */
  return (
    <div className="bg-black text-white p-6 rounded-lg">
      <h3 className="text-lg font-bold mb-3">{t('title')}</h3>

      <p className="text-sm text-gray-300 mb-4">{t('description')}</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            className="w-full px-3 py-2 bg-gray-800 text-white placeholder-gray-400 rounded border border-gray-700 focus:ring-2 focus:ring-white focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-white text-black rounded font-medium hover:bg-gray-100 disabled:bg-gray-400 transition-colors"
        >
          {isSubmitting ? t('submitting') : t('button')}
        </button>
      </form>
    </div>
  );
}
