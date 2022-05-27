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
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [autoImageUrl, setAutoImageUrl] = useState("");

  useEffect(() => {
    setError(false);
    setAutoImageUrl(
      `https://raw.githubusercontent.com/walkxhub/dashboard-icons/master/png/${appName
        .replaceAll(" ", "-")
        .toLowerCase()}.png`
    );
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

  if (error) return <ImEarth size={iconSize} className={iconClassName} />;

  return (
    <img
      src={autoImageUrl}
      onError={() => setError(true)}
      className={imgClassName}
    />
  );
};

export default AppIcon;
