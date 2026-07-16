import { HeaderComponent, PageComponent } from "@frontend/layout";

const Home = () => {
  return (
    <PageComponent
      mainId="home"
      header={<HeaderComponent title="Budget App" />}
      rightColumn={null}
    >
      <div className="p-8"></div>
    </PageComponent>
  );
};

export default Home;
