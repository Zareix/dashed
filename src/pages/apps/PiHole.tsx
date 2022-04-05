import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { FiCheck } from "react-icons/fi";

import Layout from "../../components/Layout";
import { FlexCard } from "../../components/Cards";

type Props = {
  url: string;
  apiKey?: string;
  image: string;
};

type PiHoleStats = {
  ads_percentage_today: number;
  status: string;
};

const PiHole = (props: Props) => {
  const client = useQueryClient();

  const fetchStats = async (): Promise<PiHoleStats> => {
    return (await axios.get(`${props.url}/api.php`)).data;
  };

  const disable = async () => {
    if (!props.apiKey) alert("No api token set");
    const res = await axios.post(
      `${props.url}/api.php?disable=300&auth=${props.apiKey}`
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

  return (
    <Layout imgSrc={`/assets/apps/${props.image}`} title="Pi-Hole">
      <>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
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
                <h2 className="font-semibold text-gray-500">
                  Blocked ads percentage
                </h2>
                <p className="text-xl font-bold text-gray-700">
                  {data?.ads_percentage_today.toLocaleString("fr", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b from-cyan-400 to-cyan-500 text-white">
                %
              </div>
            </FlexCard>
            <FlexCard>
              {data?.status === "disabled" ? (
                <button onClick={enable}>Enable</button>
              ) : (
                <button onClick={disable}>Stop</button>
              )}
            </FlexCard>
          </div>
        )}
      </>
    </Layout>
  );
};

export default PiHole;
