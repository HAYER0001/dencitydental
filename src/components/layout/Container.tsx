import type { ElementType, ReactNode } from "react";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export default function Container({ as = "div", className, children }: ContainerProps) {
  const Tag = as;
  return (
    <Tag className={["mx-auto w-full max-w-6xl px-gutter", className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
