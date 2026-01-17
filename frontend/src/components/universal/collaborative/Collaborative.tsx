/**
 * Collaborative Components
 * User presence, comments, mentions, sharing
 */

'use client';

import React, { useState } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

// ========== USER PRESENCE ==========
export interface User {
  id: string;
  name: string;
  avatar?: string;
  status?: 'online' | 'away' | 'offline';
}

export function UserPresence({
  id,
  users,
  maxDisplay = 5,
  onUserClick,
}: {
  id: string;
  users: User[];
  maxDisplay?: number;
  onUserClick?: (user: User) => void;
}) {
  const { track } = useEventTracking('UserPresence', id);

  const handleUserClick = (user: User) => {
    track('user_click', user.id);
    onUserClick?.(user);
  };

  const displayUsers = users.slice(0, maxDisplay);
  const remaining = users.length - maxDisplay;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {displayUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => handleUserClick(user)}
            className="relative w-8 h-8 rounded-full border-2 border-white hover:z-10 transition-transform hover:scale-110"
            title={user.name}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Status indicator */}
            {user.status && (
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                  user.status === 'online' ? 'bg-green-500' :
                  user.status === 'away' ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`}
              />
            )}
          </button>
        ))}
      </div>

      {remaining > 0 && (
        <div className="ml-2 text-sm text-gray-500">
          +{remaining} more
        </div>
      )}
    </div>
  );
}

// ========== COMMENTS ==========
export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: Date;
  replies?: Comment[];
}

export function CommentThread({
  id,
  comments,
  onAddComment,
  onReply,
  onDelete,
}: {
  id: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onReply?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
}) {
  const { track } = useEventTracking('CommentThread', id);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    track('add_comment', null, { length: newComment.length });
    onAddComment(newComment);
    setNewComment('');
  };

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return;

    track('reply', commentId, { length: replyContent.length });
    onReply?.(commentId, replyContent);
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleDelete = (commentId: string) => {
    track('delete', commentId);
    onDelete?.(commentId);
  };

  const renderComment = (comment: Comment, level = 0) => (
    <div key={comment.id} className={`${level > 0 ? 'ml-8 mt-2' : 'mb-4'}`}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {comment.user.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">{comment.user.name}</span>
              <span className="text-xs text-gray-500">
                {comment.timestamp.toLocaleString()}
              </span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>

          <div className="flex gap-3 mt-1 text-sm">
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="text-blue-500 hover:text-blue-700"
            >
              Reply
            </button>
            {onDelete && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>

          {/* Reply form */}
          {replyingTo === comment.id && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1.5 text-sm border rounded-lg"
                autoFocus
              />
              <button
                onClick={() => handleReply(comment.id)}
                className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
              >
                Reply
              </button>
              <button
                onClick={() => setReplyingTo(null)}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Render replies */}
          {comment.replies?.map((reply) => renderComment(reply, level + 1))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>

      {/* New comment */}
      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="w-full px-3 py-2 border rounded-lg resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div>{comments.map((comment) => renderComment(comment))}</div>
    </div>
  );
}

// ========== MENTIONS ==========
export function MentionInput({
  id,
  value,
  onChange,
  users,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  users: User[];
  placeholder?: string;
}) {
  const { track } = useEventTracking('MentionInput', id);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const position = e.target.selectionStart;

    onChange(text);
    setCursorPosition(position);

    // Check for @ mention
    const beforeCursor = text.slice(0, position);
    const match = beforeCursor.match(/@(\w*)$/);

    if (match) {
      setMentionSearch(match[1]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleMention = (user: User) => {
    track('mention', user.id);

    const beforeMention = value.slice(0, cursorPosition).replace(/@\w*$/, '');
    const afterMention = value.slice(cursorPosition);
    const newValue = `${beforeMention}@${user.name} ${afterMention}`;

    onChange(newValue);
    setShowSuggestions(false);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        rows={4}
        className="w-full px-3 py-2 border rounded-lg resize-none"
      />

      {showSuggestions && filteredUsers.length > 0 && (
        <div className="absolute bottom-full mb-1 w-full bg-white border rounded-lg shadow-lg max-h-40 overflow-auto z-10">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => handleMention(user)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm">{user.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== SHARE DIALOG ==========
export function ShareDialog({
  id,
  isOpen,
  onClose,
  onShare,
}: {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onShare: (method: string, data: any) => void;
}) {
  const { track } = useEventTracking('ShareDialog', id);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');

  const handleEmailShare = () => {
    track('share', 'email', { permission });
    onShare('email', { email, permission });
    setEmail('');
  };

  const handleCopyLink = () => {
    track('share', 'link', { permission });
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    onShare('link', { link, permission });
  };

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Share</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {/* Email share */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Invite by email</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="view">View</option>
                <option value="edit">Edit</option>
              </select>
            </div>
            <button
              onClick={handleEmailShare}
              disabled={!email}
              className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Send Invite
            </button>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={handleCopyLink}
              className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <span>🔗</span>
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
