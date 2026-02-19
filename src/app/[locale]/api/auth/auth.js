

import { useRouter } from 'next/router';
import { API_BASE_URL } from "../config";
import { TokenStorage } from "../../../../services/storage/tokenStorage";





// مرحله ۱: درخواست ارسال کد
export const requestPhoneCode = async (phone_number) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/request-otp/`, {
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
  const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp/`, {
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

  // ✅ اصلاح endpoint
  const url = `${API_BASE_URL}/api/token/refresh/`;

  try {
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
      console.error("🔄 Refresh token failed:", errorText);
      TokenStorage.clearTokens(); // پاک کردن توکن‌های نامعتبر
      throw new Error("Refresh token expired");
    }

    const data = await response.json();
    
    if (data.access) {
      TokenStorage.setTokens(data.access, refreshToken);
      return data.access;
    }

    throw new Error("No access token in refresh response");

  } catch (error) {
    console.error("🔄 Refresh error:", error);
    TokenStorage.clearTokens();
    throw error;
  }
};



export const getProfile = async () => {
  const url = `${API_BASE_URL}/api/auth/me/`;

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
  const response = await authFetch(`${API_BASE_URL}/api/auth/me/`, {
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

  if (!accessToken) {
    throw new Error("No access token");
  }

  const makeRequest = async (token) => {
    const headers = {
      ...(options.headers || {}),
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    };

    // فقط اگر body داریم Content-Type اضافه کن
    if (options.body) {
      headers["Content-Type"] = "application/json";
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: "same-origin",
      mode: "cors",
    });
  };

  let response = await makeRequest(accessToken);
  
  // 401 → تلاش برای refresh
  if (response.status === 401) {
    try {
      console.log("🔄 Refreshing token...");
      accessToken = await refreshToken();
      response = await makeRequest(accessToken);
    } catch (refreshError) {
      console.error("🔄 Refresh failed:", refreshError);
      TokenStorage.clearTokens();
      throw new Error("Session expired. Please login again.");
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
