import { FormEvent, useState } from "react";

import axios from "axios";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import styled from "styled-components";

import { Button } from "../components/ui/Button";

import data from "data.json";

const Wrapper = styled.div`
  .jsoneditor {
    height: 80vh;
  }
`;

const Config = () => {
  const [newData, setNewData] = useState(data);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    axios.post("/api", newData);
  };

  return (
    <Wrapper>
      <h1>Config</h1>
      <form onSubmit={handleSubmit}>
        <Editor
          value={newData}
          allowedModes={["code", "tree"]}
          onChange={(e: any) => setNewData(e)}
        />
        <Button>Save</Button>
      </form>
    </Wrapper>
  );
};

export default Config;
