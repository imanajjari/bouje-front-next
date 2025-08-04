'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";
import Footer from "../../../../components/common/Footer";
import HeroBanner from "../../../../components/common/HeroBanner";
import Header from "../../../../components/common/Header";
import { Checkbox } from "../../../../components/ui/Checkbox";
import BirthDatePicker from "../../../../components/DatePicker/BirthDatePicker";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import { getProfile, authFetch, updateUserProfile } from "../../api/auth/auth";
import { toast } from 'sonner';
import SupportModal from "../../../../components/common/SupportModal";
import SupportTriggerButton from "../../../../components/common/SupportTriggerButton";


// توابع تبدیل تاریخ میلادی به شمسی و برعکس
const gregorianToJalali = (date) => {
  if (!date) return "";
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "";
    
    // فرمت تاریخ شمسی به صورت "YYYY/MM/DD"
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    
    return formatter.format(dateObj).replace(/‏/g, ''); // حذف کاراکترهای اضافی
  } catch (e) {
    console.error("خطا در تبدیل تاریخ میلادی به شمسی:", e);
    return "";
  }
};

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [form, setForm] = useState({
    gender: "",
    firstName: "",
    lastName: "",
    country: "ایالات متحده",
    dob: "", // تاریخ میلادی برای ارسال به سرور
    dobJalali: "", // تاریخ شمسی برای نمایش به کاربر
    email: "",
    phone: "",
    privacyAccepted: true,
  });

  const [errors, setErrors] = useState({});

  // دریافت اطلاعات کاربر هنگام بارگیری صفحه
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        const response = await getProfile();
        const profileData = response.data; // استفاده از ساختار داده‌های واقعی API
        
        // تبدیل تاریخ تولد میلادی به شمسی
        const jalaliDate = gregorianToJalali(profileData.birth_date);
        
        // تنظیم داده‌های فرم با اطلاعات دریافتی از API
        setForm({
          gender: profileData.gender === "male" ? "مرد" : 
                  profileData.gender === "female" ? "زن" : 
                  profileData.gender === "other" ? "جنسیت دیگر" : "",
          firstName: profileData.first_name || "",
          lastName: profileData.last_name || "",
          country: "ایالات متحده", // مقدار پیش‌فرض یا از API
          dob: profileData.birth_date || "", // ذخیره تاریخ میلادی برای ارسال به سرور
          dobJalali: jalaliDate, // تاریخ شمسی برای نمایش به کاربر
          email: profileData.email || "",
          phone: profileData.phone_number || "",
          privacyAccepted: true,
        });
      } catch (error) {
        console.error("خطا در دریافت اطلاعات پروفایل:", error);
        toast.error("دریافت اطلاعات با خطا مواجه شد");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "نام الزامی است";
    if (!form.lastName.trim()) newErrors.lastName = "نام خانوادگی الزامی است";
    
    // اگر ایمیل وارد شده باشد، اما فرمت آن صحیح نباشد
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "فرمت ایمیل صحیح نیست";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
  
    try {
      setSaving(true);
  
      const genderMapping= {
        "مرد": "male",
        "زن": "female",
        "جنسیت دیگر": "other"
      };
  
      await updateUserProfile({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        gender: genderMapping[form.gender] || undefined,
        birth_date: form.dob || undefined,
      });
  
      toast.success("تغییرات با موفقیت ذخیره شد");
      setTimeout(() => router.back(), 1500);
  
    } catch (error) {
      console.error("خطا در به‌روزرسانی پروفایل:", error);
      toast.error("خطا در ذخیره تغییرات. لطفاً دوباره تلاش کنید.");
    } finally {
      setSaving(false);
    }
  };


  // نمایش وضعیت بارگیری
  if (loading) {
    return (
      <div dir="rtl" className="bg-white">
        <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
          <p className="mr-4">در حال بارگیری اطلاعات...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div dir="rtl" className="bg-white">
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />
      <SupportModal show={showSupportModal} onClose={() => setShowSupportModal(false)} />
      
      <HeroBanner
        imageSrc="/images/HeroShortStandard_Gucci-LIDO-TIERI-APR25-07A-01v2-8bit-JIM3-ME-EXT_001_Default.avif"
        fallbackColor="#FF0000FF"
        title={`خوش آمدید، ${form.firstName}`}
        description="مجموعه‌ای از کیف‌های مردانه شامل کیف‌های مسافرتی، اداری، دستی، کمری و کوله‌پشتی در رنگ‌ها و متریال‌های مختلف."
      />

      <div className="p-10 space-y-16 max-w-4xl mx-auto animate-fade-in">
        {/* دکمه برگشت */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-sm hover:underline"
        >
          &larr; بازگشت
        </button>

        {/* اطلاعات شخصی */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold tracking-wide">اطلاعات شخصی من</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CustomDropdown
              label="جنسیت"
              options={["مرد", "زن", "جنسیت دیگر"]}
              value={form.gender}
              onChange={(value) => setForm({ ...form, gender: value })}
              inputClass="w-full border text-right border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-black transition mb-2 md:mb-0"
              containerClass="w-full mx-auto space-y-4"
            />
            
            <div className="md:flex justify-between gap-2 flex-col md:flex-row">
              <div>
                <Input
                  placeholder="نام*"
                  value={form.firstName}
                  className="w-full mb-5 md:mb-0"
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <Input
                  placeholder="نام خانوادگی*"
                  value={form.lastName}
                  className="w-full mb-5 md:mb-0"
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BirthDatePicker 
  value={form.dobJalali}
  onChangeJalaliGregorian={({ jalali, gregorian }) =>
    setForm((prevForm) => ({
      ...prevForm,
      dobJalali: jalali,
      dob: gregorian,
    }))
  }
/>
            {/* <Input disabled className="bg-gray-100" value={form.country} placeholder="کشور/منطقه*" /> */}
          </div>
        </div>

        {/* اطلاعات ورود */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold tracking-wide">اطلاعات ورود من</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Input 
                value={form.email} 
                placeholder="ایمیل" 
                disabled={!!form.email} 
                className={!!form.email ? "bg-gray-100 w-full" : "w-full"}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              {!!form.email && (
<SupportTriggerButton 
  onClick={() => setShowSupportModal(true)} 
  title="راهنمایی برای تغییر ایمیل"
/>

              )}
            </div>
            <div className="relative">
              <Input 
                value={form.phone} 
                placeholder="شماره همراه*" 
                disabled={true} 
                className="bg-gray-100 w-full"
              />
<SupportTriggerButton 
  onClick={() => setShowSupportModal(true)} 
  title="راهنمایی برای تغییر ایمیل"
/>

            </div>
          </div>
        </div>

        {/* تنظیمات حریم خصوصی */}
        {/* <div className="space-y-4">
          <h2 className="text-lg font-semibold">تنظیمات حریم خصوصی</h2>

          <div className="flex items-start gap-3">
          <Checkbox
  id="privacy-checkbox"
  checked={form.privacyAccepted}
  onCheckedChange={(checked) => setForm({ ...form, privacyAccepted: checked })}
/>

            <p className="text-sm">
              مایلم به‌روزرسانی‌های جدید درباره محصولات، خدمات ویژه و شخصی‌سازی تجربه دریافت کنم.
            </p>
          </div>

          <p className="text-xs text-gray-500">
            شما می‌توانید هر زمان مایل باشید اطلاعات خود را حذف یا اصلاح کنید. جهت اطلاعات بیشتر با ما تماس بگیرید:
            <span className="underline"> privacy@gucci.com</span>
          </p>
        </div> */}

        {/* دکمه‌ها */}
        <div className="space-y-6">
          {/* <button className="text-sm underline">غیرفعال کردن حساب کاربری</button> */}
          <Button 
            onClick={handleSubmit} 
            disabled={saving}
            className="w-full bg-black text-white hover:bg-gray-900 transition"
          >
            {saving ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white ml-2"></div>
                در حال ذخیره...
              </div>
            ) : "ذخیره تغییرات"}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}