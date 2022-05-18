import { ReactNode, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { FiCheck } from "react-icons/fi";
import { RiEarthLine } from "react-icons/ri";
import { ImBlocked } from "react-icons/im";
import { HiOutlineExternalLink } from "react-icons/hi";

import { FlexCard, SimpleCard } from "../../components/ui/Cards";
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
      className={`rounded-lg px-2 py-1 text-gray-50 shadow transition-all hover:shadow-md disabled:bg-gray-200 disabled:shadow dark:disabled:bg-gray-700 dark:disabled:text-gray-500 ${
        props.duration === props.selectedDuration / 60
          ? "bg-cyan-600"
          : "bg-cyan-400 dark:bg-cyan-800"
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
    client.invalidateQueries("pihole_stats");
  };

  const enable = async () => {
    if (!props.apiKey) alert("No api token set");
    const res = await axios.post(
      `${props.url}/api.php?enable&auth=${props.apiKey}`
    );
    if (!res.data.status) {
      alert("An error occurred, ensure your apiKey is set correctly");
    }
    client.invalidateQueries("pihole_stats");
  };

  const { data: stats, isLoading } = useQuery(
    ["pihole_stats", props.url],
    () => piholeFetchStats(props.url),
    {
      refetchInterval: FETCH_INTERVAL,
    }
  );

  if (isLoading) return <div>Loading...</div>;
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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <FlexCard>
          <div>
            <h2 className="font-semibold text-gray-500 dark:text-gray-500">
              Status
            </h2>
            <p className="text-xl font-bold capitalize text-gray-700 dark:text-gray-300">
              {stats?.status}
            </p>
          </div>
          <div
            className={`ml-auto flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b  text-white ${
              stats?.status === "disabled"
                ? " from-red-400 to-red-500"
                : "from-green-400 to-green-500"
            }`}
          >
            {stats?.status === "disabled" ? "!" : <FiCheck size={20} />}
          </div>
        </FlexCard>
        <FlexCard>
          <div>
            <h2 className="font-semibold text-gray-500 dark:text-gray-500">
              Total queries
            </h2>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
              {stats?.dns_queries_today}
            </p>
          </div>
          <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b from-cyan-400 to-cyan-500 text-white">
            <RiEarthLine size={20} />
          </div>
        </FlexCard>
        <FlexCard>
          <div>
            <h2 className="font-semibold text-gray-500 dark:text-gray-500">
              Total blocked ads
            </h2>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
              {stats?.ads_blocked_today}
            </p>
          </div>
          <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b from-cyan-400 to-cyan-500 text-white">
            <ImBlocked size={20} />
          </div>
        </FlexCard>
        <FlexCard>
          <div>
            <h2 className="font-semibold text-gray-500 dark:text-gray-500">
              Blocked ads percentage
            </h2>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
              {stats?.ads_percentage_today.toLocaleString(
                window.navigator.language,
                {
                  maximumFractionDigits: 2,
                }
              )}
              %
            </p>
          </div>
          <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b from-cyan-400 to-cyan-500 text-white">
            %
          </div>
        </FlexCard>
      </div>
      <div className="mt-4 flex">
        <SimpleCard className="md:w-3/5 lg:w-1/3">
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
            Disable/Enable
          </h2>
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
              <button
                className="rounded-lg bg-green-500 px-2 py-1 text-gray-50 shadow hover:shadow-md"
                onClick={enable}
              >
                Enable
              </button>
            ) : (
              <button
                className="rounded-lg bg-red-500 px-2 py-1 text-gray-50 shadow hover:shadow-md"
                onClick={disable}
              >
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
