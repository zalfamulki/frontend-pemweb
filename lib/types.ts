// ── User ─────────────────────────────────────────────────────
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'player' | 'admin';
  avatar?: string;
  trust_score: number;
  reputation: number;
  is_online?: number;
  last_seen?: string;
  created_at?: string;
}

// ── News ─────────────────────────────────────────────────────
export interface News {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  is_hoax: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published' | 'archived';
  created_by: number;
  created_by_name?: string;
  total_votes?: number;
  fact_votes?: number;
  hoax_votes?: number;
  created_at?: string;
}

// ── Room ─────────────────────────────────────────────────────
export interface Room {
  id: number;
  name: string;
  code: string;
  host_id: number;
  host_name?: string;
  news_id?: number;
  news_title?: string;
  max_players: number;
  player_count?: number;
  is_private: number;
  status: 'waiting' | 'active' | 'closed';
  created_at?: string;
}

// ── Message ──────────────────────────────────────────────────
export interface Message {
  id?: number;
  roomId?: number;
  userId?: number;
  username?: string;
  avatar?: string;
  content: string;
  messageType?: 'text' | 'system' | 'vote_action';
  type?: 'system';
  timestamp?: string | Date;
}

// ── Vote ─────────────────────────────────────────────────────
export interface VoteResult {
  isCorrect: boolean;
  correctAnswer: 'fact' | 'hoax';
  pointsEarned: number;
  explanation: string;
  trust_score?: number;
  reputation?: number;
}

// ── Score ────────────────────────────────────────────────────
export interface LeaderboardEntry {
  id: number;
  username: string;
  avatar?: string;
  trust_score: number;
  reputation: number;
  total_votes: number;
  correct_votes: number;
  total_points: number;
  accuracy?: number;
}

export interface RoomScore {
  id: number;
  username: string;
  avatar?: string;
  room_points: number;
  correct_votes: number;
  total_votes: number;
}

// ── API Response ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

// ── Auth ─────────────────────────────────────────────────────
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  initAuth: () => void;
}
