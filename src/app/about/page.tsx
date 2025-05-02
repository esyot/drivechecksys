"use client";
import Layout from "../layouts/layout";

export default function AboutPage() {
  return (
    <Layout>
      <section className="max-w-3xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-4 text-blue-600">
          About This Project
        </h1>

        <p className="mb-4">
          This website is built using{" "}
          <span className="font-semibold">Next.js</span>, a modern React
          framework designed for server-side rendering, static site generation,
          and optimized web applications.
        </p>

        <p className="mb-4">
          Styled with <span className="font-semibold">Tailwind CSS</span>, it
          offers a sleek and responsive design, ensuring a clean and
          user-friendly interface. The project follows best practices for
          performance, accessibility, and scalability in a React environment.
        </p>

        <p className="mb-4">
          The main functionality of this system is to serve as a digital record
          system for tracking vehicles entering and exiting an establishment. It
          leverages React state management for dynamic filtering and sorting,
          providing a smooth user experience.
        </p>

        <p className="mb-4">
          This system helps improve security, streamline operations, and
          maintain accurate records, making it ideal for gated communities,
          schools, offices, and parking facilities.
        </p>

        <div className="mt-8 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Developed Using:
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              <span className="font-medium">Next.js</span> - React-based
              framework for fast and scalable applications
            </li>
            <li>
              <span className="font-medium">Tailwind CSS</span> - Utility-first
              CSS framework for styling
            </li>
            <li>
              <span className="font-medium">Firebase</span> - Cloud-based
              backend for authentication and database management
            </li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}
