import { AiTwotoneHome } from "react-icons/ai";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

type NavLinkProps = {
  name: string;
  link: string;
};

const NavLink = (props: NavLinkProps) => {
  const resolved = useResolvedPath(props.link);
  const match = useMatch({
    path: resolved.pathname,
    end: true,
  });
  return (
    <li>
      <Link
        to={props.link}
        className="flex items-center rounded-md p-2 transition-colors duration-300 hover:bg-cyan-100 dark:hover:bg-cyan-700 dark:hover:bg-opacity-50"
      >
        <div className="mr-2 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 p-2 text-white shadow-md dark:from-cyan-500 dark:to-cyan-700">
          <AiTwotoneHome size={18} />
        </div>
        <span className={match ? "font-bold" : ""}>{props.name}</span>
      </Link>
    </li>
  );
};

export default NavLink;
