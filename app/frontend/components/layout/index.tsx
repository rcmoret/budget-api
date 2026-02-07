import { Header } from "@/components/layout/header";
import { Provider } from "@/components/layout/Provider";
import { Row } from "@/components/common/Row";

const Layout = ({ children }: { children: any }) => {
  if (children?.props?.metadata?.namespace === "portfolio") {
    return children;
  }
  return (
    <Provider>
      <div className="w-11/12 mx-auto h-dvh">
        <Header
          data={children.props.data}
          metadata={children.props.metadata}
          selectedAccount={children.props.selectedAccount}
        />
        <div className="w-full mx-auto bg-white pb-12">
          <Row
            styling={{
              alignItems: "items-start",
              flexWrap: "flex-wrap",
              overflow: "overflow-visible",
            }}
          >
            {children}
          </Row>
        </div>
      </div>
    </Provider>
  );
};

export default (page: any) => <Layout>{page}</Layout>;
