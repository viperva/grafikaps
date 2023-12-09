import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Credits from "./credits.tsx";
import PS1 from "./ps1/ps1.tsx";
import PS4 from "./ps4/Ps4.tsx";

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
        path: "/ps4",
        element: <PS4 />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
