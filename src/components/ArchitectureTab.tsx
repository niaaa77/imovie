import React, { useState } from 'react';
import { Network, Server, Database, Shield, ArrowRight, Play, Check } from 'lucide-react';

export const ArchitectureTab: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<string>('GET /api/movies');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const endpoints = [
    {
      method: 'GET',
      path: '/api/movies',
      desc: 'Retrieve full list of active screening movies with genres and ratings',
      mockResponse: {
        success: true,
        count: 2,
        data: [
          { id: 'mov-1', title: 'Neon Protocol', score: 9.4, format: ['IMAX 3D', 'Dolby Atmos'] },
          { id: 'mov-2', title: 'Velocity Reach', score: 9.1, format: ['Dolby Cinema', '2D'] }
        ]
      }
    },
    {
      method: 'GET',
      path: '/api/showtimes/:movieId',
      desc: 'Fetch scheduled screening times and auditorium room allocations',
      mockResponse: {
        success: true,
        theater: 'Grand Cineplex IMAX',
        screenings: [
          { time: '04:15 PM', screen: 'Screen 1', format: 'IMAX 3D', availableSeats: 38 },
          { time: '07:30 PM', screen: 'Screen 4', format: 'Dolby Atmos', availableSeats: 44 }
        ]
      }
    },
    {
      method: 'POST',
      path: '/api/bookings/checkout',
      desc: 'Atomic reservation of selected seats with JWT authorization check',
      mockResponse: {
        success: true,
        bookingId: 'IMOV-98241',
        seats: ['E4', 'E5'],
        status: 'confirmed',
        qrPass: 'AUTH_IMOV_98241_CONFIRMED'
      }
    }
  ];

  const handleTestEndpoint = (ep: typeof endpoints[0]) => {
    setActiveEndpoint(`${ep.method} ${ep.path}`);
    setLoading(true);
    setApiResponse(null);
    setTimeout(() => {
      setLoading(false);
      setApiResponse(JSON.stringify(ep.mockResponse, null, 2));
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* High Level Flow */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Network className="w-4 h-4 text-blue-400" /> System Architecture & Data Pipeline
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 mx-auto flex items-center justify-center font-bold text-xs mb-2">
              1
            </div>
            <div className="font-bold text-xs text-white">Client Tier (React 19)</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Interactive SVG seat grid, instant state updates, responsive movie catalog.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-400 mx-auto flex items-center justify-center font-bold text-xs mb-2">
              2
            </div>
            <div className="font-bold text-xs text-white">App Tier (Express.js)</div>
            <p className="text-[11px] text-slate-400 mt-1">
              REST controllers, JWT verification middlewares, temporary 10-min seat locks.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 text-emerald-400 mx-auto flex items-center justify-center font-bold text-xs mb-2">
              3
            </div>
            <div className="font-bold text-xs text-white">Data Tier (MongoDB)</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Mongoose collections for Movies, Showtimes, Seats, and Bookings.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive REST API Spec Tester */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">REST API Endpoints</h4>
            <p className="text-xs text-slate-500">Click any endpoint to simulate the response payload.</p>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
            Server: Online (Port 5000)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            {endpoints.map((ep) => {
              const isSelected = activeEndpoint === `${ep.method} ${ep.path}`;
              return (
                <button
                  key={ep.path}
                  onClick={() => handleTestEndpoint(ep)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      <span className={ep.method === 'GET' ? 'text-blue-600 font-extrabold' : 'text-emerald-600 font-extrabold'}>
                        {ep.method}
                      </span>{' '}
                      {ep.path}
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                      <Play className="w-3 h-3" /> Test
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{ep.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="bg-slate-950 text-slate-200 rounded-lg p-3 border border-slate-800 text-xs font-mono flex flex-col justify-between min-h-[200px]">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2 mb-2">
              <span>Payload Inspector: {activeEndpoint}</span>
              {loading && <span className="text-amber-400">Requesting...</span>}
            </div>

            <pre className="overflow-x-auto text-[11px] text-emerald-400 flex-1">
              {apiResponse || JSON.stringify(endpoints[0].mockResponse, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
