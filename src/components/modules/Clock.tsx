import { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="grid justify-items-end">
      <div className="text-2xl font-bold">{time.toLocaleTimeString()}</div>
      <div>
        {time.toLocaleDateString(undefined, {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </div>
    </div>
  );
};

export default Clock;
