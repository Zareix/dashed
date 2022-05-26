import { FormEvent, useState } from "react";

import axios, { AxiosError } from "axios";
import styled, { createGlobalStyle } from "styled-components";
import { JsonEditor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import ace from "brace";
import "brace/mode/json";
import "brace/theme/solarized_dark";
import "brace/theme/github";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "../components/ui/Button";

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

    .jsoneditor-tree {
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

const GlobalStyle = createGlobalStyle`
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
  }
`;

const Config = () => {
  const [newData, setNewData] = useState(data);
  const isDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    axios
      .post("/api/config", newData)
      .then((res) => {
        toast.success(
          () => (
            <div className="text-gray-600 dark:text-gray-200">
              Data json updated successfully
            </div>
          ),
          {
            theme: isDark ? "dark" : "light",
          }
        );
      })
      .catch((err: AxiosError) => {
        toast.error(
          () => (
            <>
              <div className="text-gray-600 dark:text-gray-200">
                An error occured
              </div>
              <div className="text-sm dark:text-gray-400">{err.message}</div>
            </>
          ),
          {
            theme: isDark ? "dark" : "light",
          }
        );
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
          theme={isDark ? "ace/theme/solarized_dark" : "ace/theme/github"}
        />
        <div className="flex justify-end">
          <Button>Save</Button>
        </div>
      </form>
      <GlobalStyle />
      <ToastContainer />
    </Wrapper>
  );
};

export default Config;
