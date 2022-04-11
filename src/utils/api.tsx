import axios from "axios";
import { SonarrStatus } from "../components/services/Sonarr";

import { PiHoleStats } from "../pages/apps/services/PiHole";

export const piholeFetchStats = async (url: string): Promise<PiHoleStats> => {
  return (await axios.get(`${url}/api.php`)).data;
};

export const sonarrFetchStatus = async (
  url: string,
  apiKey: string | undefined
): Promise<SonarrStatus> => {
  return (await axios.get(`${url}/api/v3/health?apikey=${apiKey}`)).data;
};
