import cron from "node-cron";

export async function runCronJobs() {
  const response = await fetch(`/api/cron`, {
    method: "GET",
  });
  const data = await response.json() as {id: string}
  console.log(data);
  cron.schedule("* * * * *", () => {
    console.log("running a task every minute");
  });
}
