import { PageComponent, pageHeadingClassName } from "@frontend/layout";

const Header = () => {
  return <h1 className={pageHeadingClassName}>Budget App</h1>;
};

const Home = () => {
  return (
    <PageComponent mainId="home" header={<Header />} rightColumn={null}>
      <div className="p-8"></div>
    </PageComponent>
  );
};

export default Home;
