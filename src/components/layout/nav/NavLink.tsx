import { useState } from "react";
import { ImEarth } from "react-icons/im";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

import { Application } from "../../../models/Applications";
import Service from "../../modules/Service";
import { Button } from "../../ui/Button";
import DynamicIcon from "../../ui/DynamicIcon";

type NavLinkProps = {
  name: string;
  link: string;
  app?: Application;
  icon?: string;
  image?: string;
  isWorkspace?: boolean;
};

const NavLink = (props: NavLinkProps) => {
  const resolved = useResolvedPath(props.link);
  const match = useMatch({
    path: resolved.pathname,
    end: props.link === "/",
  });
  const [imgError, setImgError] = useState(false);

  return (
    <Button
      as={Link}
      to={props.link}
      title={props.name}
      className={`d flex items-center gap-2 overflow-x-auto rounded-md p-2 transition-colors duration-300 ${
        match
          ? "bg-cyan-200 dark:bg-cyan-700"
          : "bg-transparent dark:bg-transparent"
      }`}
    >
      {props.image && !imgError && (
        <img
          src={`assets/${props.image}`}
          onError={() => setImgError(true)}
          className="aspect-square w-6 object-contain"
        />
      )}
      {imgError && <ImEarth size={25} />}
      {props.icon && (
        <div className="rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 p-2 text-white shadow-md dark:from-cyan-500 dark:to-cyan-700">
          <DynamicIcon icon={props.icon} size={18} />
        </div>
      )}
      {!props.isWorkspace && (
        <span
          className={match ? "font-bold" : "text-gray-600 dark:text-gray-400"}
        >
          {props.name}
        </span>
      )}
      {props.app && !props.isWorkspace && (
        <span className="discret ml-auto mr-2">
          <Service app={props.app} />
        </span>
      )}
    </Button>
  );
};

export default NavLink;
