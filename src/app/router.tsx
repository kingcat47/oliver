import { createBrowserRouter } from "react-router-dom";

import {
  AuthCallback,
  Emergency,
  Login,
  Map,
  MapRegisterSection1,
  MapRegisterSection2,
  Register1,
  Register2,
  Settings,
} from "@/pages";

import { Robot, Camera } from "@/pages/index";

export const router = createBrowserRouter([
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
    path: "/",
    element: <Robot />,
  },
  {
    path: "/robot/register/section1",
    element: <Register1 />,
  },
  {
    path: "/robot/register/section2",
    element: <Register2 />,
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
    path: "/map/register/section1",
    element: <MapRegisterSection1 />,
  },
  {
    path: "/map/register/section2",
    element: <MapRegisterSection2 />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);
