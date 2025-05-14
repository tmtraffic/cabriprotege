
import { Route } from "react-router-dom";
import Login from "@/pages/auth/Login";

export const authRoutes = [
  <Route key="login" path="/auth/login" element={<Login />} />
];
