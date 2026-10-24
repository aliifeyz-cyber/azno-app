import React, { useState } from 'react';
import { CommunityPost, ReactionType } from '../../data/types';
import { toPersianDigits } from '../../lib/persianDigits';

interface PostItemProps {
  post: CommunityPost;
  onReaction: (reaction: ReactionType) => void;
  onOpenComments: () => void;
  onReport: () => void;
  onBlockUser: () => void;
}

export const PostItem: React.FC<PostItemProps> = ({
  post,
  onReaction,
  onOpenComments,
  onReport,
  onBlockUser,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 transition-all">
      {/* Top author row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#2F7D6D] flex items-center justify-center font-bold text-xs">
            {post.authorAnonName.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-800">{post.authorAnonName}</span>
              {post.isMe && (
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.2 rounded-md">
                  من
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 block">{post.timeAgo}</span>
          </div>
        </div>

        {/* Menu (Report / Block) */}
        {!post.isMe && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 p-1 text-sm rounded-lg"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute left-0 top-6 bg-white border border-gray-200 rounded-xl shadow-none p-1.5 z-20 w-32 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onReport();
                  }}
                  className="w-full text-right px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  گزارش محتوا
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onBlockUser();
                  }}
                  className="w-full text-right px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  مسدود کردن کاربر
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap my-2.5">
        {post.content}
      </p>

      {/* Footer: Reactions and Comments */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
        {/* Reaction Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onReaction('support')}
            className={`px-2 py-1 rounded-xl text-[11px] flex items-center gap-1 border transition-colors ${
              post.myReaction === 'support'
                ? 'border-[#2F7D6D] bg-emerald-50 text-[#2F7D6D] font-bold'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>👏 حمایت</span>
            <span>{toPersianDigits(post.reactionsCount.support)}</span>
          </button>

          <button
            type="button"
            onClick={() => onReaction('proud')}
            className={`px-2 py-1 rounded-xl text-[11px] flex items-center gap-1 border transition-colors ${
              post.myReaction === 'proud'
                ? 'border-amber-400 bg-amber-50 text-amber-700 font-bold'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>⭐ افتخار</span>
            <span>{toPersianDigits(post.reactionsCount.proud)}</span>
          </button>

          <button
            type="button"
            onClick={() => onReaction('empathy')}
            className={`px-2 py-1 rounded-xl text-[11px] flex items-center gap-1 border transition-colors ${
              post.myReaction === 'empathy'
                ? 'border-teal-400 bg-teal-50 text-teal-700 font-bold'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>❤️ همدلی</span>
            <span>{toPersianDigits(post.reactionsCount.empathy)}</span>
          </button>
        </div>

        {/* Comments trigger */}
        <button
          type="button"
          onClick={onOpenComments}
          className="text-[11px] text-gray-500 hover:text-gray-800 flex items-center gap-1"
        >
          <span>دیدگاه‌ها ({toPersianDigits(post.commentsCount)})</span>
        </button>
      </div>
    </div>
  );
};
