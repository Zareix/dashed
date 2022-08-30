import { useEffect, useState } from "react";

import { ImEarth } from "react-icons/im";

import DynamicIcon from "./DynamicIcon";

type Props = {
  appName: string;
  icon?: string;
  image?: string;
  iconClassName?: string;
  imgClassName?: string;
  iconSize?: number;
};

const AppIcon = ({
  appName,
  icon,
  image,
  iconClassName = "",
  imgClassName = "",
  iconSize = 18,
}: Props) => {
  const [dashIconError, setDashIconError] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setDashIconError(false);
    setImageError(false);
  }, [appName]);

  if (image && !imageError)
    return (
      <img
        src={`assets/${image}`}
        onError={() => setImageError(true)}
        className={imgClassName}
      />
    );

  if (icon)
    return (
      <div className={iconClassName}>
        <DynamicIcon icon={icon} size={iconSize} />
      </div>
    );

  if (!dashIconError)
    return (
      <img
        src={`https://raw.githubusercontent.com/walkxhub/Dashboard-icons/master/png/${appName
          .replaceAll(" ", "-")
          .toLowerCase()}.png`}
        onError={() => setDashIconError(true)}
        className={imgClassName}
      />
    );

  return <ImEarth size={iconSize} className={iconClassName} />;
};

export default AppIcon;
