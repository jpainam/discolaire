import type { HugeiconsProps } from "@hugeicons/react";
import {
  AddToListIcon,
  AppleReminderIcon,
  Archive02Icon,
  ArtificialIntelligence04Icon,
  AssignmentsIcon,
  Book04Icon,
  Calendar03Icon,
  DashboardSquare01Icon,
  DashboardSquareSettingIcon,
  Database01Icon,
  Delete02Icon,
  DollarSquareIcon,
  FavouriteSquareIcon,
  File01Icon,
  Files02Icon,
  Folder02Icon,
  GoogleDocIcon,
  Home01Icon,
  InformationSquareIcon,
  Message02Icon,
  PencilEdit02Icon,
  PrinterIcon as PrinterGlyph,
  SearchIcon as SearchGlyph,
  Settings05Icon,
  SortByUp01Icon,
  UserAccountIcon,
  UserGroup03Icon,
  UserMultiple02Icon,
  ViewIcon as ViewGlypth,
  YoutubeIcon as YoutubeGlyph,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

function wrapHugeIcon(icon: NonNullable<HugeiconsProps["icon"]>) {
  return function AppIcon({
    strokeWidth = 2,
    className,
    ...rest
  }: HugeiconsProps) {
    return (
      <HugeiconsIcon
        icon={icon}
        strokeWidth={strokeWidth}
        className={className}
        {...rest}
      />
    );
  };
}

export const YoutubeIcon = wrapHugeIcon(YoutubeGlyph);
export const SearchIcon = wrapHugeIcon(SearchGlyph);
export const DeleteIcon = wrapHugeIcon(Delete02Icon);
export const EditIcon = wrapHugeIcon(PencilEdit02Icon);
export const FileIcon = wrapHugeIcon(File01Icon);
export const FilesIcon = wrapHugeIcon(Files02Icon);
export const FolderIcon = wrapHugeIcon(Folder02Icon);
export const DashboardIcon = wrapHugeIcon(DashboardSquare01Icon);
export const HomeIcon = wrapHugeIcon(Home01Icon);
export const UsersIcon = wrapHugeIcon(UserMultiple02Icon);
export const GroupsIcon = wrapHugeIcon(UserGroup03Icon);
export const ContactIcon = wrapHugeIcon(UserAccountIcon);
export const SettingsIcon = wrapHugeIcon(Settings05Icon);
export const InformationIcon = wrapHugeIcon(InformationSquareIcon);
export const AiIcon = wrapHugeIcon(ArtificialIntelligence04Icon);
export const AdministrationIcon = wrapHugeIcon(DashboardSquareSettingIcon);
export const LibraryIcon = wrapHugeIcon(Book04Icon);
export const PrinterIcon = wrapHugeIcon(PrinterGlyph);
export const ChatIcon = wrapHugeIcon(Message02Icon);
export const CalendarDays = wrapHugeIcon(Calendar03Icon);
export const EnrollmentIcon = wrapHugeIcon(AddToListIcon);
export const SubjectIcon = wrapHugeIcon(AppleReminderIcon);
export const ReportGradeIcon = wrapHugeIcon(Archive02Icon);
export const TextBookIcon = wrapHugeIcon(AssignmentsIcon);
export const AttendanceIcon = wrapHugeIcon(Database01Icon);
export const MoneyIcon = wrapHugeIcon(DollarSquareIcon);
export const FeeIcon = wrapHugeIcon(SortByUp01Icon);
export const GradeIcon = wrapHugeIcon(GoogleDocIcon);
export const HeartIcon = wrapHugeIcon(FavouriteSquareIcon);
export const ViewIcon = wrapHugeIcon(ViewGlypth);
