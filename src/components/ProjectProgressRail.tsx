import React, { useState } from 'react';
import { EpicItem, TaskItem } from '../types';
import { PlayCircle, Github, ChevronDown, ChevronUp, CheckCircle2, Clock, BarChart2 } from 'lucide-react';

interface ProjectProgressRailProps {
  epics: EpicItem[];
  onToggleTask: (taskId: string) => void;
  onOpenDemoModal: () => void;
  onOpenGithubModal: () => void;
  onOpenDemoVideo: () => void;
  hasDemoLink: boolean;
  hasGithubLink: boolean;
}

export const ProjectProgressRail: React.FC<ProjectProgressRailProps> = ({
  epics,
  onToggleTask,
  onOpenDemoModal,
  onOpenGithubModal,
  onOpenDemoVideo,
  hasDemoLink,
  hasGithubLink,
}) => {
  // Database Development (epic-4) is expanded by default as in screenshot!
  const [expandedEpicIds, setExpandedEpicIds] = useState<string[]>(['epic-4']);

  const toggleEpic = (epicId: string) => {
    setExpandedEpicIds((prev) =>
      prev.includes(epicId) ? prev.filter((id) => id !== epicId) : [...prev, epicId]
    );
  };

  // Calculate total tasks and overall progress
  const allTasks = epics.flatMap((e) => e.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === 'done').length;
  const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-white border-l border-slate-200 p-4 space-y-4">
      {/* Header & Overall Progress */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm tracking-tight">
          Project Progress
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            {overallPercentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${overallPercentage}%` }}
        />
      </div>

      {/* Action Buttons: [▶ Add Demo Link] & [Add Github Link] */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenDemoModal}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all shadow-xs ${
            hasDemoLink
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate">{hasDemoLink ? 'Watch Demo' : 'Add Demo Link'}</span>
        </button>

        <button
          onClick={onOpenGithubModal}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all shadow-xs ${
            hasGithubLink
              ? 'bg-slate-900 border-slate-900 text-white'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Github className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{hasGithubLink ? 'GitHub Linked' : 'Add Github Link'}</span>
        </button>
      </div>

      {/* Epics Accordion List */}
      <div className="space-y-2 pt-1">
        {epics.map((epic) => {
          const isExpanded = expandedEpicIds.includes(epic.id);
          const epicCompletedCount = epic.tasks.filter((t) => t.status === 'done').length;
          const epicProgress =
            epic.tasks.length > 0
              ? Math.round((epicCompletedCount / epic.tasks.length) * 100)
              : 0;

          return (
            <div
              key={epic.id}
              className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs"
            >
              {/* Epic Title Header */}
              <button
                onClick={() => toggleEpic(epic.id)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-[11px] font-bold tracking-wider text-slate-800 uppercase truncate">
                  {epic.title}
                </span>
                <span className="text-slate-400">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </button>

              {/* Expanded Epic Content */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3">
                  {/* Metadata Badges exactly matching screenshot */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white">
                      Complexity: {epic.complexity}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white">
                      Duration: {epic.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-teal-600 text-white">
                      Progress: {epicProgress}%
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-600 text-white">
                      Stories: {epic.storiesCount}
                    </span>
                  </div>

                  {/* Task checklist within epic */}
                  <div className="space-y-1.5 pt-1">
                    {epic.tasks.map((task) => {
                      const isDone = task.status === 'done';
                      return (
                        <div
                          key={task.id}
                          onClick={() => onToggleTask(task.id)}
                          className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-white cursor-pointer group text-xs transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => {}} // Handled by div onClick
                            className="mt-0.5 rounded text-blue-600 accent-blue-600 cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div
                              className={`text-xs leading-tight ${
                                isDone
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-700 group-hover:text-slate-900 font-medium'
                              }`}
                            >
                              {task.title}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {task.estimatedHours}h est.
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
