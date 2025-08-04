

import { useRouter } from 'next/router';
import { API_BASE_URL } from "../config";
import { TokenStorage } from "../../../../services/storage/tokenStorage";





// مرحله ۱: درخواست ارسال کد
export const requestPhoneCode = async (phone_number) => {
  const response = await fetch(`${API_BASE_URL}/api/auto_register_or_login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone_number }),
  });



  if (!response.ok) {
    const errText = await response.text();
    throw new Error("📛 ارسال شماره با خطا مواجه شد: " + errText);
  }

  return await response.json();
};



// مرحله ۲: ارسال کد تایید و دریافت توکن
export const verifyPhoneCode = async (phone_number, code) => {
  const response = await fetch(`${API_BASE_URL}/api/verify_login_or_register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone_number, code }),
  });

  const data = await response.json();



  // استخراج توکن‌ها
  const access = data?.data?.access;
  const refresh = data?.data?.refresh;

  if (response.ok && access && refresh) {
    TokenStorage.setTokens(access, refresh);
    return { success: true, message: data?.message, tokens: { access, refresh } };
  }

  // اگر بک‌اند message یا detail داده
  const errorMessage = data?.message || data?.detail || "خطای ناشناخته‌ای رخ داده است.";
  return { success: false, message: errorMessage };
};


export const loginUser = async (phone_number, password) => {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone_number,
      password,
    }),
  });



  const data = await response.json();

  if (data.access && data.refresh) {
    TokenStorage.setTokens(data.access, data.refresh);
  }

  return data;
};


export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// بدون استفاده از useRouter
export const refreshToken = async () => {
  const refreshToken = TokenStorage.getRefreshToken();

  if (!refreshToken) {
    TokenStorage.clearTokens();
    throw new Error("No refresh token");
  }

  const url = `${API_BASE_URL}/token/refresh/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    TokenStorage.clearTokens();
    throw new Error("Refresh token expired or invalid: " + errorText);
  }

  const data = await response.json();

  if (data.access && data.refresh) {
    TokenStorage.setTokens(data.access, data.refresh);
  } else if (data.access) {
    TokenStorage.setTokens(data.access, refreshToken);
  }

  return data.access;
};


export const getProfile = async () => {
  const url = `${API_BASE_URL}/api/profile/`;

  try {
    const response = await authFetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Failed to fetch profile: " + errorText);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("🚨 خطا هنگام درخواست پروفایل:", error);
    throw error;
  }
};

export const updateUserProfile = async (data) => {
  const response = await authFetch(`${API_BASE_URL}/api/profile/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error("خطا در بروزرسانی پروفایل: " + errText);
  }

  return await response.json();
};

// JWT 

export const authFetch = async (url, options = {}) => {
  let accessToken = TokenStorage.getAccessToken();

  const makeRequest = async (token) => {
    const mergedOptions = {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      mode: "cors",
    };
    return fetch(url, mergedOptions);
  };

  let response = await makeRequest(accessToken);
  if (response.status === 401) {
    try {
      accessToken = await refreshToken();
      response = await makeRequest(accessToken);
    } catch (err) {
      throw new Error("Unauthorized and refresh token failed");
    }
  }

  return response;
};


export const logoutUserWithBlacklist = async (router, locale = "") => {
  const refresh = TokenStorage.getRefreshToken();
  const redirectPath = `${locale ? `/${locale}` : ""}/auth/SignIn`;

  const cleanExit = () => {
    TokenStorage.clearTokens();
    router.replace(redirectPath);          // رفرش کامل مسیر بدون گشتن در history
  };

  // ✖️ هیچ رفرش‌توکنی نداریم
  if (!refresh) {
    cleanExit();
    throw new Error("No refresh token");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TokenStorage.getAccessToken()}`,
      },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to blacklist refresh token: ${errText}`);
    }

    // ✅ سرور موفق بود
    cleanExit();
    return { success: true };
  } catch (err) {
    // ✖️ خطای شبکه یا خطای سرور
    cleanExit();
    throw err;
  }
};
