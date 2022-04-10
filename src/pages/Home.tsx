import data from "data.json";

import DynamicIcon from "../components/ui/DynamicIcon";
import AppsList from "../components/shared/AppsList";

const Home = () => {
  return (
    <>
      <h1>Dashboard</h1>
      {data.categories.map((cat, index) => {
        return (
          <section key={index} className="mt-4">
            <h2 className="mb-3 ml-3 flex items-center text-2xl text-gray-700 dark:text-gray-300">
              <DynamicIcon icon={cat.icon} className="mr-2" />
              {cat.name}
            </h2>
            <AppsList category={cat} index={index} />
          </section>
        );
      })}
    </>
  );
};

export default Home;
