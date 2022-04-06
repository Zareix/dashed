import { useParams } from "react-router-dom";
import data from "../../../public/data.json";

import PiHole from "./PiHole";

const App = () => {
  const params = useParams();
  const app = data.apps[parseInt(params.index ?? "9999")];

  if (!app) return <div>App not found</div>;

  switch (app.type?.toLowerCase()) {
    case "pi-hole":
      return <PiHole {...app} />;

    default:
      return (
        <>
          <h1>{app.name}</h1>
          <iframe
            src={app.url}
            className="h-[39rem] max-h-[80vh] w-[98%] rounded-md border-2"
          ></iframe>
        </>
      );
  }
};

export default App;
