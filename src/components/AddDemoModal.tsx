import React, { useState } from 'react';
import { X, Film, CheckCircle2, Video, Globe, Play } from 'lucide-react';

interface AddDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDemoLink: (url: string) => void;
  currentUrl?: string;
  onWatchDemo: () => void;
}

export const AddDemoModal: React.FC<AddDemoModalProps> = ({
  isOpen,
  onClose,
  onSaveDemoLink,
  currentUrl = '',
  onWatchDemo,
}) => {
  const [demoType, setDemoType] = useState<'builtin' | 'loom' | 'youtube' | 'custom'>('builtin');
  const [url, setUrl] = useState(currentUrl || 'https://www.loom.com/share/imovies-mern-demo-walkthrough-9821');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDemoLink(url);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Demo Video Link</h3>
              <p className="text-xs text-slate-500">Provide your Loom, YouTube, or built-in demo walkthrough.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Quick Option Cards */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setDemoType('builtin');
                setUrl('https://myskillwallet.ai/demo/imovies-fullstack-walkthrough');
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                demoType === 'builtin'
                  ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Play className="w-3.5 h-3.5 text-blue-600" /> Built-in Interactive Demo
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Full 3:35 animated walkthrough of IMovies (recommended).
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setDemoType('loom');
                setUrl('https://www.loom.com/share/imovies-mern-demo-walkthrough-9821');
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                demoType === 'loom'
                  ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Video className="w-3.5 h-3.5 text-indigo-600" /> Loom Recording
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Loom video link for mentor review and evaluation.
              </div>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Demo Video URL
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.loom.com/share/... or YouTube link"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Mentors evaluate this link to assess full-stack functionality, seat reservations, and code standards.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Demo video link saved and attached to project!</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onWatchDemo();
              }}
              className="px-3.5 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" /> Watch Built-in Demo
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                Save Demo Link
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
