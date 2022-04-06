import { useParams } from "react-router-dom";

import data from "data.json";
import DynamicIcon from "../components/UI/DynamicIcon";
import AppsList from "./apps/AppsList";

type Props = {};

const Category = (props: Props) => {
  const params = useParams();
  const category = data.categories[parseInt(params.catIndex ?? "9999")];

  if (!category) return <div>Category not found</div>;

  return (
    <>
      <h1 className="flex items-center">
        <DynamicIcon {...category} className="mr-2" />
        {category.name}
      </h1>
      <AppsList
        category={category}
        index={parseInt(params.catIndex ?? "9999")}
      />
    </>
  );
};

export default Category;
