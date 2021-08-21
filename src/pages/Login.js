import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import Fetch from "../util/Fetch";

const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    clientDetails: {},
    loggedIn: localStorage.getItem("login__token"),
    loading: false,
  });

  const clientRef = useRef({});

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const clientKey = query.get("clientKey");

  const { email, password, loading, error, loggedIn } = state;

  const getClientDetails = async () => {
    setState({ ...state, loading: true });
    try {
      const res = await Fetch.get(`oauth/client/${clientKey}`);
      const {
        data: { msg },
      } = res;
      setState({ ...state, loading: false });
      clientRef.current = msg;
    } catch (e) {
      console.log(e.toString());
      setState({ ...state, error: e.toString(), loading: false });
    }
  };

  const login = async () => {
    setState({ ...state, loading: true });
    try {
      const loginResp = await Fetch.get(`auth`, {
        email: email,
        password: password,
      });

      if (loginResp instanceof Error) {
        setState({ ...state, loggedIn: false, loading: false });
      } else {
        const {
          data: { token },
        } = loginResp;
        localStorage.setItem("login__token", token);
        setState({ ...state, loggedIn: true, loading: false, error: "" });
        if (clientKey && token) {
          await getAccessCode(clientKey, token);
        }
      }
    } catch (e) {
      console.log(e.toString());
      setState({
        ...state,
        loggedIn: false,
        error: e.toString(),
        loading: false,
      });
    }
  };

  const getAccessCode = async (token) => {
    setState({ ...setState.state, loading: true });
    const oAccessData = {
      clientKey,
      userId: localStorage.getItem("login__token")
        ? localStorage.getItem("login__token")
        : token,
      access: {
        access_scope: "read",
        acccess_type: "profile",
      },
    };

    const { redirectURL } = clientRef.current;
    try {
      const accessRes = await Fetch.post("oauth/access", {}, oAccessData);

      if (accessRes instanceof Error) {
        setState({ ...state, error: accessRes.info.data.msg, loading: false });
        window.opener.postMessage(
          { errorResponse: accessRes.info, error: true },
          redirectURL
        );
      } else {
        const {
          data: { msg },
        } = accessRes;
        setState({ ...state, loading: false });
        window.opener.postMessage(
          { accessCode: msg, error: false },
          redirectURL
        );
      }
    } catch (e) {
      console.log(e, "eee");
      window.opener.postMessage(
        { errorResponse: e, error: false },
        redirectURL
      );
    }
  };

  useEffect(async () => {
    if (clientKey) await getClientDetails();

    if (localStorage.getItem("login__token") && clientKey) {
      await getAccessCode(localStorage.getItem("login__token"));
    }
  }, []);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div className="container login_screen">
      {clientKey && (
        <h1>
          {loggedIn || localStorage.getItem("login__token")
            ? "Logged in Redirecting..."
            : " Signin using your credential"}
        </h1>
      )}
      {loading ? (
        <Loader />
      ) : (
        <div className="login-block">
          {loggedIn ? (
            <>
              <h4>You are logged in</h4>
              <button
                onClick={() => {
                  localStorage.removeItem("login__token");
                  setState({ ...state, loggedIn: false });
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <h1>Login</h1>
              <form onSubmit={login}>
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
                <button type="submit" disabled={!email || !password}>
                  Submit
                </button>
              </form>
            </>
          )}
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Login;
