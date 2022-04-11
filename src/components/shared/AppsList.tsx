import { RiFullscreenFill } from "react-icons/ri";
import { Link } from "react-router-dom";

import Service from "../services/Service";
import ServiceDetails from "../services/ServiceDetails";
import { Button } from "../ui/Button";
import { FlexCard } from "../ui/Cards";

type Props = {
  category: {
    apps: {
      url: string;
      image: string;
      name: string;
    }[];
  };
  index: number;
};

const AppsList = (props: Props) => {
  return (
    <ul className="grid grid-cols-4 gap-3">
      {props.category.apps.map((app, j) => (
        <li className="group relative" key={j}>
          <Button
            as={Link}
            to={`/categories/${props.index}/apps/${j}`}
            className="absolute top-1/2 right-2 mr-3 w-0 -translate-y-1/2
                          overflow-hidden px-0 py-2 group-hover:w-9
                          group-hover:px-2"
          >
            <RiFullscreenFill size={20} />
          </Button>
          <a href={app.url}>
            <FlexCard className="!justify-start transition-shadow group-hover:shadow-lg">
              <img className="icon" src={`/assets/${app.image}`} />
              <div className="ml-2">
                <h2 className="-mb-1 text-lg">{app.name}</h2>
                <p className="text-sm text-gray-500">
                  <ServiceDetails app={app} />
                </p>
              </div>
              <div className="ml-auto mr-4">
                <Service app={app} />
              </div>
            </FlexCard>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default AppsList;
