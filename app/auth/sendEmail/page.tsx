'use client';

// react
import { useState } from 'react';
// next
import { useRouter } from 'next/navigation';
// supabase
import { supabase } from '../../utils/supabase';
// css
import '@/sass/auth/sendEmail.scss';
import { Modal } from '@/app/components/UI/modal';

const Sendmail = () => {
  /* 変数 ===========================================*/
  const router = useRouter();

  // メール
  const [email, setEmail] = useState('');
  // メール確認
  const [checkEmail, setCheckEmail] = useState(false);

  /* 関数 ===========================================*/
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { error: sendMailError } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'http://localhost:3000/auth/passwordReset',
        });
      setCheckEmail(true);

      if (sendMailError) {
        throw sendMailError;
      }
    } catch (error) {}
  };

  // 確認メール送ったらログインページへ遷移
  const moveLoginPage = () => {
    if (checkEmail) {
      router.push('/auth/login');
    }
  };

  return (
    <div className="sendEmail">
      <form onSubmit={onSubmit}>
        <label>Just input your email address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>
          <button className="sendEmailBtn" type="submit">
            send Email
          </button>
        </div>
      </form>

      <div className="checkEmail">
        <Modal
          isOpen={checkEmail}
          onClose={() => {
            moveLoginPage();
            setCheckEmail(false);
          }}
          className="checkEmailModal"
        >
          <p>Check your password setting Email</p>
          <div />
          <button
            className="closeBtn"
            onClick={() => {
              moveLoginPage();
              setCheckEmail(false);
            }}
          >
            close
          </button>
        </Modal>

        {/* <div className={`checkEmailMask ${checkEmail ? 'isOpen' : ''}`}></div>
        <div className={`checkEmailModal ${checkEmail ? 'isOpen' : ''}`}>
          <div className="modalWrap">
            <p>Check your password setting Email</p>
            <div />
            <button
              className="closeBtn"
              onClick={() => {
                moveLoginPage();
                setCheckEmail(false);
              }}
            >
              close
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Sendmail;
