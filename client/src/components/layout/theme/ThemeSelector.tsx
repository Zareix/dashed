import { TbBrush } from "react-icons/tb";

import ThemeForm from "./ThemeForm";

const ThemeSelector = () => {
  return (
    <div className="dropdown-top dropdown ">
      <label tabIndex={0} className="btn btn-square btn-sm m-1">
        <TbBrush size={15} />
      </label>
      <div
        tabIndex={0}
        className="card-compact card dropdown-content z-30 w-64 bg-base-200 p-2 shadow-xl"
      >
        <div className="card-body">
          <h3 className="card-title">Theme</h3>
          <ThemeForm />
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
