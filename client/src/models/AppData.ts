import { Category } from "./Category";

export type AppData = {
  settings: {
    searchEngine: {
      default: string;
      display: string;
      autofocus: string;
      inApp: boolean;
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
              enum: ["google", "youtube", "bitsearch"],
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
