/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Font } from "@react-pdf/renderer";

import { getCdnUrl } from "./utils";

const CDN_URL = getCdnUrl();

Font.register({
  family: "Geist",
  fonts: [
    {
      src: `${CDN_URL}/fonts/Geist/Geist-Regular.ttf`,
      fontWeight: "normal",
    },
    {
      src: `${CDN_URL}/fonts/Geist/Geist-Bold.ttf`,
      fontWeight: "bold",
    },
  ],
});

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: `${CDN_URL}/fonts/Roboto/Roboto-Regular.ttf`,
    },
    {
      src: `${CDN_URL}/fonts/Roboto/Roboto-Bold.ttf`,
      fontWeight: "bold",
    },
    {
      src: `${CDN_URL}/fonts/Roboto/Roboto-Italic.ttf`,
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      src: `${CDN_URL}/fonts/Roboto/Roboto-BoldItalic.ttf`,
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
  format: "truetype",
});
