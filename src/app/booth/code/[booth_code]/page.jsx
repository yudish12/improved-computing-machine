import React from "react";
import SubHeader from "@/components/ui/sub-header";
import Header from "@/components/ui/header";
import Queryform from "@/app/(landing)/Queryform";
// import Queryform from '../(landing)/Queryform';
import BoothGrid from "./_components/BoothCardGrid";
import BoothEnquiry from "./_components/BoothInuiry";
import { BoothDetails } from "./_components/BoothDetails";
import Footer from "@/components/ui/footer";
import { findSingleBooth, getAllData, getDataByCode } from "@/server/actions/booths";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const booth_code = resolvedParams.booth_code;

  const boothData = await findSingleBooth({booth_code});
  const data = boothData.data
  return {
    title: booth_code || "Default Title",
    description: booth_code || "Default Description",
    keywords: data?.meta_keywords?.join(",") ?? "Default Keywords",
    alternates: {
      canonical: `https://chronicleexhibits.com/${data?.booth_size?.name}-trade-show-booth/${booth_code}/`,
    }
  };
}

const BoothByCode = async ({ params }) => {
  const resolvedParams = await params;
  console.log("params", resolvedParams);
  const boothCode = resolvedParams.booth_code;
  const header = await headers();

  const sizeFromHeader = header.get("X-Booth-Size");
  console.log(sizeFromHeader,32)

  const resp = await getDataByCode(boothCode, sizeFromHeader);

  if (!resp?.data) {
    notFound();
  }

  const boothCodes = await getAllData(
    0,
    3,
    "booth_code thumbnail_image image_alt_text",
    resp.data.booth_size,
    true
  );


  return (
    <>
      {/* <SubHeader /> */}
      <Header />
      {/* <div>

    </div> */}
      <BoothDetails size={sizeFromHeader} boothData={resp.data} boothCode={boothCode} />
      {/* <BoothEnquiry/> */}
      <BoothGrid size={sizeFromHeader} boothCodes={boothCodes} />
      <Footer />
    </>
  );
};

export default BoothByCode;
