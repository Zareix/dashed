import { FormEvent, useState } from "react";

import axios from "axios";
import { JsonEditor } from "jsoneditor-react";
import styled from "styled-components";
import ace from "brace";
import "brace/mode/json";
import "brace/theme/github";

import { Button } from "../components/ui/Button";

import data from "data.json";

const Wrapper = styled.div`
  .jsoneditor {
    height: 80vh;
    margin-bottom: 1rem;
  }
`;

const Config = () => {
  const [newData, setNewData] = useState(data);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    axios
      .post("/api/config", newData)
      .then((res) => {
        // TODO handle success
      })
      .catch((err) => {
        // TODO handle error
      });
  };

  return (
    <Wrapper>
      <h1>Config</h1>
      <form onSubmit={handleSubmit}>
        <JsonEditor
          value={newData}
          allowedModes={["code", "tree"]}
          onChange={(e: any) => setNewData(e)}
          ace={ace}
          theme="ace/theme/github"
        />
        <Button>Save</Button>
      </form>
    </Wrapper>
  );
};

export default Config;
