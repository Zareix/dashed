import { IconType } from "react-icons";
import * as MaterialDesign from "react-icons/md";

type IProps = {
  icon: string;
  className?: string;
  size?: number;
};

const DynamicIcon = (props: IProps) => {
  // @ts-ignore
  const Icon: IconType = MaterialDesign[props.icon];

  return <Icon {...props} />;
};

export default DynamicIcon;
