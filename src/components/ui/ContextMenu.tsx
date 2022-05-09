import { useCallback, useEffect, useState } from "react";

import { FiExternalLink } from "react-icons/fi";
import { RiFullscreenFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import styled from "styled-components";

import data from "data.json";

type MenuProps = {
  top: number;
  left: number;
};

const Menu = styled.div`
  font-size: 14px;
  border-radius: 8px;
  padding: 5px 0 5px 0;
  height: auto;
  margin: 0;
  padding: 1rem 0;
  position: absolute;
  list-style: none;
  top: ${(props: MenuProps) => props.top}px;
  left: ${(props: MenuProps) => props.left}px;
`;

const ContextMenu = () => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const [path, setPath] = useState("");
  const [url, setUrl] = useState("");

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      setPath("");
      setUrl("");
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
            setUrl(app.url);
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
      setUrl("");
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

  if (show && (url !== "" || path !== ""))
    return (
      <Menu
        className="bg-gray-50 shadow-xl dark:bg-gray-500"
        top={anchorPoint.y}
        left={anchorPoint.x}
      >
        <ul>
          {url !== "" && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={url}
                className="flex gap-1 px-3 py-2 dark:hover:bg-gray-600"
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
                className="flex gap-1 px-3 py-2 dark:hover:bg-gray-600"
              >
                <RiFullscreenFill size={22} />
                Open here
              </Link>
            </li>
          )}
        </ul>
      </Menu>
    );
  return <></>;
};

export default ContextMenu;
