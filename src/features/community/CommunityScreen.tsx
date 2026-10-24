import React, { useState } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { toPersianDigits } from '../../lib/persianDigits';
import { PostItem } from './PostItem';
import { ModerationQueueModal } from './ModerationQueueModal';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { CommunityComment } from '../../data/types';

export const CommunityScreen: React.FC = () => {
  const {
    groups,
    activeGroupId,
    setActiveGroupId,
    posts,
    createPost,
    toggleReaction,
    joinGroup,
    leaveGroup,
    getComments,
    addComment,
    reportContent,
    blockUser,
    reports,
  } = useCommunity();
  const { heroName } = useAuth();
  const { t } = useContent();

  const [postText, setPostText] = useState('');
  const [postError, setPostError] = useState<string | null>(null);
  const [submittingPost, setSubmittingPost] = useState(false);

  // Comments state
  const [activePostIdForComments, setActivePostIdForComments] = useState<string | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);

  // Moderation state
  const [isModerationOpen, setIsModerationOpen] = useState(false);

  // Report modal state
  const [reportTarget, setReportTarget] = useState<{ id: string; type: 'post' | 'comment'; preview: string } | null>(null);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    setSubmittingPost(true);
    setPostError(null);
    try {
      const res = await createPost(postText);
      if (!res.success) {
        setPostError(res.error || 'ارسال پست با خطا مواجه شد.');
      } else {
        setPostText('');
      }
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleOpenComments = async (postId: string) => {
    setActivePostIdForComments(postId);
    const list = await getComments(postId);
    setComments(list);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activePostIdForComments) return;

    setCommentError(null);
    const res = await addComment(activePostIdForComments, commentText);
    if (!res.success) {
      setCommentError(res.error || 'ارسال دیدگاه با خطا مواجه شد.');
    } else {
      setCommentText('');
      const updated = await getComments(activePostIdForComments);
      setComments(updated);
    }
  };

  const handleReportSubmit = (reason: string, reasonLabel: string) => {
    if (!reportTarget) return;
    reportContent(reportTarget.type, reportTarget.id, reason, reasonLabel, reportTarget.preview);
    setReportTarget(null);
  };

  const filteredPosts = posts.filter((p) => p.groupId === activeGroup?.id);

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-4">
      {/* Header with Moderation Queue Access */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800">{t('community.title')}</h2>
        {reports.length > 0 && (
          <button
            type="button"
            onClick={() => setIsModerationOpen(true)}
            className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl"
          >
            نظارت ({toPersianDigits(reports.filter((r) => r.status === 'pending').length)})
          </button>
        )}
      </div>

      {/* Group selector tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {groups.map((group) => {
          const isActive = group.id === activeGroup?.id;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveGroupId(group.id)}
              className={`px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all shrink-0 ${
                isActive
                  ? 'border-[#2F7D6D] bg-[#2F7D6D] text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{group.title}</span>
              <span
                className={`mr-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {toPersianDigits(group.memberCount)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Group Details Card */}
      {activeGroup && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">{activeGroup.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{activeGroup.description}</p>
              <span className="text-[10px] text-gray-400 mt-1 block">
                نام مستعار شما در این گروه: <strong className="text-gray-700">{activeGroup.myAnonName}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => (activeGroup.isMember ? leaveGroup(activeGroup.id) : joinGroup(activeGroup.id))}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors shrink-0 ${
                activeGroup.isMember
                  ? 'border-gray-200 text-gray-500 bg-gray-50 hover:bg-rose-50 hover:text-rose-600'
                  : 'border-[#2F7D6D] bg-emerald-50 text-[#2F7D6D] font-bold'
              }`}
            >
              {activeGroup.isMember ? 'عضو هستید' : '+ پیوستن'}
            </button>
          </div>
        </div>
      )}

      {/* Create Post Box */}
      <form onSubmit={handleCreatePost} className="bg-white rounded-2xl border border-gray-200 p-3.5 space-y-2">
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder={`یک تجربه، دستاورد یا سوال با همسفران «${activeGroup?.title}» به اشتراک بگذار...`}
          rows={3}
          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
        />

        {postError && (
          <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[11px]">
            {postError}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-gray-400">
            نام شما کاملاً ناشناس و حفاظت‌شده نمایش داده می‌شود.
          </span>
          <Button type="submit" size="sm" loading={submittingPost} disabled={!postText.trim()}>
            ارسال به گروه
          </Button>
        </div>
      </form>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <EmptyState
          title="هنوز پستی در این گروه نیست"
          description="اولین نفری باش که تجربه یا سوالش را با بقیه به اشتراک می‌گذارد!"
          heroPose="cheer"
          heroName={heroName}
        />
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onReaction={(r) => toggleReaction(post.id, r)}
              onOpenComments={() => handleOpenComments(post.id)}
              onReport={() =>
                setReportTarget({
                  id: post.id,
                  type: 'post',
                  preview: post.content.slice(0, 80),
                })
              }
              onBlockUser={() => blockUser(post.authorAnonName)}
            />
          ))}
        </div>
      )}

      {/* Comments Sheet */}
      {activePostIdForComments && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 border border-gray-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h4 className="text-sm font-bold text-gray-800">
                دیدگاه‌ها ({toPersianDigits(comments.length)})
              </h4>
              <button
                type="button"
                onClick={() => setActivePostIdForComments(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {comments.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">
                  اولین دیدگاه محبت‌آمیز را شما بنویسید!
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-800">{c.authorAnonName}</span>
                      <span className="text-[10px] text-gray-400">{c.timeAgo}</span>
                    </div>
                    <p className="text-gray-700 leading-normal">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="pt-2 border-t border-gray-100 space-y-2">
              {commentError && (
                <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[11px]">
                  {commentError}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="دیدگاه خود را بنویسید..."
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
                />
                <Button type="submit" size="sm" disabled={!commentText.trim()}>
                  ارسال
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 mb-2">گزارش محتوای نامناسب</h4>
            <p className="text-xs text-gray-500 mb-4">
              لطفاً دلیل گزارش این پیام را مشخص کنید تا توسط تیم نظارت بررسی شود:
            </p>
            <div className="space-y-2 mb-4">
              {[
                { reason: 'hate_speech', label: 'توهین یا بی‌احترامی' },
                { reason: 'spam_ads', label: 'تبلیغات یا اسپم' },
                { reason: 'contact_info', label: 'ارسال اطلاعات تماس شخصی' },
                { reason: 'encouraging_harm', label: 'تشویق به آسیب یا نقض قوانین' },
              ].map((r) => (
                <button
                  key={r.reason}
                  type="button"
                  onClick={() => handleReportSubmit(r.reason, r.label)}
                  className="w-full text-right px-3 py-2 text-xs rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-gray-700 transition-colors"
                >
                  {r.label}
                </button>
              ))}
            </div>
            <Button variant="ghost" fullWidth size="sm" onClick={() => setReportTarget(null)}>
              انصراف
            </Button>
          </div>
        </div>
      )}

      {/* Moderation Queue Modal */}
      <ModerationQueueModal
        isOpen={isModerationOpen}
        onClose={() => setIsModerationOpen(false)}
      />
    </div>
  );
};
