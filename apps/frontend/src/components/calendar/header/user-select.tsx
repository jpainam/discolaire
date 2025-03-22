import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useCalendar } from "~/components/calendar/calendar-context";

export function UserSelect() {
  const { users, selectedUserId, setSelectedUserId } = useCalendar();

  return (
    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="w-64" align="end">
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={undefined} alt={"A"} />
              <AvatarFallback className="text-[10px]">{"A"}</AvatarFallback>
            </Avatar>
            <p className="truncate">All</p>
          </div>
        </SelectItem>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id} className="flex-1">
            <div className="flex items-center gap-2">
              <Avatar key={user.id} className="size-6">
                <AvatarImage
                  src={user.picturePath ?? undefined}
                  alt={user.name}
                />
                <AvatarFallback className="text-[10px]">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>

              <p className="truncate">{user.name}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
