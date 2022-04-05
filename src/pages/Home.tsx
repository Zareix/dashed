import styled from "styled-components";
import { RiFullscreenFill } from "react-icons/ri";

import Layout from "../components/Layout";

import data from "../../public/data.json";

import { FlexCard } from "../components/Cards";

const AppCard = styled(FlexCard)`
  width: 100%;
  height: 100%;

  img {
    margin: 0 0.5rem;
    width: 52px;
    aspect-ratio: 1/1;
    object-fit: contain;
  }
`;

type HomeProps = {
  path: string;
};

const Home = (props: HomeProps) => {
  return (
    <Layout title="Dashboard">
      <div className="mt-6 grid grid-cols-4 gap-3">
        {data.apps.map((app, index) => (
          <a href={app.url}>
            <AppCard className="transition-shadow hover:shadow-lg dark:bg-slate-800">
              <img src={`/assets/apps/${app.image}`} />
              <h2 className="text-lg">{app.name}</h2>
              <a
                href={`apps/${index}`}
                className="ml-auto mr-3 rounded-md p-2 transition-colors duration-200 hover:bg-cyan-200 hover:bg-opacity-40 dark:hover:bg-cyan-400 dark:hover:bg-opacity-60"
              >
                <RiFullscreenFill size={20} />
              </a>
            </AppCard>
          </a>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
