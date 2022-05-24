import { ChangeEvent, FormEvent, useState } from "react";
import { MdSearch } from "react-icons/md";
import styled from "styled-components";

type Props = {
  isNewTab?: boolean;
};

type SearchEngine = {
  name: string;
  url: string;
  emptyQueryUrl: string;
};

const Wrapper = styled.form`
  display: flex;
  width: clamp(20rem, 30vw, 30rem);
  overflow: hidden;
  border-radius: 100vw;
  padding: 0.25rem 0.5rem;
`;

const SearchBar = ({ isNewTab }: Props) => {
  const [query, setQuery] = useState("");
  const [searchEngine, setSearchEngine] = useState<SearchEngine>({
    name: "google",
    url: "https://google.fr/search?q=",
    emptyQueryUrl: "#",
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    let url = searchEngine.url + query;
    if (query === "") {
      url = searchEngine.emptyQueryUrl;
    }
    if (isNewTab) {
      window.open(url, "_blank")?.focus();
    } else {
      window.open(url, "_self")?.focus();
    }
  };

  const getIcon = () => {
    switch (searchEngine.name.trim().toLowerCase()) {
      case "google":
        return (
          <img
            src="/app/searchEngines/google_icon.png"
            alt="search icon google"
            className="aspect-square h-8 max-w-none object-contain"
          />
        );
      case "youtube":
        return (
          <img
            src="/app/searchEngines/yt_icon.png"
            alt="search icon youtube"
            className="aspect-square h-8 object-contain"
          />
        );
      default:
        return <MdSearch size={24} className="m-1" />;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    switch (true) {
      case value.startsWith("y "):
        setSearchEngine({
          name: "youtube",
          url: "https://www.youtube.com/results?search_query=",
          emptyQueryUrl: "https://www.youtube.com/",
        });
        setQuery(value.slice(2));
        break;
      case value.startsWith("g "):
        setSearchEngine({
          name: "google",
          url: "https://google.fr/search?q=",
          emptyQueryUrl: "#",
        });
        setQuery(value.slice(2));
        break;
      default:
        setQuery(value);
        break;
    }
  };

  return (
    <Wrapper
      className="mt-3 bg-white transition-shadow duration-300 focus-within:shadow dark:bg-slate-700 md:mt-0"
      onSubmit={submit}
    >
      <button type="submit" className="mr-1 text-gray-500">
        {getIcon()}
      </button>
      <input
        className="h-full w-full outline-none dark:bg-slate-700"
        value={query}
        onChange={handleChange}
        id="searchInput"
      />
    </Wrapper>
  );
};

export default SearchBar;
