import React from "react";
import { SupabaseListener } from "../components/SupabaseListener";

// css
import "@/sass/auth/auth.scss";
import ModalCore from "../components/modalCore";
import SignUpForm from "../components/modal/signUpForm";

const Auth = () => {
  return (
    <>
      {/* <SignUpForm /> */}
      <div className="auth">
        <div className="wrap">
          <div className="login">
            <button className="loginBtn">login</button>
          </div>

          <div className="signUp">
            <button className="signUpBtn">signUp</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
