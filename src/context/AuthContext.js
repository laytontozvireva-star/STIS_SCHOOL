import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getProfile } from "../services/profileService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ── Load session on mount & listen for auth changes ── */
  useEffect(() => {
    let mounted = true;

    // 1. Get existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        await loadUserProfile(session.user);
      }
      setIsLoading(false);
    });

    // 2. Subscribe to future auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* ── Helper: fetch profile and merge with auth user ── */
  const loadUserProfile = async (authUser) => {
    try {
      const profile = await getProfile(authUser.id);
      setUser({ ...authUser, ...profile });
    } catch {
      // Profile not found yet (e.g. just registered) — use auth meta
      setUser({
        ...authUser,
        name: authUser.user_metadata?.name || authUser.email,
        role: authUser.user_metadata?.role || "student",
      });
    }
  };

  /* ── Login ── */
  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  /* ── Register ── */
  const register = async ({ name, email, password, role }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });
    if (error) throw error;
    return data;
  };

  /* ── Logout ── */
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};