"use client";
import React from "react";
import InformationHeader from "./InformationHeader";
import InformationContent from "./InformationContent";
import { useLocale } from "next-intl";

const StrategicForesight = ({ data }) => {
  const locale = useLocale();
  if (!data) return null;
  const title = data.title?.[locale] || data.title?.["en"] || "";

  return (
    <main>
      <InformationHeader title={title} />
      <InformationContent data={data} />
    </main>
  );
};

export default StrategicForesight;
