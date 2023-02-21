import React from "react";

function Loader() {
  return (
    <>
      <div className="center">
        <div className="ring"></div>
        <span className="loading-text">loading...</span>
      </div>
    </>
  );
}

export default Loader;
