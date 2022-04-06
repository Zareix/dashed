import data from "data.json";

import DynamicIcon from "../components/UI/DynamicIcon";
import AppsList from "./apps/AppsList";

const Home = () => {
  return (
    <>
      <h1>Dashboard</h1>
      {data.categories.map((cat, i) => {
        return (
          <section key={i}>
            <h2 className="mb-3 ml-3 flex items-center text-2xl text-gray-700 dark:text-gray-300">
              <DynamicIcon icon={cat.icon} className="mr-2" />
              {cat.name}
            </h2>

            <AppsList category={cat} index={i} />
          </section>
        );
      })}
    </>
  );
};

export default Home;
