'use client';

// react
import { useState } from 'react';
// next
import { useRouter } from 'next/navigation';
// supabase
import { supabase } from '../../utils/supabase';
// css
import '@/sass/auth/passwordReset.scss';

export function ResetPassword() {
  /* 変数 ===========================================*/
  const router = useRouter();

  /* hooks ===========================================*/
  // パスワード
  const [password, setPassword] = useState('');
  // 確認用パスワード
  const [passwordConf, setPasswordConf] = useState('');
  // メール確認
  const [changePassword, setChangePassword] = useState(false);

  /* 関数 ===========================================*/
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error: passwordResetError } = await supabase.auth.updateUser({
        password,
      });
      console.log(passwordResetError);
      if (passwordResetError) {
        throw passwordResetError;
      }
      setChangePassword(true);
      router.push('/auth/login');
    } catch (error) {
      alert('error occurred');
    }
  };

  // 確認メール送ったらログインページへ遷移
  const moveLoginPage = () => {
    if (changePassword) {
      router.push('/auth/login');
    }
  };

  return (
    <div className="passwordReset">
      <div className="formWrap">
        <div className="heading">Reset password</div>

        <form className="ResetPasswordForm" onSubmit={onSubmit}>
          <div className="inputForm">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
            <input
              type="password"
              required
              value={passwordConf}
              onChange={(e) => setPasswordConf(e.target.value)}
              placeholder="passwordConf"
            />
          </div>
          <button
            className="sendResetPasswordBtn"
            onClick={() => {
              moveLoginPage();
              setChangePassword(false);
            }}
            type="submit"
          >
            Change Password
          </button>
        </form>

        <div className="changePassword">
          <div
            className={`changePasswordMask ${changePassword ? 'isOpen' : ''}`}
          ></div>
          <div
            className={`changePasswordModal ${changePassword ? 'isOpen' : ''}`}
          >
            <div className="modalWrap">
              <p>Check your password setting Email</p>
              <div />
              <button
                className="closeBtn"
                onClick={() => {
                  moveLoginPage();
                  setChangePassword(false);
                }}
              >
                close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
