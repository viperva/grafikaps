import "./App.css";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navigation from "./navigation";

function App() {
  return (
    <>
      <Navigation />
      <Box
        sx={{
          marginLeft: "15vw",
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}

export default App;
