'use client';

// next
import { useRouter } from 'next/navigation';
// supabase
import { supabase } from '../../utils/supabase';
// css
import '@/sass/auth/logout.scss';
import { useEffect } from 'react';
import { LogoutIcon } from '@/public/icons/HeroIcons';

export function Logout() {
  /* 変数 ===========================================*/
  const router = useRouter();

  /* hooks ===========================================*/

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
      <form onSubmit={onLogout}>
        <button className="logoutBtn" type="submit">
          <LogoutIcon />
        </button>
      </form>
    </div>
  );
}

// export default Logout
