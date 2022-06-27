import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { RiFullscreenFill } from "react-icons/ri";
import { ImEarth } from "react-icons/im";

import data from "data.json";

import DynamicIcon from "../components/ui/DynamicIcon";
import { Button } from "../components/ui/Button";
import { FlexCard } from "../components/ui/Cards";
import ServiceDetails from "../components/modules/services/_ServiceDetails";
import Service from "../components/modules/services/_Service";
import useWindowWidth from "../hooks/windowWidth";
import ContextMenu from "../components/ui/ContextMenu";
import SearchBar from "../components/modules/SearchBar";
import Clock from "../components/modules/Clock";
import AppIcon from "../components/ui/AppIcon";
import { Application } from "../models/Applications";
import HealthChecks from "../components/modules/services/HealthChecks";

const Home = () => {
  const { isMobile } = useWindowWidth();

  useEffect(() => {
    if (
      data.settings?.searchEngine?.autofocus?.includes(
        isMobile ? "mobile" : "large-screen"
      )
    ) {
      (document.querySelector("#searchInput input") as HTMLElement)?.focus();
    }
  }, []);

  return (
    <>
      <div className="w-full items-center justify-between md:flex">
        {!isMobile && (
          <>
            <h1 className="mb-0">Home</h1>
            <div className="flex items-center justify-center gap-3">
              {data.settings?.searchEngine?.display?.includes(
                "large-screen"
              ) && <SearchBar />}
              {data.modules?.healthCheck && (
                <HealthChecks sources={data.modules.healthCheck} />
              )}
              <Clock />
            </div>
          </>
        )}
        {isMobile && (
          <>
            <div className="flex items-center justify-between">
              <h1 className="mb-0">Home</h1>
              <Clock />
            </div>
            {data.settings?.searchEngine?.display?.includes("mobile") && (
              <div className="flex justify-center">
                <SearchBar />
              </div>
            )}
          </>
        )}
      </div>
      <div id="home" className="pb-10">
        {data.categories.map((cat, i) => {
          return (
            <section key={i} className="mt-5">
              <h2 className="mb-3 ml-3 flex items-center text-2xl text-gray-700 dark:text-gray-300">
                <DynamicIcon icon={cat.icon} className="mr-2" />
                {cat.name}
              </h2>
              <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cat.apps.map((app: Application, j) => (
                  <li className="group relative h-max" key={j}>
                    <div className="absolute right-2 top-1/2 ml-auto mr-14 -translate-y-1/2 transition-all duration-300 md:mr-4 md:group-hover:mr-14 md:empty:group-hover:mr-0">
                      <Service app={app} />
                    </div>
                    {!app.external && (
                      <Button
                        as={Link}
                        to={`/categories/${i}/apps/${j}`}
                        className="absolute top-1/2 right-2 mr-3 -translate-y-1/2 overflow-hidden
                            border py-2 px-2 md:w-0 md:border-0 md:px-0 md:group-hover:w-10 md:group-hover:border md:group-hover:px-2"
                      >
                        <RiFullscreenFill size={20} className="mx-auto" />
                      </Button>
                    )}
                    <a href={app.url} id={i + "///" + j}>
                      <FlexCard className="!justify-start transition-shadow group-hover:shadow-lg">
                        <AppIcon
                          imgClassName="icon p-[0.1rem]"
                          iconClassName="icon p-1"
                          appName={app.name}
                          image={app.image}
                          iconSize={52}
                        />
                        <div className="ml-2">
                          <h2
                            className={`-mb-1 text-lg leading-6 ${
                              app.external ? "italic" : ""
                            }`}
                          >
                            {app.name}
                          </h2>
                          <div className="text-sm text-gray-500">
                            {app.subtitle}
                            {(!app.subtitle || app.subtitle === "") && (
                              <ServiceDetails app={app} />
                            )}
                          </div>
                        </div>
                      </FlexCard>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      {!isMobile && <ContextMenu />}
    </>
  );
};

type Props = {
  imgSrc: string;
};

const CardImg = ({ imgSrc }: Props) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="icon flex items-center justify-center">
        <ImEarth size={52} className="p-2" />
      </div>
    );
  }

  return (
    <img
      className="icon"
      src={`/assets/${imgSrc}`}
      onError={() => setError(true)}
    />
  );
};

export default Home;
