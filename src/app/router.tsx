import { createBrowserRouter } from "react-router-dom";

import { Camera, Emergency, Home, Login, Map, Settings, AuthCallback } from "@/pages";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    path: "/auth/success",
    element: <AuthCallback />,
  },
  {
    path: "/camera",
    element: <Camera />,
  },
  {
    path: "/emergency",
    element: <Emergency />,
  },
  {
    path: "/map",
    element: <Map />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);
