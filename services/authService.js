import { supabase } from '../supabase';

// Sign up a new user
export const signUp = async (email, password, name) => {
  // Step 1: Sign up the user using Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    return { data: null, error };
  }

  // Step 2: Insert user data into the 'users' table
  const { error: insertError } = await supabase.from('users').insert([
    {
      id: data.user.id, // Use the user ID returned by Supabase Auth
      name: data.user.user_metadata.name, // Use the name from user metadata
      email: data.user.email, // Use the email
    },
  ]);

  if (insertError) {
    return { data: null, error: insertError };
  }

  // Return the user data after successful insert
  return { data, error: null };
};

// Log in user
export const logIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

// Log out user
export const logOut = async () => {
  await supabase.auth.signOut();
};

// Get current user
export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  console.log('Fetched user data:', data);
  return { data, error };
};

