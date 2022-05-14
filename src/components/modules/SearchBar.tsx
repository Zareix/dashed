import { FormEvent, useState } from "react";
import { MdSearch } from "react-icons/md";
import styled from "styled-components";

import googleIcon from "../../images/google_icon.png";

const Wrapper = styled.form`
  display: flex;
  width: clamp(20rem, 30vw, 30rem);
  overflow: hidden;
  border-radius: 100vw;
  padding: 0.25rem 0.5rem;
`;

const SearchBar = () => {
  const [query, setQuery] = useState("test");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    window.location.href = `https://google.fr/search?q=${query}`;
  };

  return (
    <Wrapper
      className="mt-3 bg-white transition-shadow duration-300 focus-within:shadow md:mt-0"
      onSubmit={submit}
    >
      <img src={googleIcon} alt="search icon" className="h-8" />
      <input
        className="h-full w-full outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="mr-1 text-gray-500">
        <MdSearch size={22} />
      </button>
    </Wrapper>
  );
};

export default SearchBar;
