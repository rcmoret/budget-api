import {
  PageComponent,
  pageHeaderClassName,
  pageHeadingClassName,
} from "@frontend/layout";

const Header = () => {
  return (
    <div className={pageHeaderClassName}>
      <h1 className={pageHeadingClassName}>Budget App</h1>
    </div>
  );
};

const Home = () => {
  return (
    <PageComponent mainId="home" metadata={{ namespace: "", pageName: "home" }} header={<Header />} rightColumn={null}>
      <div className="p-8"></div>
    </PageComponent>
  );
};

export default Home;
