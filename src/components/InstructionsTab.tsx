import React, { useState } from 'react';
import { CheckSquare, Square, ChevronRight, Terminal, BookOpen, Film, AlertCircle } from 'lucide-react';

export const InstructionsTab: React.FC<{ onOpenDemo: () => void }> = ({ onOpenDemo }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2]);

  const toggleStep = (stepNum: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  const steps = [
    {
      num: 1,
      title: 'Initialize MERN Stack Workspace & Environment',
      description:
        'Set up the monorepo structure with /server (Express.js) and /client (React 19). Create .env file with MONGODB_URI, PORT=5000, and JWT_SECRET.',
      code: `mkdir imovies && cd imovies\nnpm init -y\nnpm install express mongoose dotenv cors jsonwebtoken bcryptjs\nnpm install -D nodemon`,
    },
    {
      num: 2,
      title: 'Design MongoDB Schemas with Mongoose',
      description:
        'Create Mongoose models for Movie (title, poster, duration, rating, showtimes), Theater (name, screens, seatingCapacity), and Booking (userId, movie, seats, totalAmount, status).',
      code: `const BookingSchema = new mongoose.Schema({\n  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },\n  seats: [{ row: String, number: Number, price: Number }],\n  totalAmount: Number,\n  status: { type: String, enum: ['locked', 'confirmed', 'cancelled'], default: 'locked' }\n}, { timestamps: true });`,
    },
    {
      num: 3,
      title: 'Implement Atomic Seat Locking & Reservation Engine',
      description:
        'Prevent race conditions where two simultaneous users attempt to reserve the same seat. Implement a 10-minute temporary seat hold with TTL or transactional updates.',
      code: `// Express controller: /api/bookings/hold-seats\nconst lockSession = await mongoose.startSession();\nlockSession.startTransaction();\n// Verify no conflicting active locks exist before reserving...`,
    },
    {
      num: 4,
      title: 'Build React UI with Interactive Theater Seat Matrix',
      description:
        'Develop the cinema seat picker component with curved screen aesthetic, seat categories (VIP vs Regular), real-time pricing calculation, and responsive layout.',
      code: `<div className="screen-curved" />\n<div className="seat-grid">\n  {seats.map(seat => <SeatButton key={seat.id} seat={seat} onSelect={handleSelect} />)}\n</div>`,
    },
    {
      num: 5,
      title: 'Generate Digital Ticket Pass with Scannable QR Code',
      description:
        'Upon successful checkout confirmation, render a printable cinema boarding pass containing unique booking ID, screening hall details, and QR barcode.',
      code: `<QRCodeSVG value={JSON.stringify({ bookingId: ticket.id, seats: ticket.seats })} size={120} />`,
    },
    {
      num: 6,
      title: 'Record & Submit Demo Video Walkthrough for Review',
      description:
        'Record a 3-5 minute video demonstrating your working MERN application: browsing catalog, selecting showtimes, reserving seats, API response, and digital pass.',
      specialAction: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 font-bold block mb-1">Project Milestone Instructions</strong>
          Follow each phase below to complete the full-stack MERN application. Mark each checkpoint as complete to track your overall project progress on SkillWallet.
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step) => {
          const isDone = completedSteps.includes(step.num);
          return (
            <div
              key={step.num}
              className={`p-4 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStep(step.num)}
                    className="mt-0.5 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {isDone ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">Step {step.num}.</span>
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {isDone && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider shrink-0">
                    Completed
                  </span>
                )}
              </div>

              {step.code && (
                <div className="mt-3 bg-slate-900 rounded-lg p-3 text-[11px] font-mono text-slate-200 overflow-x-auto border border-slate-800">
                  <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1">
                    <Terminal className="w-3 h-3" /> Implementation snippet:
                  </div>
                  <pre>{step.code}</pre>
                </div>
              )}

              {step.specialAction && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-blue-900">
                    <Film className="w-4 h-4 text-blue-600" />
                    <span>Watch or test the interactive demo video directly in this hub.</span>
                  </div>
                  <button
                    onClick={onOpenDemo}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0"
                  >
                    Watch Demo Video →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
