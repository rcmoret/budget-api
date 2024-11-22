import { Header } from "@/components/layout/Header";
import { OptionsMenu } from "@/components/layout/OptionsMenu";
import { Provider } from "@/components/layout/Provider";
import { Row } from "@/components/common/Row";

const Layout = ({ children }: { children: any }) => {
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
            <OptionsMenu namespace={children.props.metadata.namespace}/>
            {children}
          </Row>
        </div>
      </div>
    </Provider>
  );
};

export default (page) => <Layout>{page}</Layout>;
