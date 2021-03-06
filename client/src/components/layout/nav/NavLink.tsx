import { Link, useMatch, useResolvedPath } from "react-router-dom";

import { Application } from "../../../models/Applications";
import Service from "../../modules/services/_Service";
import AppIcon from "../../ui/AppIcon";

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
    <Link
      to={props.link}
      title={props.name}
      className={`flex items-center gap-2 overflow-x-auto rounded-md p-2 transition-colors duration-300 hover:bg-primary hover:bg-opacity-5 ${
        match ? "bg-primary bg-opacity-10" : "bg-transparent"
      }`}
    >
      <AppIcon
        image={props.image}
        icon={props.icon}
        appName={props.name}
        imgClassName="aspect-square w-7 object-contain"
        iconClassName={
          props.icon && "btn btn-square btn-sm btn-primary shadow-md"
        }
        iconSize={22}
      />
      {!props.isWorkspace && (
        <span className={match ? "font-bold" : ""}>{props.name}</span>
      )}
      {props.app && !props.isWorkspace && (
        <span className="discret ml-auto mr-2">
          <Service app={props.app} />
        </span>
      )}
    </Link>
  );
};

export default NavLink;
