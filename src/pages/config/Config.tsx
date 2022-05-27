import { useForm, SubmitHandler } from "react-hook-form";
import styled from "styled-components";

import { Button, ButtonSuccess } from "../../components/ui/Button";

import data from "data.json";
import { saveSettings } from "../../utils/api";
import { Link } from "react-router-dom";

const defaults = {
  default: "google",
  display: "large-screen",
  autofocus: "large-screen",
  inApp: false,
};

type Inputs = {
  display: string;
  default: string;
  autofocus: string;
  inApp: boolean;
};

const FormGroup = styled.div<{ direction?: "column" | "row" }>`
  display: flex;
  flex-direction: ${(props) => props.direction ?? "column"};
  gap: 0.3rem;
  width: clamp(10rem, 32%, 25rem);
  ${(props) => (props.direction === "row" ? "align-items: center;" : "")}
`;

const Config = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: { ...defaults, ...data.settings.searchEngine },
  });

  const submitSearchEngine: SubmitHandler<Inputs> = (d) => {
    console.log({
      ...data,
      settings: { searchEngine: d },
    });
    saveSettings({
      ...data,
      settings: { searchEngine: d },
    });
  };

  return (
    <div>
      <h1 className="flex">
        Config{" "}
        <Button className="ml-auto text-base">
          <Link to="/config/json">Edit JSON</Link>
        </Button>
      </h1>
      <section>
        <h2>Search Engine</h2>
        <form
          className="flex flex-wrap gap-3"
          onSubmit={handleSubmit(submitSearchEngine)}
        >
          <FormGroup>
            <label htmlFor="default">Default : </label>
            <select
              className="rounded-md border border-gray-200 px-2 py-1 shadow-sm transition-all hover:shadow focus:shadow-md focus:outline focus:outline-cyan-400 dark:border-gray-600 dark:bg-slate-700 dark:focus:outline-cyan-600"
              {...register("default", { required: true })}
            >
              <option value="google">Google</option>
              <option value="youtube">Youtube</option>
              <option value="bitsearch">Bitsearch</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label htmlFor="display">Display on : </label>
            <select
              className="rounded-md border border-gray-200 px-2 py-1 shadow-sm transition-all hover:shadow focus:shadow-md focus:outline focus:outline-cyan-400 dark:border-gray-600 dark:bg-slate-700 dark:focus:outline-cyan-600"
              {...register("display", { required: true })}
            >
              <option value="mobile large-screen">All</option>
              <option value="large-screen">Large-screen only</option>
              <option value="mobile">Mobile only</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label htmlFor="autofocus">Auto-focus on : </label>
            <select
              className="rounded-md border border-gray-200 px-2 py-1 shadow-sm transition-all hover:shadow focus:shadow-md focus:outline focus:outline-cyan-400 dark:border-gray-600 dark:bg-slate-700 dark:focus:outline-cyan-600"
              {...register("autofocus", { required: true })}
            >
              <option value="mobile large-screen">All</option>
              <option value="large-screen">Large-screen only</option>
              <option value="mobile">Mobile only</option>
            </select>
          </FormGroup>
          <FormGroup direction="row">
            <label htmlFor="inApp">Show in app : </label>
            <input
              type="checkbox"
              className="shadow-sm transition-all hover:shadow focus:shadow-md focus:outline focus:outline-cyan-400 dark:focus:outline-cyan-600"
              {...register("inApp")}
            />
          </FormGroup>

          <div className="flex w-full">
            <ButtonSuccess className="ml-auto" type="submit">
              Save
            </ButtonSuccess>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Config;
