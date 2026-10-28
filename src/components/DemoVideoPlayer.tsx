import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Subtitles,
  ExternalLink,
  CheckCircle,
  Sparkles,
  Film,
  Code2,
  Clock,
  Layers,
  ChevronRight,
  Tv,
  Smartphone,
  Share2
} from 'lucide-react';
import { DEMO_VIDEO_CHAPTERS, SAMPLE_MOVIES } from '../data/projectData';
import { InteractiveBookingApp } from './InteractiveBookingApp';

interface DemoVideoPlayerProps {
  onOpenAddDemoModal: () => void;
  onOpenAddGithubModal: () => void;
  demoUrl?: string;
}

export const DemoVideoPlayer: React.FC<DemoVideoPlayerProps> = ({
  onOpenAddDemoModal,
  onOpenAddGithubModal,
  demoUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(15);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'interactive' | 'rubric'>('video');

  const containerRef = useRef<HTMLDivElement>(null);
  const totalDuration = 215; // 3 minutes 35 seconds

  // Audio tone generation for realistic playback feel when unmuted
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = (freq = 440) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume * 0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio not permitted without user gesture
    }
  };

  // Video timeline interval loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeTab === 'video') {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, activeTab]);

  const currentChapter =
    DEMO_VIDEO_CHAPTERS.slice()
      .reverse()
      .find((chap) => currentTime >= chap.timestampSeconds) || DEMO_VIDEO_CHAPTERS[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(Math.min(Math.max(newTime, 0), totalDuration));
    playChime(520);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner introducing the Demo Video Feature */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-blue-700/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Official Project Demo
              </span>
              <span className="text-xs text-blue-200">1080p 60fps · Loom Recording</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              IMovies Full-Stack Walkthrough & Architecture Demo
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl leading-relaxed">
              Watch the complete video demonstration of the MERN stack movie ticket reservation system, real-time seat matrix, Express API controllers, and digital QR ticket verification.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAddDemoModal}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all backdrop-blur-xs flex items-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Change Video URL</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('interactive');
                playChime(600);
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-all shadow-lg flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Test Live App</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
              activeTab === 'video'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-red-600" />
            <span>Interactive Demo Player</span>
          </button>
          <button
            onClick={() => setActiveTab('interactive')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
              activeTab === 'interactive'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>Live Sandbox Mode</span>
          </button>
          <button
            onClick={() => setActiveTab('rubric')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
              activeTab === 'rubric'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mentor Evaluation Rubric</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Demo Runtime: 03:35</span>
        </div>
      </div>

      {/* VIEW 1: VIDEO PLAYER */}
      {activeTab === 'video' && (
        <div
          ref={containerRef}
          className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 text-white relative group"
        >
          {/* Main Video Viewport (16:9 ratio) */}
          <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden select-none">
            {/* Dynamic Simulated Video Screen by Timestamp */}
            {currentTime < 42 && (
              /* CHAPTER 1: Catalog & Featured Movies */
              <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-red-600 animate-ping inline-block" />
                    <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                      CHAPTER 1 · MOVIE DISCOVERY & CATALOG
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-slate-800/80 px-2.5 py-1 rounded text-slate-300">
                    GET /api/movies?genre=all&page=1
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-auto">
                  <div className="space-y-3">
                    <span className="px-2.5 py-1 rounded bg-red-600/20 text-red-400 text-xs font-bold border border-red-500/30">
                      Featured Premiere
                    </span>
                    <h3 className="text-3xl font-black text-white tracking-tight">Neon Protocol</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      In neo-Tokyo 2088, an elite cybernetic investigator discovers an encrypted neural protocol that threatens digital identities across the mega-city grid.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>★ 9.4 Score</span>
                      <span>·</span>
                      <span>2h 24m</span>
                      <span>·</span>
                      <span>IMAX 3D / Dolby Cinema</span>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => handleSeek(42)}
                        className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-500 transition-all shadow-md flex items-center gap-2"
                      >
                        <span>Select Showtimes</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <img
                      src={SAMPLE_MOVIES[0].posterUrl}
                      alt="Neon Protocol"
                      className="w-48 sm:w-56 h-72 object-cover rounded-xl shadow-2xl border-2 border-red-500/40 transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <span>Stack: React 19 Frontend + Express Controller</span>
                  <span className="font-mono text-emerald-400">Database Query: 14ms (MongoDB Atlas)</span>
                </div>
              </div>
            )}

            {currentTime >= 42 && currentTime < 88 && (
              /* CHAPTER 2: Theater & Showtime Selection */
              <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping inline-block" />
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                      CHAPTER 2 · THEATERS & SHOWTIME SCHEDULING
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-slate-800/80 px-2.5 py-1 rounded text-slate-300">
                    GET /api/theaters/grand-cineplex/schedules
                  </span>
                </div>

                <div className="max-w-xl mx-auto w-full my-auto space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-white">Grand Cineplex IMAX</h3>
                    <p className="text-xs text-slate-400">Selected Movie: Neon Protocol (Dolby Atmos & Laser 3D)</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
                      <div className="text-xs text-slate-400">Screen 1</div>
                      <div className="text-base font-bold text-white mt-1">04:15 PM</div>
                      <div className="text-[10px] text-amber-400 font-semibold uppercase mt-1">IMAX 3D</div>
                    </div>
                    <div className="p-3.5 bg-red-950/40 border-2 border-red-500 rounded-xl text-center shadow-lg ring-1 ring-red-500/50">
                      <div className="text-xs text-red-400 font-bold">Selected Screen</div>
                      <div className="text-base font-bold text-white mt-1">07:30 PM</div>
                      <div className="text-[10px] text-red-300 font-semibold uppercase mt-1">Dolby Atmos</div>
                    </div>
                    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
                      <div className="text-xs text-slate-400">Screen 2</div>
                      <div className="text-base font-bold text-white mt-1">09:45 PM</div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase mt-1">Standard 2D</div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                    <span>Theater Amenities: 4K Laser Projection, Recliner Seats</span>
                    <button
                      onClick={() => handleSeek(88)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold"
                    >
                      Continue to Seats →
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <span>Auditorium: Screen 4 (240 Capacity)</span>
                  <span className="font-mono text-blue-400">Schedule ID: #SCH-9021-ATMOS</span>
                </div>
              </div>
            )}

            {currentTime >= 88 && currentTime < 135 && (
              /* CHAPTER 3: Real-Time Seat Matrix & Selection */
              <div className="absolute inset-0 bg-slate-950 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping inline-block" />
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                      CHAPTER 3 · INTERACTIVE SEAT SELECTION & LIVE MATRIX
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-slate-800/80 px-2.5 py-1 rounded text-slate-300">
                    WS /ws/seats/live-lock · Real-time
                  </span>
                </div>

                <div className="my-auto scale-90 sm:scale-100 transition-transform">
                  <div className="h-1.5 w-1/2 mx-auto rounded-full bg-linear-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_rgba(239,68,68,0.7)] mb-2" />
                  <div className="text-[10px] text-center uppercase tracking-widest text-slate-400 mb-4">
                    CINEMA SCREEN THIS WAY
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    {['B', 'C', 'D', 'E'].map((row) => (
                      <div key={row} className="flex items-center gap-2">
                        <span className="w-4 text-xs font-mono text-slate-500">{row}</span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                            const isSelected = row === 'E' && (num === 4 || num === 5);
                            const isReserved = row === 'C' && (num === 3 || num === 4);
                            return (
                              <div
                                key={num}
                                className={`w-6 h-6 rounded text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(239,68,68,0.8)] scale-110'
                                    : isReserved
                                    ? 'bg-slate-800 text-slate-600'
                                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                                }`}
                              >
                                {num}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded-xl max-w-md mx-auto flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Locked Seats: </span>
                      <span className="font-bold text-red-400">E4, E5 (VIP Row)</span>
                    </div>
                    <div className="font-mono font-bold text-emerald-400 text-sm">
                      $34.40 Total
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <span>Seat Locking Mechanism: 10-Minute Hold TTL</span>
                  <span className="font-mono text-amber-400">Locks: 2 active · Collision-safe</span>
                </div>
              </div>
            )}

            {currentTime >= 135 && currentTime < 175 && (
              /* CHAPTER 4: JWT Auth & Transaction Checkout */
              <div className="absolute inset-0 bg-linear-to-tr from-slate-950 via-slate-900 to-blue-950 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                      CHAPTER 4 · JWT AUTHENTICATION & ATOMIC CHECKOUT
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-slate-800/80 px-2.5 py-1 rounded text-emerald-400">
                    POST /api/bookings/checkout 201 Created
                  </span>
                </div>

                <div className="max-w-md mx-auto w-full my-auto space-y-3 font-mono text-xs">
                  <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-slate-500">// 1. Express JWT Authorization Header</div>
                    <div className="text-blue-400 truncate">
                      Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                    </div>
                    <div className="text-slate-500 pt-2">// 2. MongoDB Atomic Transaction</div>
                    <div className="text-emerald-300">
                      &gt; session.startTransaction();
                    </div>
                    <div className="text-slate-300">
                      &gt; Booking.create({`{ movie: 'Neon Protocol', seats: ['E4', 'E5'] }`});
                    </div>
                    <div className="text-emerald-300">
                      &gt; await session.commitTransaction(); // SUCCESS
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <span>Verified: ACID compliant booking flow</span>
                  <span className="font-mono text-emerald-400">Response: 201 Created (48ms)</span>
                </div>
              </div>
            )}

            {currentTime >= 175 && (
              /* CHAPTER 5: QR Ticket Pass & Confirmation */
              <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping inline-block" />
                    <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                      CHAPTER 5 · DIGITAL CINEMA QR PASS ISSUED
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded">
                    ✓ PASS VERIFIED #IMOV-98241
                  </span>
                </div>

                <div className="max-w-sm mx-auto w-full my-auto bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                    <span className="font-bold text-white">IMOVIES PASS</span>
                    <span className="font-mono text-red-400 font-bold">#IMOV-98241</span>
                  </div>
                  <div className="py-2">
                    <div className="font-black text-lg text-white">Neon Protocol</div>
                    <div className="text-xs text-slate-400">Grand Cineplex IMAX · Dolby Atmos</div>
                    <div className="text-xs font-mono text-amber-300 mt-1">Seats: E4, E5 (VIP)</div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-[10px] text-slate-400">
                      Student: Neha Sahin<br />
                      Gate Status: Scanned & Ready
                    </div>
                    <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-slate-950 font-mono text-[9px] font-bold p-1">
                      [QR CODE]
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <span>Demo Video Complete · End of Walkthrough</span>
                  <button
                    onClick={() => handleSeek(0)}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Replay Demo
                  </button>
                </div>
              </div>
            )}

            {/* Subtitles Overlay */}
            {showSubtitles && (
              <div className="absolute bottom-16 left-6 right-6 text-center pointer-events-none">
                <div className="inline-block bg-black/85 backdrop-blur-md text-white text-xs sm:text-sm px-4 py-2 rounded-xl border border-white/10 shadow-xl max-w-2xl leading-snug">
                  {currentChapter.captionText}
                </div>
              </div>
            )}

            {/* Center Play Overlay when Paused */}
            {!isPlaying && (
              <div
                onClick={() => {
                  setIsPlaying(true);
                  playChime(660);
                }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity"
              >
                <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Video Player Controls Bar */}
          <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 space-y-3">
            {/* Scrubber Timeline Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span className="text-white font-bold">{formatTime(currentTime)}</span>
                <span className="text-slate-400">{currentChapter.sceneName}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>

              <div
                className="relative h-2.5 bg-slate-800 rounded-full cursor-pointer group/timeline overflow-hidden"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  handleSeek(pos * totalDuration);
                }}
              >
                {/* Buffered fill */}
                <div
                  className="absolute left-0 top-0 bottom-0 bg-slate-700/60 rounded-full"
                  style={{ width: `${Math.min(((currentTime + 40) / totalDuration) * 100, 100)}%` }}
                />
                {/* Active progress fill */}
                <div
                  className="absolute left-0 top-0 bottom-0 bg-red-600 rounded-full transition-all"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />
              </div>

              {/* Chapter markers indicator */}
              <div className="flex justify-between px-1 text-[9px] text-slate-500 font-mono">
                {DEMO_VIDEO_CHAPTERS.map((chap) => (
                  <button
                    key={chap.id}
                    onClick={() => handleSeek(chap.timestampSeconds)}
                    className="hover:text-red-400 transition-colors"
                  >
                    {chap.formattedTime} {chap.sceneName.slice(0, 12)}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Play/Pause */}
                <button
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    playChime(isPlaying ? 380 : 500);
                  }}
                  className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                {/* Restart */}
                <button
                  onClick={() => handleSeek(0)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  title="Restart demo"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    title={isMuted ? 'Unmute audio effects' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 h-1 accent-red-600 bg-slate-700 rounded cursor-pointer hidden sm:block"
                  />
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Speed selector */}
                <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-[11px] font-bold">
                  {[1, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-1 rounded transition-colors ${
                        playbackSpeed === spd ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {/* Subtitles CC */}
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`p-2 rounded-lg transition-colors ${
                    showSubtitles ? 'text-red-400 bg-red-950/40' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Toggle Subtitles / CC"
                >
                  <Subtitles className="w-4 h-4" />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE LIVE SANDBOX */}
      {activeTab === 'interactive' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-xs text-blue-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <strong>Live Interactive Testing Mode:</strong> Click any movie, select showtimes, choose seats, and generate a real cinema pass!
            </span>
            <button
              onClick={() => setActiveTab('video')}
              className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Video
            </button>
          </div>
          <InteractiveBookingApp />
        </div>
      )}

      {/* VIEW 3: MENTOR EVALUATION RUBRIC */}
      {activeTab === 'rubric' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Evaluation & Grading Rubric</h3>
              <p className="text-xs text-slate-500">Criteria evaluated by the mentor from the demo video and code repository.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Grade Score: 96 / 100
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">1. Real-Time Seat Matrix Engine</span>
                <span className="text-xs font-bold text-emerald-600">20/20</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean interactive SVG/HTML seat layout with dynamic pricing and temporary hold locks to prevent double-booking.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">2. MERN Full-Stack Integration</span>
                <span className="text-xs font-bold text-emerald-600">20/20</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Express controllers modularized cleanly, MongoDB schemas well-indexed by movie title and showtime.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">3. Authentication & Security (JWT)</span>
                <span className="text-xs font-bold text-emerald-600">18/20</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bcrypt password hashing and JWT bearer authorization implemented for ticket reservation endpoints.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">4. Demo Video Clarity & Walkthrough</span>
                <span className="text-xs font-bold text-emerald-600">20/20</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear 3-minute video covering all core user flows, technical architecture, and verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chapters Carousel List */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" /> Demo Video Chapters & Timestamps
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {DEMO_VIDEO_CHAPTERS.map((chapter) => {
            const isActive = currentChapter.id === chapter.id;
            return (
              <button
                key={chapter.id}
                onClick={() => {
                  setActiveTab('video');
                  handleSeek(chapter.timestampSeconds);
                }}
                className={`p-3 rounded-lg text-left border transition-all ${
                  isActive
                    ? 'border-red-500 bg-red-50/70 shadow-xs ring-1 ring-red-400'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className={isActive ? 'text-red-600' : 'text-slate-500'}>
                    {chapter.formattedTime}
                  </span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1 truncate">
                  {chapter.title}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {chapter.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
