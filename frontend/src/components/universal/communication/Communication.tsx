/**
 * Communication & Real-Time Components
 * Chat, video call, notifications, live feed, presence
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

// ========== CHAT INTERFACE ==========
export interface Message {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  type?: 'text' | 'image' | 'file';
  reactions?: Record<string, string[]>;
}

export function ChatInterface({
  id,
  messages,
  currentUserId,
  onSendMessage,
  onReaction,
}: {
  id: string;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
}) {
  const { track } = useEventTracking('ChatInterface', id);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    track('send_message', null, { length: input.length });
    onSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.userId === currentUserId;

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
            >
              {!isOwnMessage && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                  {message.userName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : ''}`}>
                {!isOwnMessage && (
                  <div className="text-sm font-medium mb-1">{message.userName}</div>
                )}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>

                {/* Reactions */}
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {Object.entries(message.reactions).map(([emoji, users]) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          track('add_reaction', message.id, { emoji });
                          onReaction?.(message.id, emoji);
                        }}
                        className="px-2 py-0.5 bg-gray-100 rounded-full text-xs"
                      >
                        {emoji} {users.length}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== LIVE FEED ==========
export interface FeedItem {
  id: string;
  type: 'post' | 'update' | 'notification';
  author: { id: string; name: string; avatar?: string };
  content: string;
  timestamp: Date;
  likes?: number;
  comments?: number;
}

export function LiveFeed({
  id,
  items,
  onLoadMore,
  onLike,
  onComment,
}: {
  id: string;
  items: FeedItem[];
  onLoadMore?: () => void;
  onLike?: (itemId: string) => void;
  onComment?: (itemId: string) => void;
}) {
  const { track } = useEventTracking('LiveFeed', id);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const handleLike = (itemId: string) => {
    track('like', itemId);
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
    onLike?.(itemId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id} className="p-4">
            {/* Author */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {item.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{item.author.name}</div>
                <div className="text-sm text-gray-500">
                  {item.timestamp.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-3">{item.content}</div>

            {/* Actions */}
            <div className="flex gap-4 text-sm text-gray-600">
              <button
                onClick={() => handleLike(item.id)}
                className={`flex items-center gap-1 hover:text-blue-500 ${
                  likedItems.has(item.id) ? 'text-blue-500 font-semibold' : ''
                }`}
              >
                ❤️ {(item.likes || 0) + (likedItems.has(item.id) ? 1 : 0)}
              </button>
              <button
                onClick={() => {
                  track('comment_click', item.id);
                  onComment?.(item.id);
                }}
                className="flex items-center gap-1 hover:text-blue-500"
              >
                💬 {item.comments || 0}
              </button>
              <button
                onClick={() => track('share_click', item.id)}
                className="flex items-center gap-1 hover:text-blue-500"
              >
                🔗 Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {onLoadMore && (
        <button
          onClick={() => {
            track('load_more', null);
            onLoadMore();
          }}
          className="w-full px-4 py-3 text-blue-500 hover:bg-blue-50 transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
}

// ========== NOTIFICATION CENTER ==========
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: { label: string; onClick: () => void };
}

export function NotificationCenter({
  id,
  notifications,
  onMarkRead,
  onClearAll,
}: {
  id: string;
  notifications: Notification[];
  onMarkRead: (notificationId: string) => void;
  onClearAll: () => void;
}) {
  const { track } = useEventTracking('NotificationCenter', id);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter((n) =>
    filter === 'unread' ? !n.read : true
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const iconMap = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 text-sm rounded ${
              filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            Unread
          </button>
          {unreadCount > 0 && (
            <button
              onClick={() => {
                track('clear_all', null);
                onClearAll();
              }}
              className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="max-h-96 overflow-y-auto divide-y">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No notifications</div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => {
                track('notification_click', notification.id);
                onMarkRead(notification.id);
              }}
            >
              <div className="flex gap-3">
                <div className="text-2xl">{iconMap[notification.type]}</div>
                <div className="flex-1">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {notification.timestamp.toLocaleString()}
                  </div>
                  {notification.action && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        track('notification_action', notification.id);
                        notification.action!.onClick();
                      }}
                      className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ========== VIDEO CALL INTERFACE ==========
export function VideoCallInterface({
  id,
  participants,
  localStream,
  onMute,
  onVideoToggle,
  onEndCall,
}: {
  id: string;
  participants: Array<{ id: string; name: string; videoStream?: MediaStream }>;
  localStream?: MediaStream;
  onMute: () => void;
  onVideoToggle: () => void;
  onEndCall: () => void;
}) {
  const { track } = useEventTracking('VideoCallInterface', id);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const handleMute = () => {
    track('toggle_mute', !isMuted);
    setIsMuted(!isMuted);
    onMute();
  };

  const handleVideoToggle = () => {
    track('toggle_video', !isVideoOn);
    setIsVideoOn(!isVideoOn);
    onVideoToggle();
  };

  const handleEndCall = () => {
    track('end_call', null);
    onEndCall();
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden h-[600px] flex flex-col">
      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-2 gap-2 p-4">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="bg-gray-800 rounded-lg relative overflow-hidden"
          >
            {/* Video placeholder */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {participant.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
              {participant.name}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 p-4 bg-gray-800">
        <button
          onClick={handleMute}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isMuted ? 'bg-red-500' : 'bg-gray-600'
          } text-white hover:opacity-80 transition-opacity`}
        >
          {isMuted ? '🔇' : '🎤'}
        </button>

        <button
          onClick={handleVideoToggle}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            !isVideoOn ? 'bg-red-500' : 'bg-gray-600'
          } text-white hover:opacity-80 transition-opacity`}
        >
          {isVideoOn ? '📹' : '📵'}
        </button>

        <button
          onClick={handleEndCall}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          ☎️
        </button>

        <button
          onClick={() => track('share_screen', null)}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-600 text-white hover:opacity-80 transition-opacity"
        >
          🖥️
        </button>
      </div>
    </div>
  );
}

// ========== ACTIVITY FEED ==========
export interface Activity {
  id: string;
  user: { name: string; avatar?: string };
  action: string;
  target: string;
  timestamp: Date;
  icon?: string;
}

export function ActivityFeed({
  id,
  activities,
  realTime = true,
}: {
  id: string;
  activities: Activity[];
  realTime?: boolean;
}) {
  const { track } = useEventTracking('ActivityFeed', id);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Recent Activity</h3>
        {realTime && (
          <span className="flex items-center gap-2 text-sm text-green-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </span>
        )}
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm flex-shrink-0">
              {activity.icon || activity.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-medium">{activity.user.name}</span>{' '}
                {activity.action}{' '}
                <span className="font-medium">{activity.target}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {activity.timestamp.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
