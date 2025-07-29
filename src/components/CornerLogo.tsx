import React from "react";
import tlogo from "@/components/trans-logo.png";

const CornerLogo = () => {
  return (
    <div
      className="absolute inset-0 opacity-10 pointer-events-none select-none z-0"
      style={{
        backgroundImage: `url(${tlogo})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "8rem",
      }}
    />
  );
};

export default CornerLogo;
