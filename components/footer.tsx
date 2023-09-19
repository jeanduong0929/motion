import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="text-center py-10 border-t">
        &copy; {year} All rights reserved
      </footer>
    </>
  );
};

export default Footer;
