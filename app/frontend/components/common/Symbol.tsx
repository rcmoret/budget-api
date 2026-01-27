import React from "react";

const Point = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-row gap-2">
    <div>&#8226;</div>
    <div>{children}</div>
  </div>
);

export { Point };
