'use client'

import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";

export function Logout() {
  const router = useRouter();

  const onLogout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) {
        throw logoutError;
      }
      router.push('/')
    } catch (error) {
      throw error
    }
  };

  return (
    <div className="logout">
      <div className="title"></div>
      <form onSubmit={onLogout}>
        <button type="submit">logout</button>
      </form>
    </div>
  );
}
