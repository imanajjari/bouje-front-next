'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { requestPhoneCode } from '../../../../app/[locale]/api/auth/auth'; // تابع جدید که به /auto_register_or_login می‌زند
import FormInput from '../../../../components/ui/FormInput';
import { toast } from 'sonner';
import Spinner from '../../../../components/ui/Spinner';
import { Button } from '../../../../components/ui/Button';
import Header from '../../../../components/common/Header';
import Footer from '../../../../components/common/Footer';
import Logo from '../../../../components/common/Logo';
import MyGucciServices from '../../../../components/ui/MyGucciServices';
import { useTranslations } from 'next-intl';

export default function SignIn() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const t = useTranslations("navbar");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone.trim()) {
      toast.error("لطفاً شماره تلفن را وارد کنید.");
      return;
    }

    setLoading(true);
    try {
      const data = await requestPhoneCode(phone);
      if (data.message) {
        toast.success(data.message || "کد تأیید ارسال شد.");
        router.push(`/${locale}/auth/VerifyCode?phone=${encodeURIComponent(phone)}`);
      } else {
        const errorMessage = data.error || "خطایی رخ داده است.";
        toast.error(errorMessage);
      }
    } catch (err) {

      toast.error("خطا در برقراری ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />
  
      <main className="min-h-screen bg-white text-black px-4 py-12">
        <div className="mt-10 md:mt-20 flex justify-center">
          <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/2 xl:w-1/2 bg-white shadow-md rounded-2xl p-6 md:p-10 border border-gray-200 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Logo 
              className={`w-1/2`}
              />
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">ورود یا ثبت‌نام</h1>
              <p className="text-sm md:text-base text-center text-gray-600 leading-relaxed">
                برای ورود یا ایجاد حساب کاربری، شماره تلفن خود را وارد کنید. یک کد تأیید برای شما ارسال خواهد شد.
              </p>
            </div>
  
            <form onSubmit={handleSubmit} className="">
              <FormInput
                label="شماره تلفن"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
  
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span>در حال ارسال کد...</span>
                  </div>
                ) : (
                  "ورود یا ثبت‌نام"
                )}
              </Button>
            </form>
  
            <MyGucciServices />
          </div>
        </div>
      </main>
  
      <Footer />
    </>
  );
  
  

}
