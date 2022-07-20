import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from "axios";

import {
  PortainerContainer,
  PortainerEndpoint,
} from "../components/modules/services/Portainer";
import {
  ServarrV3Activity,
  ServarrV3Status,
} from "../components/modules/services/Servarr";
import { AppData } from "../models/AppData";
import { Autocompletion } from "../models/Autocompletion";
import { Health } from "../models/Health";
import { HealthCheckIO } from "../models/HealthCheckIO";

import { PiHoleStats } from "../pages/apps/PiHole";

const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:3001/api";

// --- App data ---
export const getAppData = async (): Promise<AppData> => {
  return (await axios.get<AppData>(`${API_URL}/data`)).data;
};

// --- Api Health ---
export const getApiHealth = async (): Promise<Health> => {
  return (await axios.get<Health>(`${API_URL}/health`)).data;
};

// --- Settings ---
export const saveSettings = (
  data: AppData
): Promise<AxiosResponse<{ message: string }>> => {
  return axios.post(`${API_URL}/config`, data);
};

// --- Pi-Hole ---
export const piholeFetchStats = async (url: string): Promise<PiHoleStats> => {
  return (await axios.get<PiHoleStats>(`${url}/api.php`)).data;
};

// --- Servarr ---
export const servarrFetchStatus = async (
  url: string,
  apiKey: string | undefined,
  apiVersion: number
): Promise<ServarrV3Status[]> => {
  return (
    await axios.get<ServarrV3Status[]>(
      `${url}/api/v${apiVersion}/health?apikey=${apiKey}`
    )
  ).data;
};

export const servarrFetchActivity = async (
  url: string,
  apiKey: string | undefined,
  apiVersion: number
): Promise<ServarrV3Activity> => {
  return (
    await axios.get<ServarrV3Activity>(
      `${url}/api/v${apiVersion}/queue?apikey=${apiKey}&includeUnknownMovieItems=true`
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
    await axios.get<PortainerEndpoint[]>(`${url}/api/endpoints`, {
      headers: {
        "X-Api-Key": apiKey,
      },
    })
  ).data;
};

// TODO Check type : not sur it's a 'const reqs: Promise<PortainerContainer[]>[]'
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

// --- Autocompletion ---
export const fetchAutocompletions = async (
  query: string
): Promise<Autocompletion[]> => {
  if (!query || query === "") return [];
  return (
    await axios.get<Autocompletion[]>(`${API_URL}/autocomplete?query=${query}`)
  ).data;
};

// --- HealthChecks.io ---
export const fetchHealthCheck = async (src: string): Promise<HealthCheckIO> => {
  return (await axios.get<HealthCheckIO>(src)).data;
};

// --- Ping ---
export const ping = async (
  url: string,
  headers: AxiosRequestHeaders | undefined
): Promise<number | undefined> => {
  try {
    console.log(headers);

    const res = await axios.get(url, {
      timeout: 1000,
      headers,
    });
    return res.status;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.status;
    }
  }
  return 0;
};
