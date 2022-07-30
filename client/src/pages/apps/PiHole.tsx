import { ReactNode, useState } from "react";

import axios from "axios";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiCheck } from "react-icons/fi";
import { RiEarthLine } from "react-icons/ri";
import { ImBlocked } from "react-icons/im";
import { HiOutlineExternalLink } from "react-icons/hi";

import { SimpleCard } from "../../components/ui/Cards";
import { piholeFetchStats } from "../../utils/api";

const FETCH_INTERVAL = 60 * 1000;

type Props = {
  url: string;
  apiKey?: string;
  image: string;
};

export type PiHoleStats = {
  ads_percentage_today: number;
  dns_queries_today: number;
  ads_blocked_today: number;
  status: string;
};

type DurationBtnProps = {
  selectedDuration: number;
  duration: number;
  setDuration: Function;
  children: ReactNode;
  disabled: boolean;
};

const DurationButton = (props: DurationBtnProps) => {
  return (
    <button
      className={`btn btn-sm ${
        props.duration === props.selectedDuration / 60 ? "btn-primary" : ""
      }`}
      onClick={() => props.setDuration(60 * props.duration)}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

const PiHole = (props: Props) => {
  const [duration, setDuration] = useState(5 * 60);
  const client = useQueryClient();

  const disable = async () => {
    if (!props.apiKey) alert("No api token set");
    const res = await axios.post(
      `${props.url}/api.php?disable=${duration}&auth=${props.apiKey}`
    );
    if (!res.data.status) {
      alert("An error occurred, ensure your apiKey is set correctly");
    }
    setTimeout(
      () => client.invalidateQueries(["pihole_stats", props.url]),
      200
    );
  };

  const enable = async () => {
    if (!props.apiKey) alert("No api token set");
    const res = await axios.post(
      `${props.url}/api.php?enable&auth=${props.apiKey}`
    );
    if (!res.data.status) {
      alert("An error occurred, ensure your apiKey is set correctly");
    }
    setTimeout(
      () => client.invalidateQueries(["pihole_stats", props.url]),
      200
    );
  };

  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery(["pihole_stats", props.url], () => piholeFetchStats(props.url), {
    refetchInterval: FETCH_INTERVAL,
  });

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex h-full w-full items-center justify-center">
        Error while loading Pi-Hole
      </div>
    );
  return (
    <>
      <h1 className="flex items-center">
        <img className="icon" src={`/assets/${props.image}`} />
        Pi-Hole
        <a
          href={props.url}
          className="ml-3 text-gray-700 hover:text-gray-600 dark:text-gray-400"
        >
          <HiOutlineExternalLink />
        </a>
      </h1>
      <div className="flex w-full">
        <div className="stats stats-vertical mx-auto shadow lg:stats-horizontal">
          <div className="stat">
            <div>
              <div className="stat-title">Status</div>
              <p className="stat-value capitalize">{stats?.status}</p>
            </div>
            <div className="stat-figure">
              <div
                className={`ml-auto flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b  text-white ${
                  stats?.status === "disabled"
                    ? " from-red-400 to-red-500"
                    : "from-green-400 to-green-500"
                }`}
              >
                {stats?.status === "disabled" ? "!" : <FiCheck size={20} />}
              </div>
            </div>
          </div>
          <div className="stat">
            <div>
              <div className="stat-title">Total queries</div>
              <p className="stat-value">{stats?.dns_queries_today}</p>
            </div>
            <div className="stat-figure">
              <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b from-cyan-400 to-cyan-500 text-white">
                <RiEarthLine size={20} />
              </div>
            </div>
          </div>
          <div className="stat">
            <div>
              <div className="stat-title">Total blocked ads</div>
              <p className="stat-value">{stats?.ads_blocked_today}</p>
            </div>
            <div className="stat-figure">
              <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b from-cyan-400 to-cyan-500 text-white">
                <ImBlocked size={20} />
              </div>
            </div>
          </div>
          <div className="stat">
            <div>
              <div className="stat-title">Blocked ads percentage</div>
              <p className="stat-value">
                {stats?.ads_percentage_today.toLocaleString(
                  window.navigator.language,
                  {
                    maximumFractionDigits: 2,
                  }
                )}
                %
              </p>
            </div>
            <div className="stat-figure">
              <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b from-cyan-400 to-cyan-500 text-white">
                %
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex">
        <SimpleCard className="md:w-3/5 lg:w-1/3">
          <div className="text-xl font-semibold text-gray-600 dark:text-gray-300">
            Disable/Enable
          </div>
          <h3 className="font-semibold text-gray-500 dark:text-gray-400">
            Duration
          </h3>
          <div className="grid grid-cols-5 gap-2 divide-x divide-gray-200">
            <div className="col-span-3 my-2 grid grid-cols-2 gap-2">
              {[5, 15, 30, 60].map((d) => (
                <DurationButton
                  key={d}
                  selectedDuration={duration}
                  duration={d}
                  setDuration={setDuration}
                  disabled={stats?.status === "disabled"}
                >
                  {d}min
                </DurationButton>
              ))}
            </div>
            <div className="col-span-2 flex h-full flex-col justify-center pl-2 text-gray-500 dark:text-gray-400">
              <label htmlFor="duration">Custom :</label>
              <div>
                <input
                  id="duration"
                  type="number"
                  value={duration / 60}
                  className="mr-1 w-2/3 rounded-md border pl-2 dark:border-gray-600 dark:bg-cyan-800 dark:text-gray-300 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
                  onChange={(e) => setDuration(parseInt(e.target.value) * 60)}
                  disabled={stats?.status === "disabled"}
                />
                min
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {stats?.status === "disabled" ? (
              <button className="btn btn-success btn-sm" onClick={enable}>
                Enable
              </button>
            ) : (
              <button className="btn btn-error btn-sm" onClick={disable}>
                Stop
              </button>
            )}
          </div>
        </SimpleCard>
      </div>
    </>
  );
};

export default PiHole;
