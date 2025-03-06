import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
export function RecentBorrows({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Borrows</CardTitle>
        <CardDescription>Latest books borrowed by students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="/placeholder.svg?height=36&width=36"
                alt="Avatar"
              />
              <AvatarFallback>JM</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Jackson Miller</p>
              <p className="text-sm text-muted-foreground">
                To Kill a Mockingbird
              </p>
            </div>
            <div className="ml-auto font-medium">Today</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="/placeholder.svg?height=36&width=36"
                alt="Avatar"
              />
              <AvatarFallback>SD</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Sophia Davis</p>
              <p className="text-sm text-muted-foreground">The Great Gatsby</p>
            </div>
            <div className="ml-auto font-medium">Yesterday</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="/placeholder.svg?height=36&width=36"
                alt="Avatar"
              />
              <AvatarFallback>ET</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Ethan Thompson</p>
              <p className="text-sm text-muted-foreground">1984</p>
            </div>
            <div className="ml-auto font-medium">Yesterday</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="/placeholder.svg?height=36&width=36"
                alt="Avatar"
              />
              <AvatarFallback>OW</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Olivia Wilson</p>
              <p className="text-sm text-muted-foreground">
                Pride and Prejudice
              </p>
            </div>
            <div className="ml-auto font-medium">2 days ago</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="/placeholder.svg?height=36&width=36"
                alt="Avatar"
              />
              <AvatarFallback>LJ</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Liam Johnson</p>
              <p className="text-sm text-muted-foreground">
                The Catcher in the Rye
              </p>
            </div>
            <div className="ml-auto font-medium">3 days ago</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
