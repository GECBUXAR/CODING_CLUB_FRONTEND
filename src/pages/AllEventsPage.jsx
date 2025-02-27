import React, { useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar.jsx";
import AllEventes from "../components/AllEventes.jsx";

const AllEventsPage = () => {
  return (
    <>
      <div>
        <Navbar />
        <AllEventes />
      </div>
    </>
  );
};

export default AllEventsPage;
