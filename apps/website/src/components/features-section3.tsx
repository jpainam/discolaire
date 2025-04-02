import {
  Captions,
  ChartArea,
  ClipboardPen,
  ClipboardPlus,
  CreditCard,
  FolderDot,
  GraduationCap,
  ListPlus,
} from "lucide-react";

export function FeaturesSection3() {
  const features = [
    {
      title: "ADMISSION AND ENROLLMENT",
      description:
        "Minimize registrar data entry with applications, Payment intergration, and more.",
      icon: <ClipboardPen />,
    },
    {
      title: "TUITION & INVOICING",
      description:
        "Online Tuition Management offers full-service options for managers, registrars, and guardians all in one.",
      icon: <CreditCard />,
    },
    {
      title: "Analytics",
      description:
        "Identify areas for improvement, visualize school data, and enhance student outcomes.",
      icon: <ChartArea />,
    },
    {
      title: "REPORTING",
      description:
        "Reporting options such as templates, configurable data fields, advanced filters, printing, and export capabilities.",
      icon: <ClipboardPlus />,
    },
    {
      title: "TRANSCRIPTS",
      description:
        "Simplify your workload with bulk transcript printing, student transfers, and GPA calculation settings",
      icon: <Captions />,
    },
    {
      title: "ADMIN FORMS",
      description:
        "Eliminate the hassle of collecting physical forms with secure online submissions, configurable templates, and more.",
      icon: <FolderDot />,
    },
    {
      title: "ATTENDANCE TRACKING",
      description:
        "Record attendance in real-time with configurable markings and notification settings that are viewable by guardians.",
      icon: <ListPlus />,
    },
    {
      title: "GRADE BOOK",
      description:
        "Configurable grade book, featuring cumulative averages, grade weighting, attendance tracking, and more",
      icon: <GraduationCap />,
    },
  ];

  return (
    <div className="relative z-10 mx-auto max-w-7xl py-7">
      {/* Hero Section */}
      <section className="py-16 text-center text-white">
        <h1 className="mb-4 bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-4xl font-bold text-transparent uppercase">
          Discolaire School Management System
        </h1>
        <p className="mt-2 text-lg font-bold text-zinc-400">
          The ultimate solution for managing school operations efficiently.
        </p>
        <div className="mt-6">
          <a
            href="/ContactUs"
            className="hover: inline-block rounded-lg bg-green-500 bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-300 hover:from-green-600 hover:to-teal-600"
          >
            Talk to Our Experts
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10">
        <h2 className="mb-10 text-center text-3xl font-bold uppercase italic">
          Our Discolaire Solutions
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, _index) => (
            <div
              key={feature.title}
              className="rounded-lg border p-4 shadow-md"
            >
              <div className="mb-4 flex text-4xl">{feature.icon}</div>
              <h3 className="mb-2 mb-4 bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-xl font-bold text-transparent">
                {feature.title}
              </h3>
              <p className="text-zinc-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col items-center space-y-4 py-10 text-center text-lg text-neutral-600 dark:text-neutral-400">
        <p>
          From powerful automation to flexible configurability settings, there’s
          so much more
          <br />
          to explore. See how our features can support your school.
        </p>
        <p>
          <a
            href="/ContactUs"
            className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text font-semibold text-transparent hover:underline"
          >
            Contact Us Today
          </a>
        </p>
      </section>
    </div>
  );
}
