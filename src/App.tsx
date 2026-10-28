/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ProjectProgressRail } from './components/ProjectProgressRail';
import { DemoVideoPlayer } from './components/DemoVideoPlayer';
import { SystemRequirementsTab } from './components/SystemRequirementsTab';
import { InstructionsTab } from './components/InstructionsTab';
import { ArchitectureTab } from './components/ArchitectureTab';
import { KanbanView } from './components/KanbanView';
import { WorkspaceView } from './components/WorkspaceView';
import { AddDemoModal } from './components/AddDemoModal';
import { AddGithubModal } from './components/AddGithubModal';
import { INITIAL_EPICS } from './data/projectData';
import { EpicItem, TaskItem } from './types';
import {
  Film,
  Github,
  PlayCircle,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Info,
  Calendar,
  Layers,
  X,
  Share2
} from 'lucide-react';

export default function App() {
  const [activeNav, setActiveNav] = useState('skill-wallet');
  const [currentTab, setCurrentTab] = useState<'overview' | 'demo' | 'workspace' | 'kanban'>('overview');
  const [overviewSubTab, setOverviewSubTab] = useState<'system' | 'instructions' | 'demo' | 'architecture'>('system');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Project state
  const [epics, setEpics] = useState<EpicItem[]>(INITIAL_EPICS);
  const [hasDemoLink, setHasDemoLink] = useState(true);
  const [demoUrl, setDemoUrl] = useState('https://myskillwallet.ai/demo/imovies-fullstack-walkthrough');
  const [hasGithubLink, setHasGithubLink] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');

  // Modals
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [mentorAssigned, setMentorAssigned] = useState(false);
  const [selectedSkillInfo, setSelectedSkillInfo] = useState<string | null>(null);

  // Calculate task counts
  const allTasks = epics.flatMap((e) => e.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === 'done').length;

  const handleToggleTask = (taskId: string) => {
    setEpics((prev) =>
      prev.map((epic) => ({
        ...epic,
        tasks: epic.tasks.map((task) =>
          task.id === taskId
            ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
            : task
        ),
      }))
    );
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskItem['status']) => {
    setEpics((prev) =>
      prev.map((epic) => ({
        ...epic,
        tasks: epic.tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ),
      }))
    );
  };

  const skillsList = [
    'HyperText Markup Language (HTML)',
    'Cascading Style Sheets (CSS)',
    'JavaScript (Programming Language)',
    'React.js (Javascript Library)',
    'Node.js (Javascript Library)',
    'Express.js (Javascript Library)',
    'MongoDB',
    'Asynchronous Javascript',
    'JSON Web Token (JWT)',
    'Bootstrap (Front-End Framework)',
  ];

  const skillDescriptions: Record<string, string> = {
    'HyperText Markup Language (HTML)': 'Semantic elements for accessibility, meta tags, and structured DOM layouts.',
    'Cascading Style Sheets (CSS)': 'Flexbox, CSS grid, media queries for responsive layouts, and modern pseudo-elements.',
    'JavaScript (Programming Language)': 'ES6+ syntax, arrow functions, destructuring, and closures.',
    'React.js (Javascript Library)': 'React 19 hooks (useState, useEffect, useMemo), modular component architecture.',
    'Node.js (Javascript Library)': 'Asynchronous non-blocking runtime powering the backend server and NPM packages.',
    'Express.js (Javascript Library)': 'RESTful routing, middleware pipelines, error handlers, and JSON body parsing.',
    'MongoDB': 'NoSQL document database, Mongoose ODM schemas, and ACID transaction sessions for bookings.',
    'Asynchronous Javascript': 'Promises, async/await patterns, and non-blocking I/O operations.',
    'JSON Web Token (JWT)': 'Stateless bearer authorization for secure customer authentication and route guards.',
    'Bootstrap (Front-End Framework)': 'Component primitives, responsive grid system, and utility styling classes.',
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          activeNav={activeNav}
          onSelectNav={setActiveNav}
          onOpenDemoVideo={() => setCurrentTab('demo')}
          mobileOpen={mobileSidebarOpen}
          onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Central Viewport & Right Rail */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <TopHeader
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            onOpenShareModal={() => alert('Project share link copied to clipboard!')}
          />

          {/* Tab Views */}
          <div className="flex-1 flex flex-col lg:flex-row min-w-0">
            {/* Main Center Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 space-y-6">
              {/* VIEW: DEMO VIDEO (Requested by user) */}
              {currentTab === 'demo' && (
                <DemoVideoPlayer
                  demoUrl={demoUrl}
                  onOpenAddDemoModal={() => setIsDemoModalOpen(true)}
                  onOpenAddGithubModal={() => setIsGithubModalOpen(true)}
                />
              )}

              {/* VIEW: WORKSPACE */}
              {currentTab === 'workspace' && (
                <WorkspaceView onOpenDemo={() => setCurrentTab('demo')} />
              )}

              {/* VIEW: KANBAN */}
              {currentTab === 'kanban' && (
                <KanbanView
                  epics={epics}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onOpenDemo={() => setCurrentTab('demo')}
                />
              )}

              {/* VIEW: OVERVIEW (Matching Screenshot) */}
              {currentTab === 'overview' && (
                <div className="space-y-6">
                  {/* Top Alert Banner from Screenshot */}
                  <div className="bg-[#155dfc] text-white p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
                        <span>Add Demo and GitHub links!</span>
                      </h2>
                      <p className="text-xs text-blue-100/90 leading-snug">
                        Please update the demo and GitHub links so that your mentor can review and evaluate your project.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentTab('demo')}
                        className="px-3 py-1.5 rounded-lg bg-white text-[#155dfc] text-xs font-bold hover:bg-blue-50 transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Watch Demo Video</span>
                      </button>

                      <button
                        onClick={() => setIsGithubModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-blue-700/80 hover:bg-blue-800 text-white border border-blue-400/40 text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>{hasGithubLink ? 'GitHub Added' : 'Add GitHub Link'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Category badges */}
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold">
                      Entertainment
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold">
                      Individual
                    </span>
                  </div>

                  {/* Project description from screenshot */}
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                    <p>
                      The IMovies is a seamless online platform that enhances the cinema experience by allowing users to browse movies, select showtimes, and reserve seats with real-time availability tracking. Built with <strong className="text-slate-900 font-semibold">Express.js</strong> and <strong className="text-slate-900 font-semibold">MongoDB</strong>, it leverages a robust client-server architecture to ensure efficient data management and smooth performance. Key features include secure user authentication, booking management, and an intuitive interface that makes ticket reservations convenient and personalized. This project documentation provides a complete guide to the setup, development, and technical architecture of the system.
                    </p>
                  </div>

                  {/* Skills Required Section */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Skills Required
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skillsList.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => setSelectedSkillInfo(skill)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium text-slate-700 shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mentor Section */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Mentor
                    </h3>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-slate-600">
                        {mentorAssigned ? 'Assigned Mentor: Dr. Marcus Vance (Full-Stack Senior Lead)' : 'No mentor assigned yet'}
                      </p>
                      {!mentorAssigned && (
                        <button
                          onClick={() => setIsMentorModalOpen(true)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          Request Mentor Review →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Project Stats (Colored Cards from Screenshot) */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Project Stats
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Purple Card: Epics */}
                      <div className="bg-[#6b46c1] text-white p-4 rounded-xl shadow-xs space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-200">
                          <Layers className="w-4 h-4" /> Epics
                        </div>
                        <div>
                          <div className="text-xs text-purple-100">Total Epics: 6</div>
                          <div className="text-2xl font-black mt-1">6 Epics</div>
                        </div>
                      </div>

                      {/* Teal/Green Card: Stories & Subtasks */}
                      <div className="bg-[#0f766e] text-white p-4 rounded-xl shadow-xs space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-200">
                          <CheckCircle2 className="w-4 h-4" /> Stories &amp; Subtasks
                        </div>
                        <div>
                          <div className="text-xs text-teal-100">
                            Total Tasks: {totalTasks} · Completed: {completedTasks}
                          </div>
                          <div className="text-2xl font-black mt-1">19 Tasks</div>
                          <div className="text-[11px] text-teal-200 mt-0.5">Total Subtasks: 0</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtabs matching Screenshot */}
                  <div className="border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setOverviewSubTab('system')}
                        className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                          overviewSubTab === 'system'
                            ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        System Requirements
                      </button>

                      <button
                        onClick={() => setOverviewSubTab('instructions')}
                        className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                          overviewSubTab === 'instructions'
                            ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Instructions
                      </button>

                      <button
                        onClick={() => setOverviewSubTab('demo')}
                        className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                          overviewSubTab === 'demo'
                            ? 'border-red-600 text-red-600 bg-white rounded-t-lg'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>Demo Video &amp; Walkthrough</span>
                      </button>

                      <button
                        onClick={() => setOverviewSubTab('architecture')}
                        className={`hidden sm:flex px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                          overviewSubTab === 'architecture'
                            ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Architecture &amp; APIs
                      </button>
                    </div>
                  </div>

                  {/* Tab Contents */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                    {overviewSubTab === 'system' && <SystemRequirementsTab />}
                    {overviewSubTab === 'instructions' && (
                      <InstructionsTab onOpenDemo={() => setCurrentTab('demo')} />
                    )}
                    {overviewSubTab === 'demo' && (
                      <DemoVideoPlayer
                        demoUrl={demoUrl}
                        onOpenAddDemoModal={() => setIsDemoModalOpen(true)}
                        onOpenAddGithubModal={() => setIsGithubModalOpen(true)}
                      />
                    )}
                    {overviewSubTab === 'architecture' && <ArchitectureTab />}
                  </div>
                </div>
              )}
            </main>

            {/* Right Rail: Project Progress with 6 Epics */}
            <ProjectProgressRail
              epics={epics}
              onToggleTask={handleToggleTask}
              onOpenDemoModal={() => setIsDemoModalOpen(true)}
              onOpenGithubModal={() => setIsGithubModalOpen(true)}
              onOpenDemoVideo={() => setCurrentTab('demo')}
              hasDemoLink={hasDemoLink}
              hasGithubLink={hasGithubLink}
            />
          </div>
        </div>
      </div>

      {/* Add Demo Modal */}
      <AddDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        currentUrl={demoUrl}
        onSaveDemoLink={(url) => {
          setDemoUrl(url);
          setHasDemoLink(true);
        }}
        onWatchDemo={() => setCurrentTab('demo')}
      />

      {/* Add GitHub Modal */}
      <AddGithubModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
        currentUrl={githubUrl}
        onSaveGithubLink={(url) => {
          setGithubUrl(url);
          setHasGithubLink(true);
        }}
      />

      {/* Mentor Request Modal */}
      {isMentorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Request Mentor Review</h3>
              </div>
              <button
                onClick={() => setIsMentorModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <p>
                Your demo video and project progress ({Math.round((completedTasks / totalTasks) * 100)}%) will be submitted to the SkillWallet mentor pool.
              </p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                <strong>Review SLA:</strong> Mentors typically evaluate demo video submissions and provide rubric feedback within 4 hours.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsMentorModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setMentorAssigned(true);
                  setIsMentorModalOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Submit for Mentor Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Info Modal */}
      {selectedSkillInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-xs">{selectedSkillInfo}</h4>
              <button
                onClick={() => setSelectedSkillInfo(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 py-3 leading-relaxed">
              {skillDescriptions[selectedSkillInfo] || 'Core curriculum requirement for full-stack engineering proficiency.'}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedSkillInfo(null)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
