import React, { useEffect } from "react";

import { MdSignalWifiConnectedNoInternet0 } from "react-icons/md";
import { useQuery } from "react-query";
import styled, { keyframes } from "styled-components";

import { getApiHealth } from "../../utils/api";
import { useAppDataContext } from "../context/AppDataContext";

const fadeIn = keyframes`
    100% {
        opacity: 1;
    }
`;

const FadeInIcon = styled(MdSignalWifiConnectedNoInternet0)`
  opacity: 0;
  animation: ${fadeIn} 0ms forwards 1s;
`;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  size: number;
}

const IsOffline = (props: Props) => {
  const { data, isLoading } = useQuery(["is_offline"], () => getApiHealth());
  const { size, ...rest } = props;
  const { setIsOffline } = useAppDataContext();

  useEffect(() => {
    setIsOffline(!data?.healthy ?? false);
  }, [data]);

  if (isLoading || !data?.healthy)
    return (
      <div {...rest} title="Offline">
        <FadeInIcon size={size} />
      </div>
    );

  return <></>;
};

export default IsOffline;
