"use client";
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  School,
  UserCheck,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import { Progress } from "@repo/ui/components/progress";

export function Dashboard() {
  const attendanceData = [
    { day: "Mon", attendance: 95 },
    { day: "Tue", attendance: 92 },
    { day: "Wed", attendance: 96 },
    { day: "Thu", attendance: 94 },
    { day: "Fri", attendance: 97 },
  ];

  const performanceData = [
    { subject: "Math", score: 78 },
    { subject: "Science", score: 82 },
    { subject: "English", score: 85 },
    { subject: "History", score: 91 },
    { subject: "Arts", score: 88 },
    { subject: "PE", score: 95 },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-6">
      <div className="flex-1 space-y-4">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <p className="text-xs text-muted-foreground">
                +12 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teachers</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">86</div>
              <p className="text-xs text-muted-foreground">
                +2 new this semester
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                +4 new classes added
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Attendance Rate
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.8%</div>
              <p className="text-xs text-muted-foreground">
                +2.4% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Weekly Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  attendance: {
                    label: "Attendance Rate",
                    color: "var(--chart-1)",
                  },
                }}
                className="aspect-[4/3]"
              >
                <LineChart
                  data={attendanceData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                    domain={[80, 100]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                You have 3 events scheduled for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Staff Meeting
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Today, 10:00 AM
                    </p>
                  </div>
                  <Badge className="ml-auto" variant="outline">
                    1h
                  </Badge>
                </div>
                <div className="flex items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Science Fair
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Today, 1:00 PM
                    </p>
                  </div>
                  <Badge className="ml-auto" variant="outline">
                    3h
                  </Badge>
                </div>
                <div className="flex items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <School className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Parent-Teacher Conference
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Today, 4:30 PM
                    </p>
                  </div>
                  <Badge className="ml-auto" variant="outline">
                    2h
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Performance and Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>
                Average scores across all grades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: {
                    label: "Average Score",
                    color: "var(--chart-1)",
                  },
                }}
                className="aspect-[4/3]"
              >
                <BarChart
                  data={performanceData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="subject" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src="/placeholder.svg?height=36&width=36"
                      alt="Avatar"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium">
                      John Doe submitted assignment
                    </p>
                    <p className="text-xs text-muted-foreground">
                      10 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src="/placeholder.svg?height=36&width=36"
                      alt="Avatar"
                    />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium">
                      Maria Smith marked attendance
                    </p>
                    <p className="text-xs text-muted-foreground">
                      25 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src="/placeholder.svg?height=36&width=36"
                      alt="Avatar"
                    />
                    <AvatarFallback>RJ</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium">
                      Robert Johnson updated grades
                    </p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Completion Tracking */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Curriculum Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Mathematics</div>
                <div className="text-sm text-muted-foreground">68%</div>
              </div>
              <Progress value={68} className="mt-2" />

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">Science</div>
                <div className="text-sm text-muted-foreground">72%</div>
              </div>
              <Progress value={72} className="mt-2" />

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">English</div>
                <div className="text-sm text-muted-foreground">84%</div>
              </div>
              <Progress value={84} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Facility Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Computer Lab</div>
                <div className="text-sm text-muted-foreground">92%</div>
              </div>
              <Progress value={92} className="mt-2" />

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">Library</div>
                <div className="text-sm text-muted-foreground">78%</div>
              </div>
              <Progress value={78} className="mt-2" />

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">Sports Facilities</div>
                <div className="text-sm text-muted-foreground">65%</div>
              </div>
              <Progress value={65} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Students
              </Button>
              <Button className="w-full justify-start">
                <BookOpen className="h-4 w-4" />
                Schedule Classes
              </Button>
              <Button className="w-full justify-start">
                <Clock className="h-4 w-4" />
                Take Attendance
              </Button>
              <Button className="w-full justify-start">
                <GraduationCap className="h-4 w-4" />
                Enter Grades
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
