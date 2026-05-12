import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const initSocket = (token: string): Socket => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => console.log('🟢 Socket connected:', socket?.id));
  socket.on('disconnect', (reason) => console.log('🔴 Socket disconnected:', reason));
  socket.on('connect_error', (err) => console.error('Socket error:', err.message));

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// ── Emit helpers ─────────────────────────────────────────────
export const emitJoinRoom = (roomId: number) =>
  socket?.emit('user_join', { roomId });

export const emitLeaveRoom = (roomId: number) =>
  socket?.emit('user_leave', { roomId });

export const emitSendMessage = (roomId: number, content: string, messageType = 'text') =>
  socket?.emit('send_message', { roomId, content, messageType });

export const emitTyping = (roomId: number, isTyping: boolean) =>
  socket?.emit('typing', { roomId, isTyping });

export const emitStartGame = (roomId: number, newsId: number) =>
  socket?.emit('start_game', { roomId, newsId });

export const emitVoteNews = (roomId: number, newsId: number, vote: 'fact' | 'hoax') =>
  socket?.emit('vote_news', { roomId, newsId, vote });

export const emitUpdateScore = (roomId: number) =>
  socket?.emit('update_score', { roomId });

export const emitEndGame = (roomId: number) =>
  socket?.emit('end_game', { roomId });
