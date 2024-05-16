import React from "react";

import { Header } from "@/components/layout/Header";
import { Row } from "@/components/common/Row";

const Layout = ({ children }) => {
  const { namespace } = children.props.metadata;

  return (
    <>
      <Header namespace={namespace} />
      <div className="mb-1 h-5/6 rounded">
        <div className="pt-2 pb-2 pr-3 pl-3 bg-blue-900 w-full rounded h-v90">
          <Row styling={{
            alignItems: "items-start",
            flexWrap: "flex-wrap",
            backgroundColor: "bg-white",
            padding: "pt-1 px-1 pb-2",
            overflow: "overflow-visible",
          }}>
            {children}
          </Row>
        </div>
      </div>
    </>
  );
};


export default (page) => <Layout>{page}</Layout>;
