export interface TaskItem {
  id: string;
  epicId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  complexity: 'Low' | 'Medium' | 'High';
  estimatedHours: number;
}

export interface EpicItem {
  id: string;
  title: string;
  description: string;
  complexity: 'Low' | 'Medium' | 'High';
  duration: string;
  storiesCount: number;
  tasks: TaskItem[];
}

export interface DemoVideoChapter {
  id: string;
  title: string;
  timestampSeconds: number;
  formattedTime: string;
  description: string;
  sceneName: string;
  captionText: string;
}

export interface MovieShowtime {
  id: string;
  theater: string;
  screen: string;
  time: string;
  format: 'IMAX 3D' | 'Dolby Cinema' | 'Standard 2D';
  price: number;
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  genre: string[];
  duration: string;
  rating: string;
  score: number;
  posterUrl: string;
  synopsis: string;
  director: string;
  cast: string[];
  showtimes: MovieShowtime[];
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'regular' | 'vip' | 'accessible';
  price: number;
  status: 'available' | 'reserved' | 'selected';
}

export interface BookingTicket {
  bookingId: string;
  movieTitle: string;
  theater: string;
  screen: string;
  showtime: string;
  seats: string[];
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  qrCodeSeed: string;
}
