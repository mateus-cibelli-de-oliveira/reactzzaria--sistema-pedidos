import {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo
} from "react";
import t from "prop-types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut
} from "firebase/auth";
import { authPedidos, dbPedidos } from "@/services/firebase";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
          const fallbackProfile = {
            name: currentUser.displayName ?? "",
            email: currentUser.email,
            role: "user"
          }

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

  useEffect(() => {
    if (!user) return;

    const createUserIfNotExists = async () => {
      try {
        const userRef = doc(dbPedidos, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) return;

        const newProfile = {
          email: user.email,
          name: user.displayName ?? "",
          role: "user",
        };

        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      } catch (error) {
        console.error("ERRO AO CRIAR PERFIL DO USUÁRIO:", error);
      }
    };

    createUserIfNotExists();
  }, [user]);

  const loginWithGitHub = useCallback(async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(authPedidos, provider);
    } catch (error) {
      console.error("Erro no login com GitHub:", error);
      throw error;
    }
  }, []);

  const loginWithEmail = useCallback(async (email, password) => {
    try {
      await signInWithEmailAndPassword(authPedidos, email, password);
    } catch (error) {
      console.error("Erro no login com email:", error);
      throw error;
    }
  }, []);

  const registerWithEmail = useCallback(async (name, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(
        authPedidos,
        email,
        password
      );

      await updateProfile(result.user, {
        displayName: name,
      });

      const newProfile = {
        name,
        email,
        role: "user"
      };

      const userRef = doc(dbPedidos, "users", result.user.uid);
      await setDoc(userRef, newProfile);

      setUser(result.user);
      setProfile(newProfile);
    } catch (error) {
      console.error("Erro no cadastro com email:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(authPedidos);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  }, []);

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
}

AuthProvider.propTypes = {
  children: t.node.isRequired
}

export { AuthProvider, AuthContext }
