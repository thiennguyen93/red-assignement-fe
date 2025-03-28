import type { AuthProvider } from "@refinedev/core";
import { api } from "./api";

export const TOKEN_KEY = "access_token";

export const authProvider: AuthProvider = {
  register: async ({ username, email, password, ...rest }) => {
    try {
      const data = await api.post<any>("/auth/register", {
        email,
        password,
        firstName: rest.firstName,
        lastName: rest.lastName,
        passwordConfirmation: password,
      });
      console.log("register data", data); // Intentionally left for demo purposes
      localStorage.setItem(TOKEN_KEY, data.data.accessToken);
      return {
        success: true,
        redirectTo: "/login",
        successNotification: {
          message: "Registration Successful",
          description: "You have successfully registered.",
        },
      };
    } catch (error) {
      console.log("register error", error); // Intentionally left for demo purposes
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: "Invalid email or password",
        },
      };
      
    }
  },
  login: async ({ email, password }) => {
    try {
      const data = await api.post("/auth/login", {
        email,
        password,
      });
      console.log("login data", data); // Intentionally left for demo & debug purposes
      localStorage.setItem(TOKEN_KEY, data.data.accessToken);
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.log("login error", error); // Intentionally left for demo purposes
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Invalid username or password",
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }
    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }
    try {
      const { data: user} = await api.get("/auth/me")
      return {
        ...user,
        avatar: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}+Doe&background=random`,
      };
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
