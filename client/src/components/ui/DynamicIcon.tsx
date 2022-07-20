import { IconType } from "react-icons";
import * as MaterialDesign from "react-icons/md";
import { ImEarth } from "react-icons/im";

type IProps = {
  icon: string;
  className?: string;
  size?: number;
};

const DynamicIcon = (props: IProps) => {
  // @ts-ignore
  const Icon: IconType = MaterialDesign[props.icon];

  if (Icon) return <Icon {...props} />;
  return <ImEarth {...props} />;
};

export default DynamicIcon;
