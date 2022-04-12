import axios from "axios";
import {
  ServarrV3Activity,
  ServarrV3Status,
} from "../components/services/ServarrV3";

import { PiHoleStats } from "../pages/apps/PiHole";

// --- Pi-Hole ---
export const piholeFetchStats = async (url: string): Promise<PiHoleStats> => {
  return (await axios.get(`${url}/api.php`)).data;
};

// --- Servarr ---

export const sonarrFetchStatus = async (
  url: string,
  apiKey: string | undefined
): Promise<ServarrV3Status[]> => {
  return (await axios.get(`${url}/api/v3/health?apikey=${apiKey}`)).data;
};

export const sonarrFetchActivity = async (
  url: string,
  apiKey: string | undefined
): Promise<ServarrV3Activity> => {
  return (
    await axios.get(
      `${url}/api/v3/queue?apikey=${apiKey}&includeUnknownMovieItems=true`
    )
  ).data;
};
