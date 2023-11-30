import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Credits from "./credits.tsx";
import PS1 from "./ps1/ps1.tsx";
import PS2 from "./ps2/ps2.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Credits />,
      },
      {
        path: "/ps1",
        element: <PS1 />,
      },
      {
        path: "/ps2",
        element: <PS2 />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
