import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { Button } from "../../ui/Button";

import DynamicIcon from "../../ui/DynamicIcon";

type NavLinkProps = {
  name: string;
  link: string;
  icon?: string;
  image?: string;
};

const NavLink = (props: NavLinkProps) => {
  const resolved = useResolvedPath(props.link);
  const match = useMatch({
    path: resolved.pathname,
    end: props.link === "/",
  });
  return (
    <Button
      as={Link}
      to={props.link}
      className="flex items-center rounded-md p-2 transition-colors duration-300 hover:bg-cyan-100 dark:hover:bg-cyan-700 dark:hover:bg-opacity-50"
    >
      {props.image && (
        <img
          src={`assets/${props.image}`}
          className="mr-2 aspect-square w-6 object-contain"
        />
      )}
      {props.icon && (
        <div className="mr-2 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 p-2 text-white shadow-md dark:from-cyan-500 dark:to-cyan-700">
          <DynamicIcon icon={props.icon} size={18} />
        </div>
      )}
      <span
        className={match ? "font-bold" : "text-gray-600 dark:text-gray-400"}
      >
        {props.name}
      </span>
    </Button>
  );
};

export default NavLink;
