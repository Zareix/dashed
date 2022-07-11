import { SubmitHandler, useForm } from "react-hook-form";

const THEMES = [
  "acid",
  "aqua",
  "autumn",
  "black",
  "bumblebee",
  "business",
  "cmyk",
  "coffee",
  "corporate",
  "cupcake",
  "cyberpunk",
  "dark",
  "dracula",
  "emerald",
  "fantasy",
  "forest",
  "garden",
  "halloween",
  "lemonade",
  "light",
  "lofi",
  "luxury",
  "night",
  "pastel",
  "retro",
  "synthwave",
  "valentine",
  "winter",
  "wireframe",
];

type Inputs = {
  theme: string;
  lightTheme: string;
  darkTheme: string;
  followOSTheme: boolean;
};

const ThemeForm = () => {
  const { register, handleSubmit, watch } = useForm<Inputs>({
    defaultValues: {
      theme: localStorage.getItem("theme") ?? "light",
      lightTheme: localStorage.getItem("lightTheme") ?? "light",
      darkTheme: localStorage.getItem("darkTheme") ?? "dark",
      followOSTheme:
        localStorage.getItem("lightTheme") !== null &&
        localStorage.getItem("lightTheme") !== "" &&
        localStorage.getItem("darkTheme") !== null &&
        localStorage.getItem("darkTheme") !== "",
    },
  });
  const submit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    reset();
    if (data.followOSTheme) {
      setAutoTheme(data.lightTheme, data.darkTheme);
    } else {
      setTheme(data.theme);
    }
  };

  const reset = () => {
    localStorage.removeItem("theme");
    localStorage.removeItem("lightTheme");
    localStorage.removeItem("darkTheme");
  };

  const setTheme = (theme: string) => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  const setAutoTheme = (lightTheme: string, darkTheme: string) => {
    localStorage.setItem("lightTheme", lightTheme);
    localStorage.setItem("darkTheme", darkTheme);
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-theme", darkTheme);
    } else {
      document.documentElement.setAttribute("data-theme", lightTheme);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Follow system theme</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            {...register("followOSTheme")}
          />
        </label>
      </div>
      {watch("followOSTheme") ? (
        <>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Light theme</span>
            </label>
            <select className="select select-sm" {...register("lightTheme")}>
              {THEMES.map((t) => (
                <option value={t} key={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text">Dark theme</span>
            </label>
            <select className="select select-sm" {...register("darkTheme")}>
              {THEMES.map((t) => (
                <option value={t} key={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <select
          className="select select-sm w-full max-w-xs"
          {...register("theme")}
        >
          {THEMES.map((t) => (
            <option value={t} key={t}>
              {t}
            </option>
          ))}
        </select>
      )}
      <button className="btn btn-primary btn-sm mt-4">Save</button>
    </form>
  );
};

export default ThemeForm;
