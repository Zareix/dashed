import { useEffect, useState } from "react";

const mobileBreakpoint = 640;

const useWindowWidth = () => {
  const isOnBrowser = typeof window !== "undefined";
  const [width, setWidth] = useState(isOnBrowser ? window.innerWidth : 1200);
  const [isMobile, setIsMobile] = useState(
    isOnBrowser && window.innerWidth <= mobileBreakpoint
  );

  useEffect(() => {
    if (!isOnBrowser) return;

    const callback = () => {
      setWidth(window.innerWidth);
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  }, [isOnBrowser]);

  return { width, isMobile };
};

export default useWindowWidth;
