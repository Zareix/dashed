import { FormEvent, useState } from "react";

import styled, { createGlobalStyle } from "styled-components";
import Ajv from "ajv";
import { JsonEditor } from "jsoneditor-react";

import "jsoneditor-react/es/editor.min.css";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "../../components/ui/Button";
import { saveSettings } from "../../utils/api";
import { schema } from "../../models/AppData";

import data from "data.json";

const Wrapper = styled.div`
  .jsoneditor {
    height: 80vh;
    margin-bottom: 1rem;
    border-radius: 10px;
    overflow: hidden;
  }

  @media (prefers-color-scheme: dark) {
    .jsoneditor {
      border: thin solid #1e3a8a;
    }

    .jsoneditor-menu {
      background-color: #1e3a8a;
      border-bottom: 1px solid #1e3a8a;
    }

    .jsoneditor-statusbar {
      background-color: #1e293b;
      color: #f1f5f9;
      border-top: 1px solid #334155;
    }

    .jsoneditor-tree,
    textarea.jsoneditor-text,
    select {
      background-color: #002b36;
      color: #93a1a1;
    }

    div.jsoneditor-readonly {
      color: #cbd5e1;
    }

    div.jsoneditor-field,
    div.jsoneditor-value,
    div.jsoneditor td,
    div.jsoneditor th,
    div.jsoneditor textarea,
    pre.jsoneditor-preview,
    .jsoneditor-schema-error,
    .jsoneditor-popover {
      color: #f1f5f9;
    }

    div.jsoneditor-field[contenteditable="true"]:focus,
    div.jsoneditor-field[contenteditable="true"]:hover,
    div.jsoneditor-value[contenteditable="true"]:focus,
    div.jsoneditor-value[contenteditable="true"]:hover,
    div.jsoneditor-field.jsoneditor-highlight,
    div.jsoneditor-value.jsoneditor-highlight {
      background-color: #334155;
      border: 1px solid #1e40af;
    }

    .jsoneditor-navigation-bar {
      background-color: #334155;
      color: #f1f5f9;
      border: 1px solid #1e40af;
    }

    .jsoneditor-frame,
    .jsoneditor-search input {
      background-color: #334155;
      color: #f1f5f9;
    }

    tr.jsoneditor-highlight,
    tr.jsoneditor-selected {
      background-color: #334155;
    }
  }
`;

export const JsonEditorStyle = createGlobalStyle`
  @media (prefers-color-scheme: dark){
    .pico-modal-header {
      background-color: #1e3a8a!important;
      color: #f1f5f9!important;
    }

    .jsoneditor-modal table th, .jsoneditor-modal table td {
      color: #f1f5f9!important;
    }
    
    .pico-content.jsoneditor-modal {
      border-radius: 14px!important;
      background-color: #002b36!important;
      color: #93a1a1!important;

      textarea, input, select {
        background-color: #1e293b!important;
        color: #f8fafc!important;
        border: 1px solid #334155!important;
      }
    }

    .jsoneditor .jsoneditor-text-errors tr {
      background-color: #dc2626;
    }

    .jsoneditor .jsoneditor-text-errors {
      border-top: none;
    }

    .jsoneditor-contextmenu .jsoneditor-text {
      color: #f3f4f6;
    }

    .jsoneditor-contextmenu .jsoneditor-menu button:hover, .jsoneditor-contextmenu .jsoneditor-menu button:focus {
      color : #333;
      background-color: #1e40af;
    }
  }
`;

const Config = () => {
  const [newData, setNewData] = useState(data);
  const ajv = new Ajv({ allErrors: true, verbose: true });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    saveSettings(newData);
  };

  return (
    <Wrapper>
      <h1>Config</h1>
      <form onSubmit={handleSubmit}>
        <JsonEditor
          value={newData}
          allowedModes={["code", "tree"]}
          onChange={(e: any) => setNewData(e)}
          ajv={ajv}
          schema={schema}
        />
        <div className="flex justify-end">
          <button className="btn btn-primary btn-sm">Save</button>
        </div>
      </form>
      <JsonEditorStyle />
    </Wrapper>
  );
};

export default Config;
