import { Header } from "@/components/layout/Header";
import { Row } from "@/components/common/Row";
import { Provider } from "@/components/layout/Provider";

const Layout = ({ children }: { children: any }) => {

  return (
    <Provider>
      <div class="bg-slate-400 w-11/12 mx-auto h-dvh">
        <Header children={children} />
      </div>
      <div className="px-3 w-full sm:w-[98.5%] rounded bg-slate-100 mx-auto">
        <Row
          styling={{
            alignItems: "items-start",
            flexWrap: "flex-wrap",
            padding: "pt-1 px-1 pb-2",
            overflow: "overflow-visible",
          }}
        >
          {children}
        </Row>
      </div>
    </Provider>
  );
};

export default (page) => <Layout>{page}</Layout>;
