import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

const Portfolio = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />
      <p> This is the portfolio page</p>
    </>
  );
};

export default Portfolio;
