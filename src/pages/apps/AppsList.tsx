import { RiFullscreenFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { FlexCard } from "../../components/ui/Cards";

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
          <Link
            to={`/categories/${props.index}/apps/${j}`}
            className="absolute top-1/2 right-2 mr-3 w-0
                          -translate-y-1/2 overflow-hidden  rounded-md bg-white bg-opacity-40 py-2
                          backdrop-blur transition-all duration-200 hover:bg-cyan-200 hover:bg-opacity-40
                          group-hover:w-9 group-hover:px-2 dark:hover:bg-cyan-400 dark:hover:bg-opacity-60"
          >
            <RiFullscreenFill size={20} />
          </Link>
          <a href={app.url}>
            <FlexCard className="!justify-start transition-shadow group-hover:shadow-lg">
              <img className="icon" src={`/assets/${app.image}`} />
              <h2 className="ml-2 text-lg">{app.name}</h2>
            </FlexCard>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default AppsList;
