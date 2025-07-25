import { Calendar } from "react-big-calendar";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
//import "react-big-calendar/lib/sass/styles";
import "./big-calendar.css";

import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

export type {
  Culture,
  DateLocalizer,
  EventProps,
  Formats,
  View as RbcView,
} from "react-big-calendar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
const BigCalendar = Calendar as any;

export {
  dateFnsLocalizer,
  momentLocalizer,
  Views as RbcViews,
} from "react-big-calendar";

export default BigCalendar;

export { withDragAndDrop };
