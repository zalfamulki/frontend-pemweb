import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;
let activeToken: string | null = null;

export const initSocket = (token: string): Socket => {
  if (socket && activeToken === token) {
    if (!socket.connected) socket.connect();
    return socket;
  }

  if (socket) socket.disconnect();
  activeToken = token;
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 4000,
    timeout: 10000,
    autoConnect: true,
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
  socket = null;
  activeToken = null;
};

export const makeClientMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const emitJoinRoom = (roomId: number) => socket?.emit('user_join', { roomId });
export const emitLeaveRoom = (roomId: number) => socket?.emit('user_leave', { roomId });
export const emitReady = (roomId: number, ready: boolean) => socket?.emit('player_ready', { roomId, ready });
export const emitSendMessage = (roomId: number, content: string, clientMessageId = makeClientMessageId()) =>
  socket?.emit('send_message', { roomId, content, clientMessageId });
export const emitTyping = (roomId: number, isTyping: boolean) => socket?.emit('typing', { roomId, isTyping });
export const emitStartGame = (roomId: number) => socket?.emit('start_game', { roomId });
export const emitVoteChoice = (roomId: number, scenarioId: number, choiceId: number) =>
  socket?.emit('vote_decision', { roomId, scenarioId, choiceId });
export const emitSyncGame = (roomId: number) => socket?.emit('player:sync', { roomId });
