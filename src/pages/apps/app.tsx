import { useParams } from "@reach/router";

import data from "../../../assets/data.json";

import Layout from "../../components/Layout";
import PiHole from "./PiHole";

type Props = {
  path: string;
};

const App = (props: Props) => {
  const params = useParams();
  const app = data.apps[params.index];

  if (!app)
    return (
      <Layout title="">
        <div>App not found</div>
      </Layout>
    );

  switch (app.type?.toLowerCase()) {
    case "pi-hole":
      return <PiHole url={app.url} apiKey={app.apiKey} image={app.image} />;

    default:
      return (
        <Layout
          title={app ? app.name : ""}
          imgSrc={app ? "/assets/apps/" + app.image : ""}
        >
          <iframe
            src={app.url}
            className="h-[39rem] max-h-[80vh] w-[98%] rounded-md border-2"
          ></iframe>
        </Layout>
      );
  }
};

export default App;
