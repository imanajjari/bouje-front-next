'use client';

import { useEffect, useState } from 'react';
import { X, Phone, MapPin, Loader2 } from 'lucide-react';
import { Button } from "../../components/ui/Button";
import {
  getContactPageData,
  sendContactMessage
} from "../../services/contact/contactService";

const SupportModal = ({ show, onClose }) => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState({ success: null, message: '' });

  useEffect(() => {
    if (show) {
      setLoading(true);
      getContactPageData("fa").then((data) => {
        setContactData(data);
        setLoading(false);
      });
    }
  }, [show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return; // جلوگیری از کلیک‌های مکرر

    setSubmitting(true);
    setStatus({ success: null, message: '' });

    const result = await sendContactMessage(formData);

    if (result.error) {
      setStatus({ success: false, message: result.error });
      setSubmitting(false);
    } else {
      setStatus({ success: true, message: '✅ پیام شما با موفقیت ارسال شد. با شما تماس خواهیم گرفت.' });
      setTimeout(() => {
        setSubmitting(false);
        setFormData({ full_name: '', email: '', message: '' });
        onClose(); // بستن مدال بعد از موفقیت
      }, 1500);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">پشتیبانی و ارتباط با ما</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Contact Info */}
        {loading ? (
          <p className="text-center text-gray-500">در حال بارگذاری اطلاعات تماس...</p>
        ) : contactData ? (
          <div className="space-y-4 text-sm text-gray-700">
            <p className="text-sm text-gray-600">
              در صورت داشتن سؤال، مشکل یا نیاز به تغییر اطلاعات تماس، از طریق فرم زیر با ما در ارتباط باشید یا با شماره زیر تماس بگیرید.
            </p>

            {contactData.info_items?.map((item, idx) =>
              item.item_type === 'address' ? (
                <div key={idx} className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{item.value}</span>
                </div>
              ) : item.item_type === 'phone' ? (
                <div key={idx} className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{item.value}</span>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p className="text-red-500 text-sm text-center">خطا در دریافت اطلاعات تماس</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="نام کامل شما"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ایمیل"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="پیام یا درخواست شما"
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          {status.message && (
            <p className={`text-sm ${status.success ? 'text-green-600' : 'text-red-600'}`}>
              {status.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className={`w-full bg-black text-white hover:bg-gray-900 transition flex items-center justify-center gap-2 ${
              submitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            ارسال پیام
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SupportModal;
