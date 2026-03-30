import { createContext, useEffect, useMemo, useState } from "react";
import { getProfile, login as loginRequest, register as registerRequest } from "../api/authApi";
import { clearSession, getStoredToken, getStoredUser, persistSession } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [bootstrapping, setBootstrapping] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setBootstrapping(false);
        return;
      }

      try {
        const profile = await getProfile();
        setUser(profile);
        persistSession(token, profile);
      } catch (error) {
        clearSession();
        setToken(null);
        setUser(null);
      } finally {
        setBootstrapping(false);
      }
    }

    bootstrap();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      bootstrapping,
      isAuthenticated: Boolean(token && user),
      async login(credentials) {
        const response = await loginRequest(credentials);
        persistSession(response.access_token, response.user);
        setToken(response.access_token);
        setUser(response.user);
        return response.user;
      },
      async register(payload) {
        return registerRequest(payload);
      },
      logout() {
        clearSession();
        setToken(null);
        setUser(null);
      },
      setUser,
    }),
    [bootstrapping, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
