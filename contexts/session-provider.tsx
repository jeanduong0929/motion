"use client";
import Auth from "@/models/auth";
import { SessionProvider } from "next-auth/react";
import React, { useEffect } from "react";

type AuthContextType = {
  auth: Auth | null;
  setAuth: (auth: Auth | null) => void;
  loading: boolean;
};

interface SessionProps {
  children: React.ReactNode;
}

export const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType,
);

const Session = ({ children }: SessionProps) => {
  const [auth, setAuth] = React.useState<Auth | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    const auth = sessionStorage.getItem("auth");

    if (auth) {
      setAuth(JSON.parse(auth));
    }

    setLoading(false);
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ auth, setAuth, loading }}>
        <SessionProvider>{children}</SessionProvider>
      </AuthContext.Provider>
    </>
  );
};

export default Session;
