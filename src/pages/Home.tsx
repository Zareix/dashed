import { useState } from "react";

import { Link } from "react-router-dom";
import { RiFullscreenFill } from "react-icons/ri";
import { ImEarth } from "react-icons/im";

import data from "data.json";

import DynamicIcon from "../components/ui/DynamicIcon";
import { Button } from "../components/ui/Button";
import { FlexCard } from "../components/ui/Cards";
import ServiceDetails from "../components/modules/ServiceDetails";
import Service from "../components/modules/Service";
import useWindowWidth from "../hooks/windowWidth";
import ContextMenu from "../components/ui/ContextMenu";
import SearchBar from "../components/modules/SearchBar";

const Home = () => {
  const { isMobile } = useWindowWidth();

  return (
    <>
      <div className="w-full items-center justify-between md:flex md:w-4/5">
        <h1 className="mb-0">Home</h1>
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </div>
      <div id="home">
        {data.categories.map((cat, i) => {
          return (
            <section key={i} className="mt-4">
              <h2 className="mb-3 ml-3 flex items-center text-2xl text-gray-700 dark:text-gray-300">
                <DynamicIcon icon={cat.icon} className="mr-2" />
                {cat.name}
              </h2>
              <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cat.apps.map((app, j) => (
                  <li className="group relative h-max" key={j}>
                    <Button
                      as={Link}
                      to={`/categories/${i}/apps/${j}`}
                      className="absolute top-1/2 right-2 mr-3 -translate-y-1/2 overflow-hidden
                            border py-2 px-2 md:w-0 md:border-0 md:px-0 md:group-hover:w-10 md:group-hover:border md:group-hover:px-2"
                    >
                      <RiFullscreenFill size={20} className="mx-auto" />
                    </Button>
                    <a href={app.url} id={i + "///" + j}>
                      <FlexCard className="!justify-start transition-shadow group-hover:shadow-lg">
                        <CardImg imgSrc={app.image} />
                        <div className="ml-2">
                          <h2 className="-mb-1 text-lg leading-6 ">
                            {app.name}
                          </h2>
                          <div className="text-sm text-gray-500">
                            <ServiceDetails app={app} />
                          </div>
                        </div>
                        <div className="ml-auto mr-14 transition-all duration-300 md:mr-4 md:group-hover:mr-14 md:empty:group-hover:mr-0">
                          <Service app={app} />
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
