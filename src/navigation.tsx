import { Drawer, Typography } from "@mui/material";
import React from "react";
import { LinkProps, Link as Link_ } from "react-router-dom";

const Link = (props: LinkProps) => {
  return (
    <Link_ {...props}>
      <Typography
        sx={{
          color: "white",
          padding: 2,
          fontSize: "1.5rem",
          "&:hover": {
            backgroundColor: "Highlight",
            color: "black",
          },
        }}
      >
        {props.children}
      </Typography>
    </Link_>
  );
};

const Navigation = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        sx: {
          width: "15vw",
          backgroundColor: "Background",
        },
      }}
    >
      <Link to="/">Autorzy</Link>
      <Link to="/ps1">PS1</Link>
      <Link to="/ps3">PS3</Link>
      <Link to="/ps5">PS5</Link>
      <Link to="/ps7">PS7</Link>
    </Drawer>
  );
};

export default Navigation;
