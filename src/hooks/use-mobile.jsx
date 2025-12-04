import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

// useMobile (JSX)
// - SSR-safe (returns false on server)
// - Uses matchMedia with fallbacks for older browsers
export function useMobile() {
  const isClient = typeof window !== "undefined";

  const getInitial = () => (isClient ? window.innerWidth < MOBILE_BREAKPOINT : false);
  const [isMobile, setIsMobile] = useState(getInitial);

  useEffect(() => {
    if (!isClient) return;

    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handler = (e) => {
      if (e && "matches" in e) {
        setIsMobile(e.matches);
      } else {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }
    };

    setIsMobile(mq.matches);

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler);
    } else if (typeof mq.addListener === "function") {
      mq.addListener(handler);
    } else {
      window.addEventListener("resize", handler);
    }

    return () => {
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", handler);
      } else if (typeof mq.removeListener === "function") {
        mq.removeListener(handler);
      } else {
        window.removeEventListener("resize", handler);
      }
    };
  }, [isClient]);

  return isMobile;
}

export default useMobile;
