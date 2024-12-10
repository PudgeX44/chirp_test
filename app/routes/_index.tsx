import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { resources } from "~/constants/constants";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-16">
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
          <p className="text-lg font-medium text-gray-600">Select a service</p>
          <ul className="w-full">
            {resources.map(({ href, text }) => (
              <li key={href}>
                <Link
                  className="group flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                  to={href}
                >
                  <span className="text-sm font-medium">{text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
