import {
  MainComponent,
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
    <MainComponent namespace="" header={<Header />} rightColumn={null}>
      <div className="p-8"></div>
    </MainComponent>
  );
};

export default Home;
