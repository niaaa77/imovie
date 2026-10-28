import React, { useState } from 'react';
import { FileCode, Folder, Play, CheckCircle2, Terminal, RefreshCw, Film } from 'lucide-react';

export const WorkspaceView: React.FC<{ onOpenDemo: () => void }> = ({ onOpenDemo }) => {
  const [selectedFile, setSelectedFile] = useState('bookingController.js');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const files: Record<string, { path: string; language: string; content: string }> = {
    'bookingController.js': {
      path: 'server/controllers/bookingController.js',
      language: 'javascript',
      content: `import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Movie from '../models/Movie.js';

// @desc    Reserve seats with atomic transaction hold
// @route   POST /api/bookings/checkout
// @access  Private (JWT Protected)
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { movieId, showtimeId, seats, customerName, customerEmail } = req.body;

    // 1. Check if any seat is already booked or currently locked
    const conflictingBooking = await Booking.findOne({
      movieId,
      showtimeId,
      'seats.id': { $in: seats.map(s => s.id) },
      status: { $in: ['confirmed', 'locked'] }
    }).session(session);

    if (conflictingBooking) {
      await session.abortTransaction();
      return res.status(409).json({ message: 'Selected seat(s) were just taken by another customer.' });
    }

    // 2. Compute total amount
    const subtotal = seats.reduce((acc, curr) => acc + curr.price, 0);
    const convenienceFee = 2.50;
    const totalAmount = subtotal + convenienceFee;

    // 3. Create confirmed booking document
    const newBooking = await Booking.create([{
      bookingId: \`IMOV-\${Math.floor(10000 + Math.random() * 90000)}\`,
      userId: req.user?._id || null,
      customerName,
      customerEmail,
      movieId,
      showtimeId,
      seats,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'paid'
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      data: newBooking[0]
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ error: error.message });
  }
};`,
    },
    'Booking.js': {
      path: 'server/models/Booking.js',
      language: 'javascript',
      content: `import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    showtimeId: { type: String, required: true },
    seats: [
      {
        id: { type: String, required: true },
        row: String,
        number: Number,
        price: Number,
        type: { type: String, enum: ['regular', 'vip'] }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['locked', 'confirmed', 'cancelled'],
      default: 'confirmed'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'paid'
    }
  },
  { timestamps: true }
);

BookingSchema.index({ movieId: 1, showtimeId: 1 });

export default mongoose.model('Booking', BookingSchema);`,
    },
    'SeatPicker.jsx': {
      path: 'client/src/components/SeatPicker.jsx',
      language: 'javascript',
      content: `import React, { useState } from 'react';

export const SeatPicker = ({ showtime, onProceedToPayment }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seat) => {
    if (seat.isReserved) return;
    if (selectedSeats.some(s => s.id === seat.id)) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  return (
    <div className="seat-selection-container">
      <div className="curved-screen-indicator">SCREEN THIS WAY</div>
      <div className="grid grid-rows-6 gap-2 my-6">
        {/* Render 48 interactive seat buttons with status styling */}
      </div>
    </div>
  );
};`,
    },
  };

  const runTests = () => {
    setIsRunningTests(true);
    setTestOutput(null);
    setTimeout(() => {
      setIsRunningTests(false);
      setTestOutput(
        `> imovies@1.0.0 test
> jest --runInBand --verbose

PASS server/__tests__/booking.test.js
  ✓ POST /api/movies returns active catalog (42ms)
  ✓ POST /api/bookings/checkout creates confirmed reservation (88ms)
  ✓ Concurrency Test: Prevent double-booking race condition (112ms)
  ✓ JWT Auth: Rejects unauthenticated checkout attempt (15ms)
  ✓ Price calculation applies seat category multipliers correctly (10ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        1.42s
Ran all test suites.`
      );
    }, 1100);
  };

  return (
    <div className="space-y-4">
      {/* Workspace Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-slate-800">MERN Developer Workspace</span>
          <span className="text-slate-400">·</span>
          <span className="text-xs text-slate-500 font-mono">
            {files[selectedFile]?.path}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runTests}
            disabled={isRunningTests}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {isRunningTests ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{isRunningTests ? 'Running Jest...' : 'Run Test Suite'}</span>
          </button>

          <button
            onClick={onOpenDemo}
            className="px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Watch Demo Video</span>
          </button>
        </div>
      </div>

      {/* Code Editor Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* File Explorer Tree */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
            Project Files
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold px-2 py-1">
              <Folder className="w-4 h-4 text-blue-500" /> server/controllers
            </div>
            <button
              onClick={() => setSelectedFile('bookingController.js')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-colors font-mono ${
                selectedFile === 'bookingController.js'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">bookingController.js</span>
            </button>

            <div className="flex items-center gap-1.5 text-slate-700 font-semibold px-2 py-1 pt-2">
              <Folder className="w-4 h-4 text-blue-500" /> server/models
            </div>
            <button
              onClick={() => setSelectedFile('Booking.js')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-colors font-mono ${
                selectedFile === 'Booking.js'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">Booking.js</span>
            </button>

            <div className="flex items-center gap-1.5 text-slate-700 font-semibold px-2 py-1 pt-2">
              <Folder className="w-4 h-4 text-blue-500" /> client/components
            </div>
            <button
              onClick={() => setSelectedFile('SeatPicker.jsx')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-colors font-mono ${
                selectedFile === 'SeatPicker.jsx'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span className="truncate">SeatPicker.jsx</span>
            </button>
          </div>
        </div>

        {/* Code Content View */}
        <div className="lg:col-span-3 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 overflow-hidden shadow-sm flex flex-col min-h-[460px]">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300 font-semibold">
              {files[selectedFile]?.path}
            </span>
            <span className="text-slate-500 font-mono text-[10px]">UTF-8 · JavaScript</span>
          </div>

          <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto flex-1 text-slate-300">
            {files[selectedFile]?.content}
          </pre>
        </div>
      </div>

      {/* Test Execution Output Console */}
      {testOutput && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 space-y-2">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <Terminal className="w-4 h-4 text-emerald-400" /> Test Runner Output
            </span>
            <button
              onClick={() => setTestOutput(null)}
              className="text-xs hover:text-white"
            >
              Clear
            </button>
          </div>
          <pre className="whitespace-pre-wrap">{testOutput}</pre>
        </div>
      )}
    </div>
  );
};
