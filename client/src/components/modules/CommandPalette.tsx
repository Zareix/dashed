import { ReactNode } from "react";

import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
  Action,
} from "kbar";

import data from "data.json";
import Service from "./Service";

const defaultActions: Action[] = [];

type Props = {
  children?: ReactNode;
};

const CommandPalette = ({ children }: Props) => {
  return (
    <KBarProvider actions={defaultActions}>
      <KBarPortal>
        <KBarPositioner className="z-50 bg-gray-800 bg-opacity-30 backdrop-blur-[3px] dark:bg-gray-900 dark:bg-opacity-40">
          <KBarAnimator className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800">
            <div className="flex pt-4 pb-4">
              <KBarSearch
                className="mx-auto w-1/2 rounded-md bg-gray-200 px-2 py-1 dark:bg-slate-700"
                defaultPlaceholder="Search an app or link"
              />
            </div>
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
};

const RenderResults = () => {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        if (typeof item === "string") {
          return (
            <div className="px-4 pt-2 pb-1 text-gray-500 dark:text-slate-400">
              {item}
            </div>
          );
        }

        const s = item.id.split("/");
        const app =
          s.length === 2
            ? data.categories[parseInt(s[0])].apps[parseInt(s[1])]
            : null;

        return (
          <div
            className={`flex items-center px-4 py-2 ${
              active
                ? "border-l-2 border-gray-800 bg-gray-100 bg-opacity-80 dark:border-slate-300 dark:bg-slate-600"
                : ""
            }`}
          >
            {item.icon && item.icon}
            <div className={`${active ? "font-bold" : ""}`}>{item.name}</div>
            {app && (
              <div className="discret ml-2">
                <Service app={app} />
              </div>
            )}
            {item.subtitle && (
              <div className="ml-auto mr-2 text-gray-300 dark:text-slate-500">
                {item.subtitle}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default CommandPalette;
