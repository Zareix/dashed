import { ChangeEvent, FormEvent, useState } from "react";
import { MdSearch } from "react-icons/md";
import styled from "styled-components";

type Props = {
  isNewTab?: boolean;
};

type SearchEngine = {
  name: string;
  url: string;
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
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const url = searchEngine.url + query;
    if (isNewTab) {
      openInNewTab(url);
    } else {
      navigate(url);
    }
  };

  const navigate = (url: string) => {
    window.location.href = url;
  };

  const openInNewTab = (url: string) => {
    window.open(url, "_blank")?.focus();
  };

  const getIcon = () => {
    switch (searchEngine.name.trim().toLowerCase()) {
      case "google":
        return (
          <img
            src="/assets/searchEngines/google_icon.png"
            alt="search icon"
            className="aspect-square h-8 max-w-none"
          />
        );
      case "youtube":
        return (
          <img
            src="/assets/searchEngines/yt_icon.png"
            alt="search icon youtube"
            className="h-8 p-2"
          />
        );
      default:
        return <MdSearch size={24} className="m-1" />;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setSearchEngine({
        name: "google",
        url: "https://google.fr/search?q=",
      });
    }

    switch (true) {
      case value.startsWith("y "):
        setSearchEngine({
          name: "youtube",
          url: "https://www.youtube.com/results?search_query=",
        });
        setQuery(value.slice(2));
        break;
      case value.startsWith("g "):
        setSearchEngine({
          name: "google",
          url: "https://google.fr/search?q=",
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
      className="mt-3 bg-white transition-shadow duration-300 focus-within:shadow md:mt-0"
      onSubmit={submit}
    >
      <button type="submit" className="text-gray-500">
        {getIcon()}
      </button>
      <input
        className="h-full w-full outline-none"
        value={query}
        onChange={handleChange}
        id="searchInput"
      />
    </Wrapper>
  );
};

export default SearchBar;
