import { createBrowserRouter } from "react-router-dom";

import { Camera, Home } from "@/pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/camera",
    element: <Camera />,
  },
]);
