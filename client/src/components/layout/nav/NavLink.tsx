import { Link, useMatch, useResolvedPath } from "react-router-dom";

import { Application } from "../../../models/Applications";
import Service from "../../modules/services/_Service";
import AppIcon from "../../ui/AppIcon";
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

  return (
    <Button
      as={Link}
      to={props.link}
      title={props.name}
      className={`flex items-center gap-2 overflow-x-auto rounded-md p-2 transition-colors duration-300 ${
        match
          ? "bg-cyan-200 dark:bg-cyan-700"
          : "bg-transparent dark:bg-transparent"
      }`}
    >
      <AppIcon
        image={props.image}
        icon={props.icon}
        appName={props.name}
        imgClassName="aspect-square w-7 object-contain"
        iconClassName={
          props.icon &&
          "rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 p-2 text-white shadow-md dark:from-cyan-500 dark:to-cyan-700"
        }
      />
      {!props.isWorkspace && (
        <span className={match ? "font-bold" : ""}>{props.name}</span>
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
