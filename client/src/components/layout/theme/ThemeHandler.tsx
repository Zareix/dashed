import { useEffect } from "react";

const ThemeHandler = () => {
  const setDarkTheme = () =>
    document.documentElement.setAttribute(
      "data-theme",
      localStorage.getItem("darkTheme") ?? "dark"
    );
  const setLightTheme = () =>
    document.documentElement.setAttribute(
      "data-theme",
      localStorage.getItem("lightTheme") ?? "light"
    );

  const handleTheme = () => {
    const lightTheme = localStorage.getItem("lightTheme");
    const darkTheme = localStorage.getItem("darkTheme");
    if (lightTheme && lightTheme !== "" && darkTheme && darkTheme !== "") {
      const isOSDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      isOSDark ? setDarkTheme() : setLightTheme();
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (event) => {
          event.matches ? setDarkTheme() : setLightTheme();
        });
    } else {
      document.documentElement.setAttribute(
        "data-theme",
        localStorage.getItem("theme") ?? "light"
      );
    }
  };

  const unHandleTheme = () => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeEventListener("change", (event) => {
        event.matches ? setDarkTheme() : setLightTheme();
      });
  };

  useEffect(() => {
    handleTheme();

    return () => {
      unHandleTheme();
    };
  }, []);

  return <></>;
};

export default ThemeHandler;
