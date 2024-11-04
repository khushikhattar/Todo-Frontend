import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer>
      <p>
        &copy; {new Date().getFullYear()} TODO Application. All rights reserved.
      </p>
    </footer>
  );
};
