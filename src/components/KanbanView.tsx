import React, { useState } from 'react';
import { EpicItem, TaskItem } from '../types';
import { Search, Plus, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface KanbanViewProps {
  epics: EpicItem[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskItem['status']) => void;
  onOpenDemo: () => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  epics,
  onUpdateTaskStatus,
  onOpenDemo,
}) => {
  const [search, setSearch] = useState('');
  const allTasks = epics.flatMap((e) => e.tasks);

  const filteredTasks = allTasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  const columns: { id: TaskItem['status']; label: string; color: string; badge: string }[] = [
    { id: 'todo', label: 'To Do', color: 'border-slate-300', badge: 'bg-slate-100 text-slate-700' },
    { id: 'in_progress', label: 'In Progress', color: 'border-blue-400', badge: 'bg-blue-100 text-blue-700' },
    { id: 'review', label: 'In Review', color: 'border-amber-400', badge: 'bg-amber-100 text-amber-700' },
    { id: 'done', label: 'Done', color: 'border-emerald-400', badge: 'bg-emerald-100 text-emerald-700' },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Quick Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search across 19 MERN tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Total Tasks: <strong className="text-slate-800">{allTasks.length}</strong>
          </span>
          <button
            onClick={onOpenDemo}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5" /> Watch Demo
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="bg-slate-100/70 rounded-xl p-3 border border-slate-200/80 flex flex-col min-h-[480px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {col.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badge}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {colTasks.map((task) => {
                  const parentEpic = epics.find((e) => e.id === task.epicId);
                  return (
                    <div
                      key={task.id}
                      className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-2"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-blue-600 font-bold uppercase truncate max-w-[130px]">
                          {parentEpic?.title.split(' ')[0]}
                        </span>
                        <span className="text-slate-400 font-mono">{task.estimatedHours}h</span>
                      </div>

                      <h5 className="text-xs font-semibold text-slate-900 leading-tight">
                        {task.title}
                      </h5>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                        {task.description}
                      </p>

                      {/* Quick Move Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Move:</span>
                        <div className="flex items-center gap-1">
                          {col.id !== 'todo' && (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, 'todo')}
                              className="text-[10px] px-1.5 py-0.5 rounded hover:bg-slate-100 text-slate-600"
                              title="Move to Todo"
                            >
                              Todo
                            </button>
                          )}
                          {col.id !== 'in_progress' && (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, 'in_progress')}
                              className="text-[10px] px-1.5 py-0.5 rounded hover:bg-blue-50 text-blue-600 font-semibold"
                              title="Move to In Progress"
                            >
                              Prog
                            </button>
                          )}
                          {col.id !== 'review' && (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, 'review')}
                              className="text-[10px] px-1.5 py-0.5 rounded hover:bg-amber-50 text-amber-600 font-semibold"
                              title="Move to Review"
                            >
                              Rev
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, 'done')}
                              className="text-[10px] px-1.5 py-0.5 rounded hover:bg-emerald-50 text-emerald-600 font-semibold"
                              title="Mark Done"
                            >
                              ✓ Done
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-lg">
                    No tasks in {col.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
