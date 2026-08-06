import { supabase } from "../lib/supabase";

/**
 * Register a new user with email, password, name and role.
 * Creates the Supabase auth user AND inserts a row into `profiles`.
 */
export const registerUser = async ({ name, email, password, role }) => {
  // 1. Create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role }, // stored in auth.users.raw_user_meta_data
    },
  });

  if (authError) throw authError;

  // 2. Insert profile row (triggered automatically by DB function, but
  //    we do it here as a fallback in case the trigger isn't set up yet)
  const userId = authData.user?.id;
  if (userId) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      name,
      role,
      email,
    });
    if (profileError) console.warn("Profile insert warning:", profileError.message);
  }

  return authData;
};

/**
 * Sign in with email and password.
 * Returns the session + user profile combined.
 */
export const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  // Fetch full profile to get role, name, etc.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) throw profileError;

  return { session: data.session, user: { ...data.user, ...profile } };
};

/**
 * Sign out the current user.
 */
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get the currently logged-in user (from Supabase session).
 */
export const getCurrentSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};
