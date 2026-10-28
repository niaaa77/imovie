import React from 'react';
import { ExternalLink, CheckCircle2, Laptop, HardDrive, Cpu, Monitor, Download } from 'lucide-react';

export const SystemRequirementsTab: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-800 leading-relaxed text-xs sm:text-sm">
      {/* Intro paragraph from screenshot */}
      <p className="text-slate-600 leading-relaxed">
        To ensure smooth development, deployment, and usage of the IMovies Web-Application, certain system prerequisites must be met. These requirements are categorized into software, setup, and hardware specifications, all of which contribute to building a robust and scalable entertainment platform.
      </p>

      {/* 1. Software Requirements */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          1. Software Requirements
        </h3>
        <p className="text-slate-600 text-xs">
          These are the essential tools and platforms required to develop, test, and run the application efficiently.
        </p>

        <ul className="space-y-2.5 pt-1 text-slate-700">
          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-400 mt-1">•</span>
            <div>
              <strong className="text-slate-900 font-semibold">Operating System:</strong> Windows 10/11, macOS, or Linux — Supports cross-platform development and testing.
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-400 mt-1">•</span>
            <div>
              <strong className="text-slate-900 font-semibold">Node.js (v16 or above):</strong> Provides the runtime environment for building and managing frontend logic and Powers the server-side logic and handles API routing.{' '}
              <a
                href="https://nodejs.org"
                target="_blank"
                rel="noreferrer"
                className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1 ml-1 hover:underline"
              >
                👉 Download Node.js
              </a>
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-400 mt-1">•</span>
            <div>
              <strong className="text-slate-900 font-semibold">npm (v8 or above):</strong> A package manager required to install dependencies for React and related libraries.
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-400 mt-1">•</span>
            <div>
              <strong className="text-slate-900 font-semibold">React.js:</strong> A JavaScript library for building dynamic and responsive user interfaces.
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-400 mt-1">•</span>
            <div>
              <strong className="text-slate-900 font-semibold">Browser:</strong> Google Chrome / Firefox (latest version) — For rendering and testing the UI in real-time.
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-400 mt-1">•</span>
            <div>
              <strong className="text-slate-900 font-semibold">Express.js:</strong> A lightweight web framework for building RESTful APIs.
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-400 mt-1">•</span>
            <div>
              <strong className="text-slate-900 font-semibold">MongoDB:</strong> A NoSQL database used to store structured and unstructured data related to movies, theaters, seat matrices, and booking transactions.{' '}
              <a
                href="https://www.mongodb.com/try/download/community"
                target="_blank"
                rel="noreferrer"
                className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1 ml-1 hover:underline"
              >
                👉 Download MongoDB
              </a>
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-400 mt-1">•</span>
            <div>
              <strong className="text-slate-900 font-semibold">Postman:</strong> Tool for testing APIs during development.
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-400 mt-1">•</span>
            <div>
              <strong className="text-slate-900 font-semibold">Visual Studio Code:</strong> Preferred code editor with built-in Git and terminal support.
            </div>
          </li>
        </ul>
      </div>

      {/* 2. Hardware Requirements */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          2. Hardware Requirements
        </h3>
        <p className="text-slate-600 text-xs">
          Describes the minimum and recommended specifications needed to support the development and usage of the application.
        </p>

        <ul className="space-y-2.5 pt-1 text-slate-700">
          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-400 mt-1">•</span>
            <div>
              <strong className="text-slate-900 font-semibold">Processor:</strong> Intel Core i5 (8th Gen or above) / AMD Ryzen 5 or better — Ensures fast compilation and multitasking during development.
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-400 mt-1">•</span>
            <div>
              <strong className="text-slate-900 font-semibold">RAM:</strong> Minimum 8 GB (16 GB recommended) — For handling development servers, IDEs, and browser testing simultaneously.
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-400 mt-1">•</span>
            <div>
              <strong className="text-slate-900 font-semibold">Storage:</strong> At least 1 GB free space — Required for package installations, MongoDB setup, and local project files.
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-400 mt-1">•</span>
            <div>
              <strong className="text-slate-900 font-semibold">Display:</strong> 1366x768 or higher — Recommended for optimal coding experience and application layout visualization.
            </div>
          </li>
        </ul>
      </div>

      {/* Quick Environment Verification Widget */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-blue-900">Your Local Environment Status</span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
            All Checks Passed
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700 font-mono">
          <div className="p-2 bg-white rounded-lg border border-blue-100">
            Node: <span className="text-emerald-600 font-bold">v20.12.0</span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-blue-100">
            npm: <span className="text-emerald-600 font-bold">v10.5.0</span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-blue-100">
            React: <span className="text-emerald-600 font-bold">v19.0.0</span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-blue-100">
            Express: <span className="text-emerald-600 font-bold">v4.21.2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
