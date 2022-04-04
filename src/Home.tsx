import styled from "styled-components";
import { RiFullscreenFill } from "react-icons/ri";

import Layout from "./components/Layout";

import data from "../assets/data.json";

const AppCard = styled.a`
  width: 100%;
  border-radius: 14px;
  display: flex;
  align-items: center;
  padding: 1rem;

  img {
    margin: 0 0.5rem;
    width: 48px;
    aspect-ratio: 1/1;
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
          <AppCard
            className="bg-white shadow transition-shadow hover:shadow-lg dark:bg-slate-800"
            href={app.url}
          >
            <img src="assets/apps/portainer.svg" />
            <h2 className="text-lg">{app.name}</h2>
            <a
              href={`apps/${index}`}
              className="ml-auto mr-3 rounded-md p-2 transition-colors duration-200 hover:bg-cyan-200 hover:bg-opacity-40 dark:hover:bg-cyan-400 dark:hover:bg-opacity-60"
            >
              <RiFullscreenFill size={20} />
            </a>
          </AppCard>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
