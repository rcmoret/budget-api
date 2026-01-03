import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { OptionsMenu } from "@/components/layout/OptionsMenu";
import { Provider } from "@/components/layout/Provider";
import { Row } from "@/components/common/Row";
import { KeyboardNav } from "./ApplicationListners";
import { TAppConfig } from "@/components/layout/Provider";

const initialConfig: TAppConfig = {
  metadata: {
    namespace: "budget",
    page: { name: "home" }
  },
  account: {
    name: "",
    isArchived: false,
    priority: 0,
    balance: 0,
    isCashFlow: false,
    includeArchived: false,
    key: "",
    showTransferForm: false,
    slug: "",
  },
  accounts: [],
  budget: {
    categories: [],
    data: {
      isCurrent: false,
      totalDays: 0,
      firstDate: "2000-01-01",
      lastDate: "2099-12-31",
      daysRemaining: 0,
      month: 1,
      year: 2000,
      isClosedOut: false,
      isSetUp: false,
      items: []
    },
    discretionary: {
      amount: 0,
      overUnderBudget: 0,
      transactionsTotal: 0,
      transactionDetails: []
    }
  },
}

const Layout = ({ children }: { children: any }) => {
  const config = { ...initialConfig, metadata: children.props.metadata }
  const [appConfig, setAppConfig] = useState<TAppConfig>(config)

  const accounts = children.props.dashboard?.accounts ||
    children.props.accounts ||
    []

  return (
    <Provider appConfig={appConfig} setAppConfig={setAppConfig}>
      <KeyboardNav />
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
            <OptionsMenu accounts={accounts} namespace={children.props.metadata.namespace}/>
            {children}
          </Row>
        </div>
      </div>
    </Provider>
  );
};

export default (page: any) => <Layout>{page}</Layout>;
