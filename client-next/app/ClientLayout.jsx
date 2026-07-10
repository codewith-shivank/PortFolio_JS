"use client";

import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import SmoothScroll from "./components/layout/SmoothScroll.jsx";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SmoothScroll>
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
      </AuthProvider>
    </ThemeProvider>
  );
}
