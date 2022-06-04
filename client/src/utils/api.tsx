import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

import {
  PortainerContainer,
  PortainerEndpoint,
} from "../components/modules/services/Portainer";
import {
  ServarrV3Activity,
  ServarrV3Status,
} from "../components/modules/services/Servarr";
import { AppData } from "../models/AppData";
import { Health } from "../models/Health";

import { PiHoleStats } from "../pages/apps/PiHole";

const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:3001/api";

// --- Api Health ---
export const getApiHealth = async (): Promise<Health> => {
  return (await axios.get(API_URL)).data;
};

// --- Settings ---
export const saveSettings = (data: AppData): void => {
  const isDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  axios
    .post(`${API_URL}/config`, data)
    .then((res) => {
      toast.success(
        () => (
          <div className="text-gray-600 dark:text-gray-200">
            Data json updated successfully
          </div>
        ),
        {
          theme: isDark ? "dark" : "light",
        }
      );
    })
    .catch((err: AxiosError<{ message: string }>) => {
      toast.error(
        () => (
          <>
            <div className="text-gray-600 dark:text-gray-200">
              An error occured
            </div>
            <div className="text-sm dark:text-gray-400">
              {err.response?.data.message ?? err.message}
            </div>
          </>
        ),
        {
          theme: isDark ? "dark" : "light",
        }
      );
    });
};

// --- Pi-Hole ---
export const piholeFetchStats = async (url: string): Promise<PiHoleStats> => {
  return (await axios.get(`${url}/api.php`)).data;
};

// --- Servarr ---
export const servarrFetchStatus = async (
  url: string,
  apiKey: string | undefined,
  apiVersion: number
): Promise<ServarrV3Status[]> => {
  return (await axios.get(`${url}/api/v${apiVersion}/health?apikey=${apiKey}`))
    .data;
};

export const servarrFetchActivity = async (
  url: string,
  apiKey: string | undefined,
  apiVersion: number
): Promise<ServarrV3Activity> => {
  return (
    await axios.get(
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
