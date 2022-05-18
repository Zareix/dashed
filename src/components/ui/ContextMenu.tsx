import { useCallback, useEffect, useState } from "react";

import { FiExternalLink } from "react-icons/fi";
import { RiFullscreenFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import styled from "styled-components";

import data from "data.json";
import { Application } from "../../models/Applications";
import DynamicIcon from "./DynamicIcon";

const IconNumber = styled.span`
  border-radius: 8px;
  width: 1.375rem;
  height: 1.375rem;
  text-align: center;
  line-height: 1.375rem;
`;

type MenuProps = {
  top: number;
  left: number;
};

const Menu = styled.div`
  font-size: 14px;
  border-radius: 8px;
  height: auto;
  margin: 0;
  padding: 0.5rem 0;
  position: absolute;
  list-style: none;
  top: ${(props: MenuProps) => props.top}px;
  left: ${(props: MenuProps) => props.left}px;
`;

const ContextMenu = () => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const [path, setPath] = useState("");
  const [app, setApp] = useState<Application>();

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      setPath("");
      setApp(undefined);
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      if (event.path) {
        event.path.map((x: HTMLElement) => {
          if (x.id === "home") {
            setShow(true);
          }
          if (x instanceof HTMLAnchorElement && x.id?.includes("///")) {
            let p = x.id.split("///");
            let app = data.categories[parseInt(p[0])].apps[parseInt(p[1])];
            setPath(`categories/${p[0]}/apps/${p[1]}`);
            setApp(app);
          }
        });
      }
    },
    [setAnchorPoint, setShow]
  );

  const handleClick = useCallback(() => {
    if (show) {
      setShow(false);
      setPath("");
      setApp(undefined);
    }
  }, [show]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  if (show && (app || path !== ""))
    return (
      <Menu
        className="bg-slate-50 shadow-2xl dark:bg-slate-700"
        top={anchorPoint.y}
        left={anchorPoint.x}
      >
        <ul>
          {app && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={app.url}
                className="flex gap-1 px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                <FiExternalLink size={22} />
                Open in new tab
              </a>
            </li>
          )}
          {path !== "" && (
            <li>
              <Link
                to={path}
                className="flex gap-1 px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                <RiFullscreenFill size={22} />
                Open here
              </Link>
            </li>
          )}
          {path !== "" &&
            app &&
            app.customLinks &&
            app.customLinks.map((x, i) => (
              <li key={i}>
                {x.path.startsWith("http") ? (
                  <a
                    href={x.path}
                    className="flex gap-1 px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    {x.name}
                  </a>
                ) : (
                  <Link
                    to={`${path}?path=${x.path}`}
                    className="flex items-center gap-1 px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    {x.icon ? (
                      <DynamicIcon icon={x.icon} size={22} />
                    ) : (
                      <IconNumber className="bg-slate-200 dark:bg-slate-500">
                        {i}
                      </IconNumber>
                    )}
                    {x.name}
                  </Link>
                )}
              </li>
            ))}
        </ul>
      </Menu>
    );
  return <></>;
};

export default ContextMenu;
