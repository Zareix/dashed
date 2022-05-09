import { useParams } from "react-router-dom";

import { HiOutlineExternalLink, HiOutlineRefresh } from "react-icons/hi";

import data from "data.json";

import PiHole from "./PiHole";
import { useRef } from "react";
import { Button } from "../../components/ui/Button";

const App = () => {
  const params = useParams();
  const app =
    data.categories[parseInt(params.catIndex ?? "9999")].apps[
      parseInt(params.appIndex ?? "9999")
    ];
  const frame = useRef<HTMLIFrameElement>(null);

  if (!app) return <div>App not found</div>;

  switch (app.type?.toLowerCase()) {
    case "pi-hole":
      return <PiHole {...app} />;

    default:
      return (
        <>
          <h1 className="flex items-center">
            <img className="icon mr-2" src={`/assets/${app.image}`} />
            {app.name}
            <a
              href={app.url}
              className="ml-3 text-gray-700 hover:text-gray-600 dark:text-gray-400"
            >
              <HiOutlineExternalLink />
            </a>
          </h1>
          <iframe
            ref={frame}
            src={app.url}
            className="h-[39rem] max-h-[80vh] w-full rounded-md border-2 dark:border-slate-700 sm:w-[98%]"
          ></iframe>
          <div className="mt-2 flex w-full items-center justify-center">
            <Button
              onClick={() => {
                if (frame === null || frame.current === null) return;
                frame.current.src = frame.current.src;
              }}
            >
              <HiOutlineRefresh size={20} />
            </Button>
          </div>
        </>
      );
  }
};

export default App;
