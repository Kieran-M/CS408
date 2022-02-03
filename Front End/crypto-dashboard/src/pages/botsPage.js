import React, { useState } from "react";
import Navbar from "../components/navbar";

const Bots = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Navbar toggle={toggle} />
      <p> This is the bots page</p>
    </>
  );
};

export default Bots;
