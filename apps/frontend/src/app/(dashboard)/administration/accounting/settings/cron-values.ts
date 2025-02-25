export const cronValues = [
  {
    name: "every_day", // every day at 6pm
    value: "0 18 * * *",
  },
  {
    name: "every_two_days", // every two days at 6pm
    value: "0 18 */2 * *",
  },
  {
    name: "every_three_days", // every three days at 6pm
    value: "0 18 */3 * *",
  },
  {
    name: "every_four_days", // every four days at 6pm
    value: "0 18 */4 * *",
  },
  {
    name: "once_every_week", // once a week on Sunday at 6pm
    value: "0 18 * * 0",
  },
  {
    name: "once_every_two_weeks", // every two weeks on Sunday at 6pm
    value: "0 18 */14 * *",
  },
  {
    name: "once_every_month", // once every month on the 1st at 6pm
    value: "0 18 1 * *",
  },
];
