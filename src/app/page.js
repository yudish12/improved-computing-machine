import Header from "@/components/ui/header";
import SubHeader from "@/components/ui/sub-header";
import Hero from "./(landing)/Hero";
import About from "./(landing)/About";
import Footer from "@/components/ui/footer";
import Products from "./(landing)/Products";
import Faq from "./(landing)/Faq";
import Leadingtrade from "./(landing)/Leadingtrade";
import Ourworks from "./(landing)/Ourworks";
import FactsAndFigures from "./(landing)/FactsAndFigures";
import Queryform from "./(landing)/Queryform";
import { getSinglePage } from "@/server/actions/pages";

export default async function Home() {
  const homePageData = await getSinglePage({ name: "home" });
  console.log(homePageData);
  return (
    <>
      <SubHeader />
      <Header />
      <Hero fields={homePageData.data.fields} />
      <About fields={homePageData.data.fields} />
      <Products
        title={homePageData.data.fields[23].value}
        subTitle={homePageData.data.fields[24].value}
      />
      <FactsAndFigures fields={homePageData.data.fields} />
      <Ourworks
        title={homePageData.data.fields[35].value}
        subTitle={homePageData.data.fields[36].value}
      />
      <Leadingtrade fields={homePageData.data.fields} />
      <Faq fields={homePageData.data.fields} />
      <Queryform />
      <Footer />
    </>
  );
}
