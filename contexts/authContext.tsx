import { auth, firestore } from "@/config/firebase";
import { AuthContextType, userType } from "@/types";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<userType>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser?.displayName,
          email: firebaseUser?.email,
          uid: firebaseUser?.uid,
        });
        updateUserData(firebaseUser?.uid)
        router.replace("/(tabs)/home");
      } else {
        setUser(null);
        router.replace("/(auth)/welcome");
      }
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      const msg = error.message;
      if (msg.includes("(auth/invalid-credential)")) msg("wrong credentials");
      if (msg.includes("(auth/invalid-email)")) msg("wrong email");
      return { success: false, msg };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      let response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(firestore, "users", response?.user?.uid), {
        name,
        email,
        uid: response?.user?.uid,
      });
      return { success: true };
    } catch (error: any) {
      const msg = error.message;
      if (msg.includes("(auth/email-already-in-use)"))
        msg("This email already in use!");
      if (msg.includes("(auth/invalid-email)")) msg("wrong email");
      return { success: false, msg };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      let docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: userType = {
          uid: data?.uid,
          name: data?.name || null,
          email: data?.email || null,
          image: data?.image || null,
        };
        setUser({ ...userData });
      }
    } catch (error: any) {
      const msg = error.message;
      console.log("Error updating user data:", msg);
    }
  };

  const contextValue: AuthContextType = {
    login,
    register,
    setUser,
    updateUserData,
    user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Useauth must be wrapped with auth provider");
  }
  return context;
};
