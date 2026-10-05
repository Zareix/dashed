import type { WIDGETS } from "~/lib/widgets"

type Props = {
  config: Extract<WIDGETS, { type: "iframe" }>["config"]
}

export const IframeWidget = ({ config }: Props) => {
  return (
    <div
      className="fullscreen overflow-hidden rounded-md border"
      style={{ width: config.width, height: config.height }}
    >
      <iframe
        src={config.url}
        title="Iframe Widget"
        className="h-full w-full border-0"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  )
}
