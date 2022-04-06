import styled from "styled-components";
import { RiFullscreenFill } from "react-icons/ri";

import data from "../../public/data.json";

import { FlexCard } from "../components/UI/Cards";
import { Link } from "react-router-dom";

const AppCard = styled(FlexCard)`
  width: 100%;
  height: 100%;
`;

const Home = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <ul className="grid grid-cols-4 gap-3">
        {data.apps.map((app, index) => (
          <li className="group relative">
            <Link
              to={`apps/${index}`}
              className="absolute top-1/2 right-2 mr-3 w-0 -translate-y-1/2 overflow-hidden rounded-md bg-white py-2 transition-all duration-200 hover:bg-cyan-200 hover:bg-opacity-40 group-hover:w-9 group-hover:px-2 dark:hover:bg-cyan-400 dark:hover:bg-opacity-60"
            >
              <RiFullscreenFill size={20} />
            </Link>
            <Link to={app.url} key={index}>
              <AppCard className="!justify-start transition-shadow group-hover:shadow-lg dark:bg-slate-800">
                <img className="icon" src={`/assets/${app.image}`} />
                <h2 className="ml-2 text-lg">{app.name}</h2>
              </AppCard>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
