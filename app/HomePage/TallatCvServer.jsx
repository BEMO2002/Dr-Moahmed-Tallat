import React from "react";
import { fetchPages } from "../lib/server-api";
import TallatCv from "./TallatCv";

/**
 * TallatCvServer - Server component responsible for fetching the "talaat-cv" page data.
 */
const TallatCvServer = async () => {
  let cvData = null;
  try {
    const pages = await fetchPages();
    // Find the page with the specific slug
    cvData = pages.find((page) => page.slug === "talaat-cv");

    if (!cvData) {
      console.warn("TallatCvServer: Page with slug 'talaat-cv' not found.");
    }
  } catch (error) {
    console.error("TallatCvServer Error:", error);
  }

  if (!cvData) return null;

  return <TallatCv data={cvData} />;
};

export default TallatCvServer;
