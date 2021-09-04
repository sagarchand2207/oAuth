import React, { useEffect, useState } from "react";

const Login = () => {
  const [state, setState] = useState({ email: "", password: "" });

  const { email, password } = state;

  const login = async () => {
    try {
      const url = "http://wallet.vaionex.com/v1/";
      const res = await fetch(`${url}auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          email: email,
          password: password,
        },
      });
      const jsonRes = await res.json();
      const {
        data: { token },
      } = jsonRes;

      const oAccessData = {
        clientKey: "098bfa82-0b6a-4124-8c60-e65be15c3d1d",
        userId: token,
        access: {
          access_scope: "read",
          acccess_type: "profile",
        },
      };

      const accessRes = await fetch(`${url}oauth/access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(oAccessData),
      });
      const jsonaccessRes = await accessRes.json();
      const {
        data: { msg },
      } = jsonaccessRes;

      const oAuthData = {
        clientKey: "098bfa82-0b6a-4124-8c60-e65be15c3d1d",
        code: msg,
        clientSecret:
          "bdIFNFbXDIYZFBHUQDAARHUOfMLBSLKJYAFFTLULcTcaOeUbQKKfVLaadSCUcB",
      };

      const oAuthRes = await fetch(`${url}oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(oAuthData),
      });
      const jsonoauthRes = await oAuthRes.json();
      const {
        data: { msg: oAuthCode },
      } = jsonoauthRes;
    } catch (e) {
      console.log(e.toString());
    }
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div className="container login_screen">
      <div class="login-block">
        <h1>Login</h1>
        <input
          type="email"
          required
          onChange={handleChange}
          placeholder="Email"
          name="email"
        />
        <input
          type="password"
          required
          onChange={handleChange}
          placeholder="Password"
          name="password"
        />
        <button onClick={login} disabled={!email && !password}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Login;
