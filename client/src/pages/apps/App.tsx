import { useEffect, useRef, useState } from "react";

import { useParams, useSearchParams } from "react-router-dom";
import { HiOutlineExternalLink, HiOutlineRefresh } from "react-icons/hi";

import PiHole from "./PiHole";
import SearchBar from "../../components/modules/SearchBar";
import useWindowWidth from "../../hooks/windowWidth";
import AppIcon from "../../components/ui/AppIcon";
import { useAppDataContext } from "../../components/context/AppDataContext";

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

  if (!app) return <div>App not found</div>;

  switch (app.type?.toLowerCase()) {
    case "pi-hole":
      return <PiHole {...app} />;

    default:
      return (
        <>
          <div className="mb-2 items-center justify-between md:-mt-4 md:flex">
            <h1 className="mb-0 flex items-center">
              <AppIcon
                imgClassName="icon mr-2"
                iconSize={32}
                iconClassName="mr-2"
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
