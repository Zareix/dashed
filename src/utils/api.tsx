import axios from "axios";
import {
  PortainerContainer,
  PortainerEndpoint,
} from "../components/services/Portainer";
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

// --- Portainer ---

export const portainerFetchEndpoints = async (
  url: string,
  apiKey: string | undefined
): Promise<PortainerEndpoint[]> => {
  if (!apiKey) throw new Error("No API Key set");

  return (
    await axios.get(`${url}/api/endpoints`, {
      headers: {
        "X-Api-Key": apiKey,
      },
    })
  ).data;
};

export const portainerFetchContainers = async (
  url: string,
  apiKey: string | undefined,
  allEndpoints?: PortainerEndpoint[],
  appEndpoints?: string[]
): Promise<PortainerContainer[][]> => {
  if (!apiKey) throw new Error("No API Key set");

  const reqs: Promise<PortainerContainer[]>[] = [];
  for (const endpoint of allEndpoints ?? []) {
    if (appEndpoints && !appEndpoints.includes(endpoint.Name)) continue;
    reqs.push(
      (
        await axios.get(
          `${url}/api/endpoints/${endpoint.Id}/docker/containers/json?all=1`,
          {
            headers: {
              "X-Api-Key": apiKey,
            },
          }
        )
      ).data
    );
    if (reqs.length === 0) throw new Error("No corresponding endpoint");
  }
  return Promise.all(reqs);
};
