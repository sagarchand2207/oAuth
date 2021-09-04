import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import Fetch from "../util/Fetch";

const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    clientDetails: {},
    loading: true,
  });

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const clientKey = query.get("clientKey");

  const { email, password, loading, clientDetails } = state;

  const getClientDetails = async () => {
    try {
      const res = await Fetch.get(`oauth/client/${clientKey}`);
      const {
        data: { msg },
      } = res;
      setState({ ...state, clientDetails: msg, loading: false });
    } catch (e) {
      console.log(e.toString());
      setState({ ...state, error: e.toString(), loading: false });
    }
  };

  const login = async () => {
    setState({ ...state, loading: true });

    const { clientKey, clientSecret, redirectURL } = clientDetails;
    try {
      const loginResp = await Fetch.get(`auth`, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        email: email,
        password: password,
      });
      const {
        data: { token },
      } = loginResp;
      if (clientKey && token) {
        const oAccessData = {
          clientKey,
          userId: token,
          access: {
            access_scope: "read",
            acccess_type: "profile",
          },
        };

        const accessRes = await Fetch.post(
          "oauth/access",
          {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          oAccessData
        );

        const {
          data: { msg },
        } = accessRes;
        window.location.href = `${redirectURL}?accessCode=${msg}`;
      }

      setState({ ...state, loading: false });
    } catch (e) {
      console.log(e.toString());
      setState({ ...state, error: e.toString(), loading: false });
    }
  };

  useEffect(() => {
    getClientDetails();
  }, []);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div className="container login_screen">
      {loading ? (
        <Loader />
      ) : (
        <div className="login-block">
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
      )}
    </div>
  );
};

export default Login;
