import mermaid from "mermaid";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCodeString } from "rehype-rewrite";

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);
export const Code = ({ inline, children = [], className, ...props }) => {
  const demoid = useRef(`dome${randomid()}`);
  const [container, setContainer] = useState(null);
  console.log({
    className,
    children,
  });

  const isMermaid =
    className && /^language-mermaid/.test(className.toLocaleLowerCase());
  const code = children
    ? getCodeString(props.node.children)
    : children[0] || "";

  useEffect(() => {
    if (container && isMermaid && demoid.current && code) {
      mermaid
        .render(demoid.current, code)
        .then(({ svg, bindFunctions }) => {
          container.innerHTML = svg;
          if (bindFunctions) {
            bindFunctions(container);
          }
        })
        .catch((error) => {
          console.log("error:", error);
        });
    }
  }, [container, isMermaid, code, demoid]);

  const refElement = useCallback((node) => {
    if (node !== null) {
      setContainer(node);
    }
  }, []);

  if (isMermaid) {
    return (
      <>
        <code id={demoid.current} style={{ display: "none" }} />
        <code className={className} ref={refElement} data-name="mermaid" />
      </>
    );
  }

  const isAlert = (className as string)?.startsWith("language-alert")

  if (!className) {
    return (
        <span className="border p-1 rounded-lg bg-slate-200">{children}</span>
    )
  }

  if (isAlert) {
    return (
      <div className="bg-yellow-200 rounded px-5 py-3 text-center text-lg font-bold" dir="ltr">
        <span className={className}>{children}</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-200 rounded px-5 py-3 text-left" dir="ltr">
      <code className={className}>{children}</code>
    </div>
  );
};
