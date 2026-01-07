import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import t from "prop-types";
import {
  auth,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "@/services/firebase";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listener de autenticação (login e logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login com GitHub
  const loginWithGitHub = useCallback(async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erro no login:", error);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  }, []);

  // Nome formatado do usuário
  const firstName = useMemo(() => {
    return user?.displayName?.split(" ")[0] ?? "";
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        firstName,
        loginWithGitHub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: t.node.isRequired
}

export { AuthProvider, AuthContext }
