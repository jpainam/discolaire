import path from "path";
import { fileURLToPath } from "url";
import { Font } from "@react-pdf/renderer";

// Fix for ESM: Convert import.meta.url to dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GeistRegular = path.resolve(__dirname, "Geist/Geist-Regular.ttf");
const GeistBold = path.resolve(__dirname, "Geist/Geist-Bold.ttf");
const RobotoRegular = path.resolve(__dirname, "Roboto/Roboto-Regular.ttf");
const RobotoBold = path.resolve(__dirname, "Roboto/Roboto-Bold.ttf");
const RobotoItalic = path.resolve(__dirname, "Roboto/Roboto-Italic.ttf");

const RobotoMono = path.resolve(__dirname, "Roboto/RobotoMono-Regular.ttf");

const RobotoBoldItalic = path.resolve(
  __dirname,
  "Roboto/Roboto-BoldItalic.ttf",
);
/*import GeistBold from "./Geist/Geist-Bold.ttf";
import GeistRegular from "./Geist/Geist-Regular.ttf";
import RobotoBold from "./Roboto/Roboto-Bold.ttf";
import RobotoBoldItalic from "./Roboto/Roboto-BoldItalic.ttf";
import RobotoItalic from "./Roboto/Roboto-Italic.ttf";
import RobotoRegular from "./Roboto/Roboto-Regular.ttf";*/

Font.register({
  family: "Geist",
  //format: "truetype",
  fonts: [
    {
      src: GeistRegular,
      fontWeight: "normal",
    },
    {
      src: GeistBold,
      fontWeight: "bold",
    },
  ],
});

Font.register({
  family: "RobotoMono",
  fonts: [
    {
      src: RobotoMono,
      fontWeight: "normal",
    },
  ],
});

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: RobotoRegular,
      fontWeight: "normal",
    },
    {
      src: RobotoBold,
      fontWeight: "bold",
    },
    {
      src: RobotoItalic,
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      src: RobotoBoldItalic,
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
  //format: "truetype",
});
