import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from "react";

import styled from "styled-components";
import { Combobox } from "@headlessui/react";
import { useQuery } from "react-query";

import data from "data.json";

import { fetchAutocompletions } from "../../utils/api";
import { Autocompletion } from "../../models/Autocompletion";

type Props = {
  isNewTab?: boolean;
};

type SearchEngine = {
  name: string;
  url: string;
  emptyQueryUrl: string;
  triggerOn: string;
  icon: JSX.Element;
};

const Form = styled.form`
  display: flex;
  align-items: center;
  width: clamp(20rem, 30vw, 30rem);
  border-radius: 100vw;
  padding: 0.25rem 0.5rem;
`;

const SEARCH_ENGINES: SearchEngine[] = [
  {
    name: "google",
    url: "https://google.fr/search?q=",
    emptyQueryUrl: "https://google.fr",
    triggerOn: "g ",
    icon: (
      <img
        src="/app/searchEngines/google_icon.png"
        alt="search icon google"
        className="aspect-square h-8 max-w-none object-contain"
      />
    ),
  },
  {
    name: "youtube",
    url: "https://www.youtube.com/results?search_query=",
    emptyQueryUrl: "https://www.youtube.com/",
    triggerOn: "y ",
    icon: (
      <img
        src="/app/searchEngines/yt_icon.png"
        alt="search icon youtube"
        className="aspect-square h-8 object-contain"
      />
    ),
  },
  {
    name: "bitsearch",
    url: "https://bitsearch.to/search?q=",
    emptyQueryUrl: "https://bitsearch.to",
    triggerOn: "t ",
    icon: (
      <img
        src="/app/searchEngines/bitsearch_icon.png"
        alt="search icon bitsearch"
        className="aspect-square h-8 object-contain"
      />
    ),
  },
];

const SearchBar = ({ isNewTab }: Props) => {
  const [query, setQuery] = useState("");
  const [searchEngine, setSearchEngine] = useState<SearchEngine>(
    SEARCH_ENGINES.find((x) => x.name === data.settings.searchEngine.default) ??
      SEARCH_ENGINES[0]
  );
  const [oldAutoCompletions, setOldAutoCompletions] = useState<
    Autocompletion[]
  >([]);
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
    window.open(url, isNewTab ? "_blank" : "_self")?.focus();
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
      className="relative mt-3 bg-white transition-shadow duration-300 focus-within:shadow dark:bg-slate-700 md:mt-0"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      id="searchInput"
    >
      <button type="submit" className="mr-1 text-gray-500">
        {searchEngine.icon}
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
          className="h-full w-full outline-none dark:bg-slate-700"
          autoComplete="off"
        />
        <Combobox.Options className="absolute top-11 left-0 right-0 z-10 mx-4 overflow-hidden rounded-lg bg-white py-2 shadow-xl empty:hidden dark:bg-slate-700">
          <Combobox.Option key={query} value={query} as={Fragment}>
            {({ active, selected }) => (
              <li
                className={`px-3 py-1 ${
                  active
                    ? "bg-slate-200 dark:bg-slate-500"
                    : "bg-white dark:bg-slate-700"
                } ${selected ? "font-semibold" : ""}`}
              >
                {query === "" ? `Go to ${searchEngine.name}` : query}
              </li>
            )}
          </Combobox.Option>
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
                        active
                          ? "bg-slate-200 dark:bg-slate-500"
                          : "bg-white dark:bg-slate-700"
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
