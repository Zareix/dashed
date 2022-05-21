import { useEffect, useRef, useState } from "react";

import { useParams, useSearchParams } from "react-router-dom";
import { HiOutlineExternalLink, HiOutlineRefresh } from "react-icons/hi";

import data from "data.json";

import PiHole from "./PiHole";
import { Button } from "../../components/ui/Button";
import SearchBar from "../../components/modules/SearchBar";
import useWindowWidth from "../../hooks/windowWidth";

const App = () => {
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
              <img className="icon mr-2" src={`/assets/${app.image}`} />
              {app.name}
              <a
                href={app.url}
                className="ml-3 text-gray-700 hover:text-gray-600 dark:text-gray-400"
              >
                <HiOutlineExternalLink />
              </a>
            </h1>
            {!isMobile && (
              <>
                <div className="flex justify-center">
                  <SearchBar isNewTab />
                </div>
                <Button
                  onClick={() => {
                    if (frame === null || frame.current === null) return;
                    frame.current.src = url;
                  }}
                >
                  <HiOutlineRefresh size={20} />
                </Button>
              </>
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
