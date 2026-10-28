import React, { useState } from 'react';
import { Movie, Seat, BookingTicket } from '../types';
import { SAMPLE_MOVIES } from '../data/projectData';
import { Film, Calendar, Clock, MapPin, CheckCircle2, Ticket, QrCode, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

interface InteractiveBookingAppProps {
  initialMovieId?: string;
  initialShowtimeId?: string;
  onBookingComplete?: (ticket: BookingTicket) => void;
  simplified?: boolean;
}

export const InteractiveBookingApp: React.FC<InteractiveBookingAppProps> = ({
  initialMovieId = 'mov-1',
  initialShowtimeId = 'st-2',
  onBookingComplete,
  simplified = false,
}) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie>(
    SAMPLE_MOVIES.find((m) => m.id === initialMovieId) || SAMPLE_MOVIES[0]
  );
  const [selectedShowtime, setSelectedShowtime] = useState(
    selectedMovie.showtimes.find((st) => st.id === initialShowtimeId) || selectedMovie.showtimes[0]
  );
  const [step, setStep] = useState<'details' | 'seats' | 'checkout' | 'ticket'>('seats');

  // Generate 48 seats (Rows A to F, 8 seats per row)
  const [seats, setSeats] = useState<Seat[]>(() => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const list: Seat[] = [];
    rows.forEach((row, rowIndex) => {
      for (let num = 1; num <= 8; num++) {
        const isVIP = row === 'E' || row === 'F';
        // Mock pre-reserved seats for realistic look
        const isReserved =
          (row === 'B' && (num === 3 || num === 4)) ||
          (row === 'C' && num === 7) ||
          (row === 'D' && (num === 2 || num === 5));
        list.push({
          id: `${row}${num}`,
          row,
          number: num,
          type: isVIP ? 'vip' : 'regular',
          price: isVIP ? 18.0 : 14.5,
          status: isReserved ? 'reserved' : 'available',
        });
      }
    });
    return list;
  });

  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(['E4', 'E5']);
  const [customerName, setCustomerName] = useState('Neha Sahin');
  const [customerEmail, setCustomerEmail] = useState('sahineha1575@gmail.com');
  const [ticketData, setTicketData] = useState<BookingTicket | null>(null);

  const toggleSeat = (seatId: string) => {
    const targetSeat = seats.find((s) => s.id === seatId);
    if (!targetSeat || targetSeat.status === 'reserved') return;

    if (selectedSeatIds.includes(seatId)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seatId));
    } else {
      if (selectedSeatIds.length >= 6) {
        return; // Max 6 seats limit
      }
      setSelectedSeatIds((prev) => [...prev, seatId]);
    }
  };

  const selectedSeatsObj = seats.filter((s) => selectedSeatIds.includes(s.id));
  const subtotal = selectedSeatsObj.reduce((acc, curr) => acc + curr.price, 0);
  const convenienceFee = selectedSeatIds.length > 0 ? 2.5 : 0;
  const totalAmount = subtotal + convenienceFee;

  const handleConfirmBooking = () => {
    const newTicket: BookingTicket = {
      bookingId: `IMOV-${Math.floor(10000 + Math.random() * 90000)}`,
      movieTitle: selectedMovie.title,
      theater: selectedShowtime.theater,
      screen: selectedShowtime.screen,
      showtime: selectedShowtime.time,
      seats: selectedSeatIds,
      totalAmount,
      customerName,
      customerEmail,
      bookingDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      qrCodeSeed: `AUTH_TICKET_${Date.now()}`,
    };

    setTicketData(newTicket);
    setStep('ticket');
    if (onBookingComplete) {
      onBookingComplete(newTicket);
    }
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      {/* IMovies Internal Top App Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-xs tracking-tighter">
            IM
          </div>
          <span className="font-extrabold tracking-tight text-white text-sm">
            IMovies <span className="text-red-500 text-xs font-normal">Cinema Pass</span>
          </span>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setStep('details')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              step === 'details' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Movie
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => setStep('seats')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              step === 'seats' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Seats ({selectedSeatIds.length})
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => selectedSeatIds.length > 0 && setStep('checkout')}
            disabled={selectedSeatIds.length === 0}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              step === 'checkout'
                ? 'bg-red-600 text-white font-semibold'
                : selectedSeatIds.length > 0
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            3. Pay
          </button>
          {ticketData && (
            <>
              <span className="text-slate-600">/</span>
              <button
                onClick={() => setStep('ticket')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  step === 'ticket' ? 'bg-emerald-600 text-white' : 'text-emerald-400'
                }`}
              >
                Ticket Pass
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div className="p-4 sm:p-6 min-h-[440px]">
        {/* STEP 1: MOVIE & SHOWTIME SELECTION */}
        {step === 'details' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-red-500" /> Select Feature Movie & Showtime
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_MOVIES.map((movie) => {
                const isCurrent = movie.id === selectedMovie.id;
                return (
                  <div
                    key={movie.id}
                    onClick={() => {
                      setSelectedMovie(movie);
                      setSelectedShowtime(movie.showtimes[0]);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex gap-3 ${
                      isCurrent
                        ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/50'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-20 h-28 object-cover rounded-lg shrink-0 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white text-sm truncate">{movie.title}</h3>
                        <span className="text-xs font-bold text-amber-400">★ {movie.score}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{movie.synopsis}</p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                        <span>{movie.duration}</span>
                        <span>·</span>
                        <span>{movie.genre.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-500" /> Available Showtimes for {selectedMovie.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedMovie.showtimes.map((st) => {
                  const isStActive = st.id === selectedShowtime.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSelectedShowtime(st)}
                      className={`p-3 rounded-lg text-left border transition-all ${
                        isStActive
                          ? 'border-red-500 bg-red-900/30 ring-1 ring-red-500/50 text-white'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="text-sm font-bold text-white">{st.time}</div>
                      <div className="text-[11px] text-slate-400 truncate">{st.screen}</div>
                      <div className="flex items-center justify-between mt-1 text-xs font-semibold">
                        <span className="text-red-400 text-[10px] uppercase">{st.format}</span>
                        <span className="text-emerald-400">${st.price.toFixed(2)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep('seats')}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg"
              >
                Proceed to Seat Selection →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: INTERACTIVE SEAT GRID MATRIX */}
        {step === 'seats' && (
          <div className="space-y-5">
            {/* Context bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-red-400 font-semibold uppercase tracking-wider">
                  {selectedShowtime.format}
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {selectedMovie.title}
                  <span className="text-xs font-normal text-slate-400">
                    · {selectedShowtime.theater} ({selectedShowtime.screen})
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Showtime:</div>
                <div className="text-sm font-bold text-white">{selectedShowtime.time} Today</div>
              </div>
            </div>

            {/* Curved Screen graphic */}
            <div className="relative py-3 text-center">
              <div className="h-2 w-3/4 mx-auto rounded-full bg-linear-to-r from-transparent via-red-500/80 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.5)] mb-2" />
              <div className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">
                CINEMA SCREEN THIS WAY
              </div>
            </div>

            {/* Seat Matrix Grid */}
            <div className="flex flex-col items-center gap-2.5 py-2 overflow-x-auto">
              {['A', 'B', 'C', 'D', 'E', 'F'].map((rowLetter) => {
                const rowSeats = seats.filter((s) => s.row === rowLetter);
                const isVipRow = rowLetter === 'E' || rowLetter === 'F';
                return (
                  <div key={rowLetter} className="flex items-center gap-2">
                    <span className="w-5 text-right font-mono text-xs text-slate-500 font-semibold">
                      {rowLetter}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Left Block (Seats 1-4) */}
                      <div className="flex items-center gap-1.5">
                        {rowSeats.slice(0, 4).map((seat) => {
                          const isSelected = selectedSeatIds.includes(seat.id);
                          const isReserved = seat.status === 'reserved';
                          return (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeat(seat.id)}
                              disabled={isReserved}
                              title={`${seat.id} (${seat.type.toUpperCase()}) - $${seat.price}`}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded text-[11px] font-mono font-bold transition-all flex items-center justify-center ${
                                isReserved
                                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50'
                                  : isSelected
                                  ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.7)] ring-2 ring-red-400 scale-105'
                                  : isVipRow
                                  ? 'bg-amber-950/40 text-amber-300 border border-amber-700/60 hover:bg-amber-800/40'
                                  : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
                              }`}
                            >
                              {seat.number}
                            </button>
                          );
                        })}
                      </div>

                      {/* Aisle */}
                      <div className="w-5" />

                      {/* Right Block (Seats 5-8) */}
                      <div className="flex items-center gap-1.5">
                        {rowSeats.slice(4, 8).map((seat) => {
                          const isSelected = selectedSeatIds.includes(seat.id);
                          const isReserved = seat.status === 'reserved';
                          return (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeat(seat.id)}
                              disabled={isReserved}
                              title={`${seat.id} (${seat.type.toUpperCase()}) - $${seat.price}`}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded text-[11px] font-mono font-bold transition-all flex items-center justify-center ${
                                isReserved
                                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50'
                                  : isSelected
                                  ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.7)] ring-2 ring-red-400 scale-105'
                                  : isVipRow
                                  ? 'bg-amber-950/40 text-amber-300 border border-amber-700/60 hover:bg-amber-800/40'
                                  : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
                              }`}
                            >
                              {seat.number}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Seat Legend */}
            <div className="flex flex-wrap items-center justify-center gap-5 pt-3 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700" />
                <span>Available ($14.50)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-amber-950/60 border border-amber-700" />
                <span>VIP Row ($18.00)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-red-600 ring-1 ring-red-400" />
                <span className="text-white font-semibold">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-slate-800 text-slate-600 opacity-60" />
                <span>Reserved / Sold</span>
              </div>
            </div>

            {/* Bottom Checkout Strip */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 mt-3">
              <div>
                <div className="text-[11px] text-slate-400">Selected Seats:</div>
                <div className="text-sm font-bold text-white">
                  {selectedSeatIds.length > 0 ? (
                    <span className="text-red-400">{selectedSeatIds.join(', ')}</span>
                  ) : (
                    <span className="text-slate-500 font-normal">None clicked yet (click seats above)</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Total Price:</div>
                  <div className="text-lg font-black text-emerald-400 tabular-nums">
                    ${totalAmount.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  disabled={selectedSeatIds.length === 0}
                  className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md ${
                    selectedSeatIds.length > 0
                      ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Proceed to Checkout ({selectedSeatIds.length}) →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CHECKOUT & PAYMENT */}
        {step === 'checkout' && (
          <div className="max-w-xl mx-auto space-y-6">
            <button
              onClick={() => setStep('seats')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Seat Matrix
            </button>

            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Express Checkout & JWT Auth
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email (for E-Ticket)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Order breakdown */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>
                    {selectedMovie.title} ({selectedSeatIds.length}x tickets)
                  </span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Seats</span>
                  <span className="font-mono text-white">{selectedSeatIds.join(', ')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Convenience Fee & Taxes</span>
                  <span className="font-mono">${convenienceFee.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                  <span>Total Amount</span>
                  <span className="text-emerald-400 font-mono">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm & Issue Digital Ticket
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DIGITAL TICKET CONFIRMATION PASS */}
        {step === 'ticket' && ticketData && (
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Booking Verified by Express API
              </div>
              <h3 className="text-lg font-bold text-white">Your Cinema Pass is Ready!</h3>
              <p className="text-xs text-slate-400">Show this digital QR ticket at the cinema gate.</p>
            </div>

            {/* Stylized Cinema Ticket Card */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="bg-red-600 p-4 text-white">
                <div className="flex items-center justify-between text-xs opacity-90 font-mono">
                  <span>IMOVIES OFFICIAL PASS</span>
                  <span className="font-bold">{ticketData.bookingId}</span>
                </div>
                <div className="text-xl font-black mt-1">{ticketData.movieTitle}</div>
                <div className="text-xs opacity-90 mt-0.5">{ticketData.theater}</div>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400">Date & Showtime</div>
                    <div className="font-bold text-white">{ticketData.bookingDate} · {ticketData.showtime}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Auditorium Screen</div>
                    <div className="font-bold text-white">{ticketData.screen}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Allocated Seats</div>
                    <div className="font-bold text-amber-300 font-mono text-sm">
                      {ticketData.seats.join(', ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Total Paid</div>
                    <div className="font-bold text-emerald-400 font-mono text-sm">
                      ${ticketData.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Perforated separator */}
                <div className="border-t border-dashed border-slate-700 relative my-2">
                  <div className="absolute -left-7 -top-2.5 w-5 h-5 rounded-full bg-slate-950 border-r border-slate-700" />
                  <div className="absolute -right-7 -top-2.5 w-5 h-5 rounded-full bg-slate-950 border-l border-slate-700" />
                </div>

                {/* QR Code & Barcode Mock */}
                <div className="flex items-center justify-between gap-4 pt-1">
                  <div className="space-y-1">
                    <div className="text-xs text-slate-300 font-semibold">{ticketData.customerName}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate max-w-[160px]">
                      {ticketData.customerEmail}
                    </div>
                    <div className="text-[10px] text-emerald-400">Status: Confirmed & Synced</div>
                  </div>

                  <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                    <QrCode className="w-14 h-14 text-slate-950" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep('seats')}
                className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Book Another Seat
              </button>
              <button
                onClick={() => alert(`Ticket ${ticketData.bookingId} downloaded to device!`)}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white transition-colors"
              >
                Download PDF Pass
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
