import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";

const Spinner = (props) => {
  const override = css`
    display: block;
    margin-top: 500;
    margin: 0 auto;
    margin-top: 200px;
  `;

  if (props.isLoading) {
    return (
      <>
        <ClipLoader color={"#4A90E2"} css={override} size={props.size}></ClipLoader>
      </>
    );
  }

  return (
    <p></p>);
};

export default Spinner;
