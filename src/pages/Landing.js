import React, { useState } from "react";

const Landing = () => {
  const [state, setState] = useState({ id: "", key: "" });
  const copyToClip = (val) => {
    navigator.clipboard.writeText(val).then(
      function () {
        alert("copied successfully");
      },
      function (err) {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const generateUuid = async () => {
    setState({ id: "56z7sd755sdgau57", key: "ajgsuag77yibgbjk87" });
  };
  const { id, key } = state;
  return (
    <div className="container landing_screen">
      <div className="landing-contents">
        <div className="button-container row">
          <button onClick={generateUuid}>Generate</button>
        </div>
        <div className="details-container">
          <div className="u_details_container">
            <label>Id</label>
            <div className="u_details">
              <input value={id} className="text-input" disabled />
              <button onClick={() => copyToClip(id)} className="btn">
                Copy
              </button>
            </div>
          </div>

          <div className="u_details_container">
            <label>Key</label>
            <div className="u_details">
              <input value={key} className="text-input" disabled />
              <button onClick={() => copyToClip(key)} className="btn">
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
