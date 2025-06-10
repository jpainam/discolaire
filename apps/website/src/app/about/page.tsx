// app/about/page.tsx or pages/about.tsx (depending on your routing setup)

export default function Page() {
  return (
    <main className="mx-auto mb-8 max-w-3xl px-4">
      <p className="mb-8 text-lg font-medium">
        Empowering Schools with Smart Digital Solutions
      </p>

      <section className="mb-10">
        <h2 className="mb-2 text-2xl font-semibold">🎯 Our Mission</h2>
        <p>
          To <strong>digitally transform education</strong> in Africa and beyond
          by providing a powerful, affordable, and easy-to-use school management
          platform that connects schools, teachers, parents, and students.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">🏫 What We Offer</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>📚 Academic Management</strong> – Student enrollment, class
            schedules, grade reporting, and transcripts.
          </li>
          <li>
            <strong>👩‍🏫 Teacher Tools</strong> – Attendance tracking, assignment
            creation, student evaluations, and communications.
          </li>
          <li>
            <strong>🧾 Finance & Billing</strong> – Tuition tracking, invoice
            generation, fee collection, and financial reports.
          </li>
          <li>
            <strong>💬 Parent Communication</strong> – Real-time notifications,
            announcements, report cards, and messaging.
          </li>
          <li>
            <strong>🏛️ Multi-School Support</strong> – Centralized control for
            networks of schools.
          </li>
          <li>
            <strong>📱 Mobile-Friendly Access</strong> – Use the platform from
            any device, anytime.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">
          💡 Why Choose Discolaire?
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Easy to implement, even for non-technical schools</li>
          <li>Secure and compliant with modern data protection practices</li>
          <li>Designed for the African education landscape</li>
          <li>Includes training, setup support, and ongoing maintenance</li>
          <li>Available in multiple languages (English, French, etc.)</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">👨‍💼 Who We Serve</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Primary & Secondary Schools</li>
          <li>School Networks and Administrators</li>
          <li>Parents & Guardians</li>
          <li>Teachers & Academic Staff</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-2xl font-semibold">📍 Get in Touch</h2>
        <p className="mb-2">
          Have questions? Want a demo? We’d love to show you how Discolaire can
          support your school.
        </p>
        <p>
          📧{" "}
          <a
            href="mailto:support@discolaire.com"
            className="text-blue-600 underline"
          >
            support@discolaire.com
          </a>
          <br />
          🌐{" "}
          <a
            href="https://www.discolaire.com"
            className="text-blue-600 underline"
          >
            www.discolaire.com
          </a>
        </p>
      </section>

      <footer className="mt-16 text-center text-sm text-gray-500">
        &copy; 2025 Discolaire Inc. All rights reserved.
      </footer>
    </main>
  );
}
