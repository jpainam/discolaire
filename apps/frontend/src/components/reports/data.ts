export interface ReportQueue {
  id: string;
  created_at: string;
  job_name: string;
  started_at: string;
  ended_at: string;
  status: "Running" | "Completed" | "Failed" | "Scheduled" | "Cancelled";
}

export const reportQueue: ReportQueue[] = [
  {
    id: "1",
    created_at: "2022-01-01",
    job_name: "Student Profile - Demographics",
    started_at: "2022-01-01",
    ended_at: "2022-01-02",
    status: "Running",
  },

  {
    id: "2",
    created_at: "2022-01-02",
    job_name: "Student Profile - Demographics",
    started_at: "2022-01-02",
    ended_at: "2022-01-03",
    status: "Completed",
  },
  {
    id: "3",
    created_at: "2022-01-03",
    job_name: "HS Transcript - Semester Grades/Credits",
    started_at: "2022-01-03",
    ended_at: "2022-01-04",
    status: "Failed",
  },
  {
    id: "4",
    created_at: "2022-01-04",
    job_name: "Report 4",
    started_at: "2022-01-04",
    ended_at: "2022-01-05",
    status: "Running",
  },
  {
    id: "5",
    created_at: "2022-01-05",
    job_name: "Report 5",
    started_at: "2022-01-05",
    ended_at: "2022-01-06",
    status: "Scheduled",
  },
  {
    id: "5",
    created_at: "2022-01-05",
    job_name: "Report 5",
    started_at: "2022-01-05",
    ended_at: "2022-01-06",
    status: "Scheduled",
  },
];
