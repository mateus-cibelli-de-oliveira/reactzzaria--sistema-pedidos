import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import t from "prop-types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { authPedidos, dbPedidos } from "@/services/firebase";

import { loginWithGitHub } from "./github-auth";
import { loginWithEmail, registerWithEmail } from "./email-auth";

/**
 * AuthContext
 *
 * Este é o contexto principal da autenticação.
 * Ele fornece informações sobre o usuário, perfil, estado de carregamento
 * e funções de login, registro e logout para toda a aplicação.
 */
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * useEffect principal de autenticação
   *
   * Observa mudanças na autenticação do Firebase (login/logout)
   * e carrega o perfil do usuário no Firestore. Se o usuário não existir,
   * cria um perfil padrão.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authPedidos, async (currentUser) => {
      try {
        setUser(currentUser);

        if (!currentUser) {
          setProfile(null);
          setLoading(false);
          return;
        }

        const userRef = doc(dbPedidos, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfile(userSnap.data());
        } else {
          // Perfil fallback caso não exista no Firestore.
          const fallbackProfile = {
            name: currentUser.displayName ?? "",
            email: currentUser.email,
            role: "user"
          };

          await setDoc(userRef, fallbackProfile);
          setProfile(fallbackProfile);
        }

        setLoading(false);
      } catch (error) {
        console.error("ERRO AO CARREGAR PERFIL DO USUÁRIO:", error);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * logout
   *
   * Função simples que desloga o usuário e limpa os estados
   * de usuário e perfil. Pensar como "fechar a sessão" do sistema.
   */
  const logout = useCallback(async () => {
    try {
      await signOut(authPedidos);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  }, []);

  /**
   * firstName
   *
   * Calcula o primeiro nome do usuário com base no perfil.
   * Útil para saudações ou exibição resumida do nome.
   */
  const firstName = useMemo(() => {
    if (!profile?.name) return "";
    return profile.name.split(" ")[0];
  }, [profile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        firstName,
        loginWithGitHub,
        loginWithEmail,
        registerWithEmail,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * PropTypes
 *
 * Garante que o AuthProvider receba um children válido.
 */
AuthProvider.propTypes = {
  children: t.node.isRequired
}

export { AuthProvider, AuthContext }
