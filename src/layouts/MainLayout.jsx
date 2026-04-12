import { useLayoutEffect, useRef } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Outlet, useLocation } from "react-router-dom";
import ContactInfoProvider from "../components/common/ContactInfoProvider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const MainLayout = () => {
  const { pathname } = useLocation();
  const smootherRef = useRef(null);

  useLayoutEffect(() => {
    // Initialize ScrollSmoother first, before any other components try to use it
    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5, // Butter smooth feel
      effects: true, // Enable data-speed/data-lag attributes
      smoothTouch: 0.1, // Smooth scrolling on touch devices
      normalizeScroll: true, // Crucial for fixing mobile address bar issues
    });

    window.smoother = smootherRef.current;

    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
      }
    };
  }, []);

  // Recalculate ScrollTrigger on route change (essential for ScrollSmoother)
  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <ContactInfoProvider>
        {/* GSAP ScrollSmoother Wrappers: Fixed elements can sit inside the wrapper but OUTSIDE content */}
        <div id="smooth-wrapper">
          <Navbar />
          <div id="smooth-content">
            <Outlet />
            <Footer />
          </div>
        </div>
      </ContactInfoProvider>
    </div>
  );
};

export default MainLayout;
