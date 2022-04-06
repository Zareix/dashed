import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { FiCheck } from "react-icons/fi";
import { RiEarthLine } from "react-icons/ri";
import { ImBlocked } from "react-icons/im";

import { FlexCard, SimpleCard } from "../../components/Cards";
import { useState } from "react";

type Props = {
  url: string;
  apiKey?: string;
  image: string;
};

type PiHoleStats = {
  ads_percentage_today: number;
  dns_queries_today: number;
  ads_blocked_today: number;
  status: string;
};

const PiHole = (props: Props) => {
  const [duration, setDuration] = useState(60);
  const client = useQueryClient();

  const fetchStats = async (): Promise<PiHoleStats> => {
    return (await axios.get(`${props.url}/api.php`)).data;
  };

  const disable = async () => {
    if (!props.apiKey) alert("No api token set");
    const res = await axios.post(
      `${props.url}/api.php?disable=${duration}&auth=${props.apiKey}`
    );
    client.invalidateQueries("pihole_stats");
  };

  const enable = async () => {
    if (!props.apiKey) alert("No api token set");
    const res = await axios.post(
      `${props.url}/api.php?enable&auth=${props.apiKey}`
    );
    client.invalidateQueries("pihole_stats");
  };

  const { data, isLoading } = useQuery("pihole_stats", fetchStats);

  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      <h1>Pi-Hole</h1>
      <div className="grid grid-cols-4 gap-4">
        <FlexCard>
          <div>
            <h2 className="font-semibold text-gray-500">Status</h2>
            <p className="text-xl font-bold capitalize text-gray-700">
              {data?.status}
            </p>
          </div>
          <div
            className={`ml-auto flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b  text-white ${
              data?.status === "disabled"
                ? " from-red-400 to-red-500"
                : "from-green-400 to-green-500"
            }`}
          >
            {data?.status === "disabled" ? "!" : <FiCheck size={20} />}
          </div>
        </FlexCard>
        <FlexCard>
          <div>
            <h2 className="font-semibold text-gray-500">Total queries</h2>
            <p className="text-xl font-bold text-gray-700">
              {data?.dns_queries_today}
            </p>
          </div>
          <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b from-cyan-400 to-cyan-500 text-white">
            <RiEarthLine size={20} />
          </div>
        </FlexCard>
        <FlexCard>
          <div>
            <h2 className="font-semibold text-gray-500">Total blocked ads</h2>
            <p className="text-xl font-bold text-gray-700">
              {data?.ads_blocked_today}
            </p>
          </div>
          <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b from-cyan-400 to-cyan-500 text-white">
            <ImBlocked size={20} />
          </div>
        </FlexCard>
        <FlexCard>
          <div>
            <h2 className="font-semibold text-gray-500">
              Blocked ads percentage
            </h2>
            <p className="text-xl font-bold text-gray-700">
              {data?.ads_percentage_today.toLocaleString("fr", {
                maximumFractionDigits: 2,
              })}
              %
            </p>
          </div>
          <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b from-cyan-400 to-cyan-500 text-white">
            %
          </div>
        </FlexCard>
        <SimpleCard>
          <div className="mr-2">
            Duration :
            <div className=" flex gap-2">
              <button
                className={`rounded-lg px-2 py-1 shadow transition-all hover:shadow-md ${
                  duration === 60 * 5
                    ? "bg-cyan-400 text-gray-50"
                    : "bg-cyan-200"
                }`}
                onClick={() => setDuration(60 * 5)}
              >
                5min
              </button>
              <button
                className={`rounded-lg px-2 py-1 shadow transition-all hover:shadow-md ${
                  duration === 60 * 15
                    ? "bg-cyan-400 text-gray-50"
                    : "bg-cyan-200"
                }`}
                onClick={() => setDuration(60 * 15)}
              >
                15min
              </button>
              <button
                className={`rounded-lg px-2 py-1 shadow transition-all hover:shadow-md ${
                  duration === 60 * 60
                    ? "bg-cyan-400 text-gray-50"
                    : "bg-cyan-200"
                }`}
                onClick={() => setDuration(60 * 60)}
              >
                60min
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {data?.status === "disabled" ? (
              <button
                className="rounded-lg bg-green-500 px-2 py-1 text-gray-50 shadow hover:shadow-md"
                onClick={enable}
              >
                Enable
              </button>
            ) : (
              <button
                className=" rounded-lg bg-red-500 px-2 py-1 text-gray-50 shadow hover:shadow-md"
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
