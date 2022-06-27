import { TbBrush } from "react-icons/tb";
import ThemeForm from "./ThemeForm";

const ThemeSelector = () => {
  return (
    <div className="dropdown-top dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-square btn-sm m-1">
        <TbBrush size={15} />
      </label>
      <div
        tabIndex={0}
        className="card-compact card dropdown-content w-64 bg-base-200 p-2 shadow"
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
