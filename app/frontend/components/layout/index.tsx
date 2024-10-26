import { Header } from "@/components/layout/Header";
import { OptionsMenu } from "@/components/layout/OptionsMenu";
import { Provider } from "@/components/layout/Provider";
import { Row } from "@/components/common/Row";

const Layout = ({ children }: { children: any }) => {
  return (
    <Provider>
      <div className="bg-slate-400 w-11/12 mx-auto h-dvh">
        <Header
          data={children.props.data}
          metadata={children.props.metadata}
          selectedAccount={children.props.selectedAccount}
        />
        <div className="px-3 w-full sm:w-[98.5%] rounded bg-slate-100 mx-auto">
          <Row
            styling={{
              alignItems: "items-start",
              flexWrap: "flex-wrap",
              padding: "pt-1 px-1 pb-2",
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
