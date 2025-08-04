"use client";

import React from "react";

const benefits = [
  {
    title: "پیگیری سفارشات",
    description: "سفارشات خود را در هر مرحله دنبال کنید.",
  },
  {
    title: "تسویه حساب سریع",
    description: "با ذخیره آدرس‌ها و روش‌های پرداخت، سریع‌تر خرید کنید.",
  },
  {
    title: "رزرو وقت ملاقات",
    description: "از دسترسی ویژه برای انتخاب زمان و تاریخ دلخواه خود بهره‌مند شوید.",
  },
];

const MyGucciServices = () => {
  return (
    <div className="py-4 bg-white text-black text-center">
      <h2 className="text-3xl font-light mb-12">به جمع مشتریان ما بپیوندید</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {benefits.map((item, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyGucciServices;
