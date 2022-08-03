import { SearchEngine } from "../components/modules/SearchBar";
import { Category } from "./Category";

export type AppData = {
  settings: {
    searchEngine: {
      default: string;
      display: string;
      autofocus: string;
      inApp: boolean;
      customs: SearchEngine[];
    };
  };
  modules: {
    healthCheck: string | string[];
    clock: {
      is24h: boolean;
      showSeconds: boolean;
    };
  };
  links: CustomLink[];
  categories: Category[];
};

type CustomLink = {
  name: string;
  link: string;
  icon: string;
};

export const schema = {
  required: ["categories", "links", "settings"],
  properties: {
    settings: {
      type: "object",
      required: ["searchEngine"],
      properties: {
        searchEngine: {
          type: "object",
          required: ["default", "display", "autofocus", "inApp"],
          properties: {
            default: {
              type: "string",
            },
            display: {
              type: "string",
              enum: ["mobile", "mobile large-screen", "large-screen"],
            },
            autofocus: {
              type: "string",
              enum: ["mobile", "mobile large-screen", "large-screen"],
            },
            inApp: {
              type: "boolean",
            },
            customs: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "url", "emptyQueryUrl", "triggerOn", "icon"],
                properties: {
                  name: { type: "string" },
                  url: { type: "string" },
                  emptyQueryUrl: { type: "string" },
                  triggerOn: { type: "string" },
                  icon: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    modules: {
      type: "object",
      properties: {
        healthCheck: {
          type: "array",
          items: {
            type: "string",
          },
        },
        clock: {
          type: "object",
          properties: {
            is24h: {
              type: "boolean",
            },
            showSeconds: {
              type: "boolean",
            },
          },
        },
      },
    },
    categories: {
      items: {
        required: ["apps", "icon", "name"],
        properties: {
          apps: {
            items: {
              required: ["name", "url"],
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
                  type: ["array", "string"],
                },
                subtitle: {
                  type: "string",
                },
                type: {
                  type: "string",
                  enum: [
                    "pi-hole",
                    "servarr",
                    "sonarr",
                    "radarr",
                    "prowlarr",
                    "portainer",
                    "healthcheck",
                    "ping",
                  ],
                },
                healthCheck: {
                  items: {
                    type: "string",
                  },
                  type: ["array", "string"],
                },
                external: {
                  type: "boolean",
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
          small: {
            type: "boolean",
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
