import { useParams } from "@reach/router";
import React from "react";
import Layout from "../../components/Layout";

import data from "../../../assets/data.json";

type Props = {
  path: string;
};

const App = ({ path }: Props) => {
  const params = useParams();
  console.log(params.index);

  return (
    <Layout
      title={data.apps[params.index] ? data.apps[params.index].name : ""}
      imgSrc={
        data.apps[params.index]
          ? "/assets/apps/" + data.apps[params.index].image
          : ""
      }
    >
      {data.apps[params.index] ? (
        <iframe
          src={data.apps[params.index].url}
          className="h-[39rem] max-h-[80vh] w-[98%] rounded-md"
        ></iframe>
      ) : (
        <div>App not found</div>
      )}
    </Layout>
  );
};

export default App;
