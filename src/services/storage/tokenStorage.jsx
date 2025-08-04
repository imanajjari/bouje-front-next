// tokenStorage.js

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const TokenStorage = {
  setTokens: (access, refresh) => {
    
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },

  getAccessToken: () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    return token;
  },

  getRefreshToken: () => {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    return token;
  },

  clearTokens: () => {
    
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};
