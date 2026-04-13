import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";

const DIRECTION_THRESHOLD = 1;

const ScrollTopButton = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollYRef = useRef(0);
  const isVisibleRef = useRef(false);

  const getScrollY = useCallback(() => {
    if (typeof window === "undefined") return 0;

    const smoother = ScrollSmoother.get();
    if (smoother) {
      return smoother.scrollTop();
    }

    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }, []);

  const updateVisibility = useCallback((nextVisible) => {
    if (isVisibleRef.current === nextVisible) return;
    isVisibleRef.current = nextVisible;
    setIsVisible(nextVisible);
  }, []);

  const evaluateScroll = useCallback(() => {
    const currentY = getScrollY();
    const delta = currentY - lastScrollYRef.current;
    const firstViewportHeight = window.innerHeight || 0;

    if (currentY <= 0) {
      updateVisibility(false);
    } else if (delta > DIRECTION_THRESHOLD) {
      updateVisibility(false);
    } else if (currentY > firstViewportHeight && delta < -DIRECTION_THRESHOLD) {
      updateVisibility(true);
    }

    lastScrollYRef.current = currentY;
  }, [getScrollY, updateVisibility]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    // GSAP ticker tracks ScrollSmoother movement reliably on desktop + mobile.
    gsap.ticker.add(evaluateScroll);

    return () => {
      gsap.ticker.remove(evaluateScroll);
    };
  }, [evaluateScroll]);

  useEffect(() => {
    isVisibleRef.current = false;
    lastScrollYRef.current = getScrollY();
  }, [pathname, getScrollY]);

  const handleClick = () => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(0, true);
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={handleClick}
      className={`fixed right-4 sm:right-6 z-[90] inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-black/25 transition-all duration-200 hover:bg-[#1b2f4e] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
      style={{
        bottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
    >
      <span className="material-symbols-outlined text-[22px] leading-none">north</span>
    </button>
  );
};

export default ScrollTopButton;
