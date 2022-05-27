import { FormEvent, useState } from "react";

import axios, { AxiosError } from "axios";
import styled, { createGlobalStyle } from "styled-components";
import Ajv from "ajv";
import { JsonEditor } from "jsoneditor-react";
import { ToastContainer, toast } from "react-toastify";

import "jsoneditor-react/es/editor.min.css";
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

    .jsoneditor-tree,
    textarea.jsoneditor-text {
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
  }
`;

const schema = {
  required: ["categories", "links"],
  properties: {
    categories: {
      items: {
        required: ["apps", "icon", "name"],
        properties: {
          apps: {
            items: {
              required: ["name", "image", "url"],
              properties: {
                name: {
                  type: "string",
                },
                url: {
                  type: "string",
                },
                image: {
                  type: "string",
                },
                apiKey: {
                  type: "string",
                },
                customLinks: {
                  items: {
                    required: ["name", "path"],
                    properties: {
                      icon: {
                        type: "string",
                      },
                      name: {
                        type: "string",
                      },
                      path: {
                        type: "string",
                      },
                    },
                    type: "object",
                  },
                  type: "array",
                },
                endpoint: {
                  type: "string",
                },
                endpoints: {
                  items: {
                    type: "string",
                  },
                  type: "array",
                },
                subtitle: {
                  type: "string",
                },
                type: {
                  type: "string",
                },
              },
              type: "object",
            },
            type: "array",
          },
          icon: {
            type: "string",
          },
          name: {
            type: "string",
          },
        },
        type: "object",
      },
      type: "array",
    },
    links: {
      items: {
        required: ["icon", "link", "name"],
        properties: {
          icon: {
            type: "string",
          },
          link: {
            type: "string",
          },
          name: {
            type: "string",
          },
        },
        type: "object",
      },
      type: "array",
    },
  },
  type: "object",
};

const Config = () => {
  const [newData, setNewData] = useState(data);
  const isDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const ajv = new Ajv({ allErrors: true, verbose: true });

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
          ajv={ajv}
          schema={schema}
        />
        <div className="flex justify-end">
          <Button>Save</Button>
        </div>
      </form>
      <JsonEditorStyle />
      <ToastContainer />
    </Wrapper>
  );
};

export default Config;
