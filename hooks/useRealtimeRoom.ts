"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { roomsAPI } from "@/lib/api";
import {
  emitJoinRoom,
  emitReady,
  emitSendMessage,
  emitStartGame,
  emitSyncGame,
  emitTyping,
  emitVoteChoice,
  makeClientMessageId,
} from "@/lib/socket";
import type { Message, Room, StoryState } from "@/lib/types";
import { useSocket } from "@/contexts/SocketContext";

const blankState = (roomId: number): StoryState => ({
  roomId,
  phase: "waiting",
  scenario: null,
  timer: 0,
  members: [],
  hostId: null,
  ready: {},
  votes: { byUser: {}, tally: {} },
  myVote: null,
  lastResult: null,
  ending: null,
});

export function useRealtimeRoom(roomId: number, userId?: number) {
  const { socket, connected } = useSocket();
  const [room, setRoom] = useState<Room | null>(null);
  const [state, setState] = useState<StoryState>(() => blankState(roomId));
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<number, string>>({});
  const seenMessages = useRef(new Set<string>());
  const typingTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const addMessage = useCallback((message: Message) => {
    const key = String(message.id || message.clientMessageId || `${message.userId}-${message.timestamp}-${message.content}`);
    if (seenMessages.current.has(key)) return;
    seenMessages.current.add(key);
    setMessages((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    roomsAPI.join(roomId)
      .then(() => roomsAPI.getById(roomId))
      .then((res) => {
        if (cancelled) return;
        setRoom(res.data.room);
        setState((prev) => ({
          ...prev,
          hostId: res.data.room?.host_id || prev.hostId,
          members: res.data.members || prev.members,
        }));
        seenMessages.current.clear();
        const initialMessages = (res.data.messages || []).map((message: Message & { created_at?: string }) => ({
          ...message,
          roomId,
          userId: message.userId || (message as unknown as { user_id?: number }).user_id,
          messageType: message.messageType || (message as unknown as { message_type?: Message["messageType"] }).message_type,
          timestamp: message.timestamp || message.created_at,
        }));
        initialMessages.forEach(addMessage);
      })
      .catch(() => toast.error("Room tidak ditemukan"));
    return () => { cancelled = true; };
  }, [addMessage, roomId]);

  useEffect(() => {
    if (!socket || !roomId) return;

    emitJoinRoom(roomId);
    emitSyncGame(roomId);

    const syncState = (payload: StoryState) => {
      if (payload.roomId !== roomId) return;
      setState((prev) => ({ ...prev, ...payload }));
      setRoom((prev) => payload.hostId && prev ? { ...prev, host_id: payload.hostId, status: payload.phase === "waiting" ? "waiting" : payload.phase === "ended" ? "closed" : "active" } : prev);
    };

    const onMessage = (message: Message & { user_id?: number; message_type?: Message["messageType"]; created_at?: string }) => {
      if (message.roomId === roomId) {
        addMessage({
          ...message,
          userId: message.userId || message.user_id,
          messageType: message.messageType || message.message_type,
          timestamp: message.timestamp || message.created_at,
        });
      }
    };
    const onTyping = (payload: { roomId: number; userId: number; username: string; isTyping: boolean }) => {
      if (payload.roomId !== roomId || payload.userId === userId) return;
      window.clearTimeout(typingTimers.current[payload.userId]);
      setTypingUsers((prev) => {
        const next = { ...prev };
        if (payload.isTyping) next[payload.userId] = payload.username;
        else delete next[payload.userId];
        return next;
      });
      if (payload.isTyping) {
        typingTimers.current[payload.userId] = setTimeout(() => {
          setTypingUsers((prev) => {
            const next = { ...prev };
            delete next[payload.userId];
            return next;
          });
        }, 1400);
      }
    };
    const onHostChanged = (payload: { roomId: number; hostId: number }) => {
      if (payload.roomId === roomId) setRoom((prev) => prev ? { ...prev, host_id: payload.hostId } : prev);
    };
    const onTimer = (payload: { roomId: number; remaining: number }) => {
      if (payload.roomId === roomId) setState((prev) => ({ ...prev, timer: payload.remaining }));
    };
    const onError = (payload: { message?: string }) => toast.error(payload.message || "Socket error");

    socket.on("update_story_state", syncState);
    socket.on("room_state", syncState);
    socket.on("start_game", syncState);
    socket.on("next_story", syncState);
    socket.on("game_end", syncState);
    socket.on("receive_message", onMessage);
    socket.on("typing", onTyping);
    socket.on("host_changed", onHostChanged);
    socket.on("update_timer", onTimer);
    socket.on("socket_error", onError);

    return () => {
      socket.off("update_story_state", syncState);
      socket.off("room_state", syncState);
      socket.off("start_game", syncState);
      socket.off("next_story", syncState);
      socket.off("game_end", syncState);
      socket.off("receive_message", onMessage);
      socket.off("typing", onTyping);
      socket.off("host_changed", onHostChanged);
      socket.off("update_timer", onTimer);
      socket.off("socket_error", onError);
    };
  }, [addMessage, roomId, socket, userId]);

  useEffect(() => {
    if (connected && roomId) {
      emitJoinRoom(roomId);
      emitSyncGame(roomId);
    }
  }, [connected, roomId]);

  const actions = useMemo(() => ({
    setReady: (ready: boolean) => emitReady(roomId, ready),
    sendMessage: (content: string) => {
      const clientMessageId = makeClientMessageId();
      emitSendMessage(roomId, content, clientMessageId);
    },
    setTyping: (isTyping: boolean) => emitTyping(roomId, isTyping),
    startGame: () => emitStartGame(roomId),
    vote: (scenarioId: number, choiceId: number) => emitVoteChoice(roomId, scenarioId, choiceId),
    sync: () => emitSyncGame(roomId),
  }), [roomId]);

  return {
    room,
    state,
    messages,
    typingUsers: Object.values(typingUsers),
    connected,
    actions,
  };
}
