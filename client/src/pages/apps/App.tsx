import { useEffect, useRef, useState } from "react";

import { useParams, useSearchParams } from "react-router-dom";
import { HiOutlineExternalLink, HiOutlineRefresh } from "react-icons/hi";

import PiHole from "./PiHole";
import SearchBar from "../../components/modules/SearchBar";
import useWindowWidth from "../../hooks/windowWidth";
import AppIcon from "../../components/ui/AppIcon";
import { useAppDataContext } from "../../components/context/AppDataContext";
import Service from "../../components/modules/services/_Service";
import DynamicIcon from "../../components/ui/DynamicIcon";

const App = () => {
  const { data } = useAppDataContext();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const app =
    data.categories[parseInt(params.catIndex ?? "9999")].apps[
      parseInt(params.appIndex ?? "9999")
    ];
  const [url, setUrl] = useState<string>("");
  const frame = useRef<HTMLIFrameElement>(null);
  const { isMobile } = useWindowWidth();

  useEffect(() => {
    setUrl(app.url + (searchParams.get("path") ?? ""));
  }, [params]);

  const navigate = (path: string) => {
    if (frame === null || frame.current === null) return;
    frame.current.src = app.url + path;
  };

  if (!app) return <div>App not found</div>;

  switch (app.type?.toLowerCase()) {
    case "pi-hole":
      return <PiHole {...app} />;

    default:
      return (
        <>
          <div className="tip-bottom mb-2 items-center justify-between md:-mt-4 md:flex">
            <h1 className="mb-0 flex items-center">
              <AppIcon
                imgClassName="h-12 mr-2"
                iconSize={32}
                iconClassName="h-12 mr-2"
                image={app.image}
                appName={app.name}
              />
              {app.name}
              <a
                href={app.url}
                className="link ml-2 mr-2 opacity-80 hover:opacity-100"
              >
                <HiOutlineExternalLink />
              </a>
              <button
                onClick={() => {
                  if (frame === null || frame.current === null) return;
                  frame.current.src = url;
                }}
                className="btn btn-primary btn-square btn-sm"
              >
                <HiOutlineRefresh size={20} />
              </button>
            </h1>
            {app.customLinks && app.customLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {app.customLinks.map((link, index) => (
                  <button
                    key={index}
                    className="btn btn-sm"
                    onClick={() => navigate(link.path)}
                  >
                    {link.icon ? (
                      <DynamicIcon icon={link.icon} className="mr-1" />
                    ) : (
                      <span className="mr-1">{index + 1}</span>
                    )}
                    {link.name}
                  </button>
                ))}
              </div>
            )}
            <Service app={app} />
            {data.settings?.searchEngine?.display?.includes(
              isMobile ? "mobile" : "large-screen"
            ) &&
              data.settings?.searchEngine?.inApp && (
                <div className="flex justify-center">
                  <SearchBar isNewTab />
                </div>
              )}
          </div>
          {url && url !== "" ? (
            <iframe
              ref={frame}
              src={url}
              className="h-[85vh] w-full rounded-md border-2 dark:border-slate-700 sm:mr-4 sm:w-full md:h-[90vh]"
            ></iframe>
          ) : (
            <div className="h-[85vh] w-full rounded-md border-2 dark:border-slate-700 sm:mr-4 sm:w-full md:h-[90vh]">
              Loading
            </div>
          )}
        </>
      );
  }
};

export default App;
