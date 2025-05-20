import React from "react";
import Navbar from "./Navbar";
import Banner from "./Banner";
import ClickSparkWrapper from "../reactbit/ClickSparkWrapper/ClickSparkWrapper";

const Header = () => {
  return (
    <>
      <ClickSparkWrapper>
        <Navbar />
      </ClickSparkWrapper>
    </>
  );
};

export default Header;
