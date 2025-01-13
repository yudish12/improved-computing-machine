import React from "react";
import SubHeader from "@/components/ui/sub-header";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Image from "next/image";
import Introduction from "./_components/Introduction";
import WhyChooseUs from "./_components/WhyChooseUs";
import ManufacturingUnit from "./_components/ManufacturingUnit";
import { getSinglePage } from "@/server/actions/pages";
import FactsAndFigures from "./_components/FactsAndFigures";
const page = async () => {
  const aboutusPageData = await getSinglePage({ name: "about-us" });
  const fields = aboutusPageData.data.fields;

  return (
    <>
      <SubHeader />
      <Header />
      <div className="booth-design-bg px-4 md:px-20 text-white gap-8 h-[360px] justify-center items-center flex flex-col">
        <Image
          src={"/info-circle.png"}
          width={50}
          height={50}
          alt="location-bg"
          className="object-cover"
        />
        <h3 className="text-white heading-font text-4xl font-bold">
          {fields[0].value}
        </h3>
      </div>
      <Introduction fields={fields} />
      <WhyChooseUs fields={fields} />
      <FactsAndFigures fields={fields} />
      <ManufacturingUnit fields={fields} />
      <Footer />
    </>
  );
};

export default page;
