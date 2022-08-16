import { ChangeEvent, Fragment, useEffect, useState } from "react";

import styled from "styled-components";
import { Combobox } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";

import { fetchAutocompletions } from "../../utils/api";
import { Autocompletion } from "../../models/Autocompletion";
import { useAppDataContext } from "../context/AppDataContext";

type Props = {
  isNewTab?: boolean;
};

export type SearchEngine = {
  name: string;
  url: string;
  emptyQueryUrl: string;
  triggerOn: string;
  icon: string;
};

const Form = styled.form`
  display: flex;
  align-items: center;
  width: clamp(20rem, 30vw, 30rem);
  border-radius: 100vw;
  padding: 0.25rem 0.5rem;
`;

const DEFAULT_SEARCH_ENGINES: SearchEngine[] = [
  {
    name: "google",
    url: "https://google.fr/search?q=",
    emptyQueryUrl: "https://google.fr",
    triggerOn: "g ",
    icon: "/assets/app/searchEngines/google_icon.png",
  },
  {
    name: "youtube",
    url: "https://www.youtube.com/results?search_query=",
    emptyQueryUrl: "https://www.youtube.com/",
    triggerOn: "y ",
    icon: "/assets/app/searchEngines/yt_icon.png",
  },
  {
    name: "bitsearch",
    url: "https://bitsearch.to/search?q=",
    emptyQueryUrl: "https://bitsearch.to",
    triggerOn: "t ",
    icon: "/assets/app/searchEngines/bitsearch_icon.png",
  },
];

const SearchBar = ({ isNewTab }: Props) => {
  const { data } = useAppDataContext();
  const SEARCH_ENGINES = [
    ...DEFAULT_SEARCH_ENGINES,
    ...(data.settings.searchEngine.customs ?? []),
  ];
  const [query, setQuery] = useState("");
  const [searchEngine, setSearchEngine] = useState<SearchEngine>(
    SEARCH_ENGINES.find((x) => x.name === data.settings.searchEngine.default) ??
      SEARCH_ENGINES[0]
  );
  const [oldAutoCompletions, setOldAutoCompletions] = useState<
    Autocompletion[]
  >([]);
  const [history, setHistory] = useState(
    localStorage.getItem("history")?.split("$$$") ?? []
  );
  const { data: autoCompletions } = useQuery(
    ["search_autocomplete", query],
    () => fetchAutocompletions(query),
    {
      placeholderData: oldAutoCompletions,
    }
  );

  useEffect(() => {
    setOldAutoCompletions(autoCompletions ?? []);
  }, [autoCompletions]);

  const submit = (q?: string) => {
    q ??= query;
    const url = q === "" ? searchEngine.emptyQueryUrl : searchEngine.url + q;
    saveHistory(q);
    window.open(url, isNewTab ? "_blank" : "_self")?.focus();
  };

  const saveHistory = (query: string) => {
    const histo = localStorage.getItem("history");
    if (histo) {
      localStorage.setItem("history", histo + "$$$" + query);
    } else {
      localStorage.setItem("history", query);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    for (const se of SEARCH_ENGINES) {
      if (value.startsWith(se.triggerOn)) {
        setSearchEngine(se);
        setQuery(value.slice(2));
        return;
      }
    }
    setQuery(value);
  };

  return (
    <Form
      className="relative mt-3 bg-base-200 transition-shadow duration-300 focus-within:shadow  md:mt-0"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      id="searchInput"
    >
      <button type="submit" className="mr-1 text-gray-500">
        <img
          src={searchEngine.icon}
          alt="search icon"
          className="aspect-square h-8 object-contain"
        />
      </button>
      <Combobox
        value={query}
        onChange={(x) => {
          if (x !== null) {
            setQuery(x);
            submit(x);
          } else {
            setQuery("");
          }
        }}
      >
        <Combobox.Input
          onChange={handleChange}
          className="h-full w-full bg-base-200 outline-none"
          autoComplete="off"
        />
        <Combobox.Options className="absolute top-11 left-0 right-0 z-10 mx-4 overflow-hidden rounded-lg  bg-base-200 py-2 shadow-xl empty:hidden">
          <Combobox.Option key={query} value={query} as={Fragment}>
            {({ active, selected }) => (
              <li
                className={`px-3 py-1 ${
                  active ? "bg-base-300" : "bg-base-200"
                } ${selected ? "font-semibold" : ""}`}
              >
                {query === "" ? `Go to ${searchEngine.name}` : query}
              </li>
            )}
          </Combobox.Option>
          {query !== "" &&
            history
              ?.filter((h) => h.startsWith(query))
              .map(
                (h) =>
                  query !== h && (
                    <Combobox.Option key={h} value={h} as={Fragment}>
                      {({ active, selected }) => (
                        <li
                          className={`px-3 py-1 ${
                            active ? "bg-base-300" : "bg-base-200"
                          } ${selected ? "font-semibold" : ""}`}
                        >
                          {h}
                        </li>
                      )}
                    </Combobox.Option>
                  )
              )}
          {autoCompletions?.map(
            (completion) =>
              query !== completion.phrase && (
                <Combobox.Option
                  key={completion.phrase}
                  value={completion.phrase}
                  as={Fragment}
                >
                  {({ active, selected }) => (
                    <li
                      className={`px-3 py-1 ${
                        active ? "bg-base-300" : "bg-base-200"
                      } ${selected ? "font-semibold" : ""}`}
                    >
                      {completion.phrase}
                    </li>
                  )}
                </Combobox.Option>
              )
          )}
        </Combobox.Options>
      </Combobox>
    </Form>
  );
};

export default SearchBar;
