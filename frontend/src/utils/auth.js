const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

export const register = async ({ email, password }) => {
  return fetch(`${BASE_URL}/users/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
};

export const login = async ({ email, password }) => {
  return fetch(`${BASE_URL}/users/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
};

export const checkToken = async (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserData = () => {
  return {
    token: localStorage.getItem("jwt"),
    userId: localStorage.getItem("userId")
  };
};