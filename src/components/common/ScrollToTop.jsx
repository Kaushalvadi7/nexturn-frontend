import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ScrollToTop = () => {
  const location = useLocation();
  const { pathname, hash, key } = location;

  useEffect(() => {
    let isInterrupted = false;

    // Listener to abort automated scroll if user interacts
    const interrupt = () => {
      isInterrupted = true;
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchmove", interrupt);
      window.removeEventListener("mousedown", interrupt);
    };

    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchmove", interrupt, { passive: true });
    window.addEventListener("mousedown", interrupt, { passive: true });

    const handleScroll = () => {
      if (isInterrupted) return;

      const elementId = hash.replace("#", "");
      const element = document.getElementById(elementId);

      if (element) {
        const activeSmoother = ScrollSmoother.get();
        if (activeSmoother) {
          ScrollTrigger.refresh();
          const style = window.getComputedStyle(element);
          const scrollMarginTop = parseInt(style.scrollMarginTop) || 120;
          activeSmoother.scrollTo(element, true, `top ${scrollMarginTop}px`);
          
          // If we are already on the page (not initial load), one scroll is enough
          // We can't easily detect initial load here without a ref, 
          // but if we are in the footer, we definitely aren't in initial load.
        } else {
          const offset = 120;
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth",
          });
        }
      }
    };

    if (hash) {
      const initialTimer = setTimeout(handleScroll, 100);
      const secondaryTimer = setTimeout(handleScroll, 1000);
      const loaderTimer = setTimeout(handleScroll, 3500);

      return () => {
        clearTimeout(initialTimer);
        clearTimeout(secondaryTimer);
        clearTimeout(loaderTimer);
        cleanupListeners();
      };
    } else {
      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.scrollTo(0, false);
      } else {
        window.scrollTo(0, 0);
      }
      cleanupListeners();
    }
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
