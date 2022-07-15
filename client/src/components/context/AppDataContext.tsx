import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { useQuery } from "react-query";

import { AppData } from "../../models/AppData";
import { getAppData } from "../../utils/api";
import { LoadingFullScreen } from "../ui/Loading";

type Props = {
  children: ReactNode;
};

const DataContext = createContext<{
  data: AppData;
  setData: (data: AppData) => void;
} | null>(null);

const AppDataProvider = ({ children }: Props) => {
  const { data, isLoading } = useQuery("appData", () => getAppData(), {
    initialData: null,
  });
  const [appData, setAppData] = useState<AppData | null>(
    JSON.parse(localStorage.getItem("appData") ?? "null")
  );

  const setData = (data: AppData) => {
    setAppData(data);
    localStorage.setItem("appData", JSON.stringify(data));
  };

  useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data]);

  if (isLoading) return <LoadingFullScreen />;

  if (!appData)
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <h1 className="text-error">Could not load app data</h1>
        <p>Make sure you're online and the dashed API is accessible</p>
      </div>
    );

  return (
    <DataContext.Provider value={{ data: appData, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useAppDataContext = () => {
  return useContext(DataContext) as {
    data: AppData;
    setData: (data: AppData) => void;
  };
};

export default AppDataProvider;
