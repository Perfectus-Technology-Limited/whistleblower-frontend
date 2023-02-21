import React from "react";

export default function LoaderSvg({ isLoading }) {
  return (
    <>
      {isLoading && (
        <div className="loader-div">
          <img src="/loader.svg" className="loder-svg" />
        </div>
      )}
    </>
  );
}
