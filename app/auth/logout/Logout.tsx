'use client';

// next
import { useRouter } from 'next/navigation';
// supabase
import { supabase } from '../../utils/supabase';

export function Logout() {
   /* 変数 ===========================================*/
  const router = useRouter();

  /* 関数 ===========================================*/
  const onLogout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) {
        throw logoutError;
      }
      router.push('/auth/login');
    } catch (error) {
      throw error;
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

// export default Logout
