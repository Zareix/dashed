import { useEffect, useState } from "react";

const useScroll = (offset?: number) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollAmount, setScrollAmount] = useState(0);
  const scrollOffset = offset ?? 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrollAmount(window.scrollY);
      if (window.scrollY > scrollOffset) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { scrolled, scrollAmount };
};

export default useScroll;
