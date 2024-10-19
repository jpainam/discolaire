"use client";

import { useState } from "react";
import {
  CalendarIcon,
  CheckSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileIcon,
  ImageIcon,
  LinkIcon,
  PaperclipIcon,
  PencilIcon,
} from "lucide-react";

import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Switch } from "@repo/ui/switch";
import { Textarea } from "@repo/ui/textarea";

const samplePosts = [
  {
    id: 1,
    title: "Welcome to the course!",
    content:
      "Hello everyone! Welcome to our course. We're excited to have you all here.",
    date: "2023-10-15",
    author: "Dr. Smith",
    status: "approved",
    attachments: ["doc", "image"],
  },
  {
    id: 2,
    title: "Assignment #1 Posted",
    content:
      "The first assignment has been posted. Please check the assignments tab for details.",
    date: "2023-10-18",
    author: "Prof. Johnson",
    status: "pending",
    attachments: ["doc"],
  },
  {
    id: 3,
    title: "Guest Lecture Next Week",
    content:
      "We're thrilled to announce a guest lecture by industry expert Jane Doe next Tuesday.",
    date: "2023-10-20",
    author: "Dr. Smith",
    status: "approved",
    attachments: ["link"],
  },
  {
    id: 4,
    title: "Midterm Exam Date",
    content:
      "The midterm exam will be held on November 5th. More details to follow.",
    date: "2023-10-22",
    author: "Prof. Johnson",
    status: "approved",
    attachments: [],
  },
  {
    id: 5,
    title: "Study Group Formation",
    content:
      "We encourage you to form study groups. Use the discussion forum to find partners.",
    date: "2023-10-25",
    author: "Teaching Assistant",
    status: "rejected",
    attachments: ["doc", "link"],
  },
  {
    id: 6,
    title: "Office Hours Change",
    content:
      "Please note that office hours will be moved to Thursdays from 2-4pm starting next week.",
    date: "2023-10-28",
    author: "Dr. Smith",
    status: "approved",
    attachments: ["image"],
  },
];

export function SubjectJournalEditor() {
  //const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [richText, setRichText] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("Announcement");
  const postsPerPage = 3;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = samplePosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return null;
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "doc":
        return <FileIcon className="h-4 w-4 text-blue-500" />;
      case "image":
        return <ImageIcon className="h-4 w-4 text-green-500" />;
      case "link":
        return <LinkIcon className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnnouncementTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div className="w-full overflow-y-auto p-4 md:w-3/4">
      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 font-bold text-white">
              JS
            </div>
            <div className="flex items-center">
              {isEditing ? (
                <Input
                  value={announcementTitle}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  className="text-2xl font-bold"
                  autoFocus
                />
              ) : (
                <h2 className="text-2xl font-bold">{announcementTitle}</h2>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEditClick}
                className="ml-2"
              >
                <PencilIcon className="h-4 w-4" />
                <span className="sr-only">Edit announcement title</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Rich text</span>
            <Switch checked={richText} onCheckedChange={setRichText} />
          </div>
        </div>

        <Textarea
          placeholder="What do you want to share?"
          className="mb-4 min-h-[100px] w-full"
        />

        <Select defaultValue="everyone">
          <SelectTrigger className="mb-4 w-full md:w-[180px]">
            <SelectValue placeholder="Select audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="everyone">Everyone</SelectItem>
            <SelectItem value="students">Students</SelectItem>
            <SelectItem value="instructors">Instructors</SelectItem>
          </SelectContent>
        </Select>

        <div className="mb-4 flex flex-wrap items-center">
          <Button variant="outline" size="icon" className="mb-2 mr-2">
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="mb-2 mr-2">
            <CalendarIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="mb-2 mr-2">
            <CheckSquareIcon className="h-4 w-4" />
          </Button>
          <span className="mb-2 mr-2">Send as</span>
          <Select defaultValue="app">
            <SelectTrigger className="mb-2 w-full md:w-[180px]">
              <SelectValue placeholder="Select notification type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="app">App notification</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" className="mr-2">
            Clear
          </Button>
          <Button>Post</Button>
        </div>
      </div>

      {/* Existing Posts */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Existing Posts</h3>
        {currentPosts.map((post) => (
          <div key={post.id} className="rounded-lg bg-white p-4 shadow">
            <div className="mb-2 flex items-start justify-between">
              <h4 className="text-lg font-semibold">{post.title}</h4>
              {getStatusBadge(post.status)}
            </div>
            <p className="mb-2 text-sm text-gray-500">
              By {post.author} on {post.date}
            </p>
            <p className="mb-2">{post.content}</p>
            <div className="flex items-center space-x-2">
              {post.attachments.map((attachment, index) => (
                <span key={index} title={`${attachment} attachment`}>
                  {getAttachmentIcon(attachment)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <Button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <span>
          Page {currentPage} of {Math.ceil(samplePosts.length / postsPerPage)}
        </span>
        <Button
          onClick={() => paginate(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(samplePosts.length / postsPerPage)
          }
          variant="outline"
        >
          Next
          <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
