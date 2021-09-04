import React, { useState } from "react";

const Landing = () => {
  const [state, setState] = useState({
    clientSecret: "",
    clientKey: "",
    name: "",
    url: "",
  });
  const copyToClip = (val) => {
    navigator.clipboard.writeText(val).then(
      function () {
        alert("copied successfully");
      },
      function (err) {
        alert("Could not copy text");
      }
    );
  };

  const generateUuid = async () => {
    const data = { name: name, redirectURL: url };
    try {
      const url = "http://wallet.vaionex.com/v1/oauth/register";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
      });
      const jsonRes = await res.json();
      const {
        data: {
          msg: { clientKey, clientSecret },
        },
      } = jsonRes;
      setState({ ...state, clientKey, clientSecret });
    } catch (e) {
      console.log(e.toString());
    }
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const { clientSecret, clientKey, name, url } = state;
  return (
    <div className="container landing_screen">
      <div className="landing-contents">
        <div className="details-container">
          <div className="u_details_container">
            <label>Name</label>
            <div className="u_details">
              <input
                name="name"
                value={name}
                className="text-input"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="u_details_container">
            <label>Url</label>
            <div className="u_details">
              <input
                name="url"
                value={url}
                onChange={handleChange}
                className="text-input"
              />
            </div>
          </div>
        </div>
        <div className="button-container row">
          <button disabled={!name && !url} onClick={generateUuid}>
            Generate
          </button>
        </div>
        <div className="details-container">
          <div className="u_details_container">
            <label>Secret Id</label>
            <div className="u_details">
              <input value={clientSecret} className="text-input" disabled />
              <button onClick={() => copyToClip(clientSecret)} className="btn">
                Copy
              </button>
            </div>
          </div>

          <div className="u_details_container">
            <label>Key</label>
            <div className="u_details">
              <input value={clientKey} className="text-input" disabled />
              <button onClick={() => copyToClip(clientKey)} className="btn">
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
