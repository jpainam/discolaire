import { Calendar } from "react-big-calendar";

// import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./big-calendar.css";

import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

export type {
  Culture,
  DateLocalizer,
  EventProps,
  Formats,
  View as RbcView,
} from "react-big-calendar";

const BigCalendar = Calendar;

export { momentLocalizer, Views as RbcViews } from "react-big-calendar";

export default BigCalendar;

export { withDragAndDrop };
