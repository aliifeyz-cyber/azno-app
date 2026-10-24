import React, { createContext, useContext, useState, useEffect } from 'react';
import { CommunityGroup, CommunityPost, CommunityComment, CommunityReport, ReactionType } from '../data/types';
import { communityRepository } from '../data/repositories/communityRepository';
import { filterContent } from '../domain/contentFilter';

interface CommunityContextType {
  groups: CommunityGroup[];
  activeGroupId: string | null;
  setActiveGroupId: (id: string | null) => void;
  posts: CommunityPost[];
  loading: boolean;
  blockedUsers: string[];
  reports: CommunityReport[];
  joinGroup: (id: string) => Promise<void>;
  leaveGroup: (id: string) => Promise<void>;
  createPost: (content: string) => Promise<{ success: boolean; error?: string }>;
  toggleReaction: (postId: string, reaction: ReactionType) => Promise<void>;
  getComments: (postId: string) => Promise<CommunityComment[]>;
  addComment: (postId: string, content: string) => Promise<{ success: boolean; error?: string }>;
  reportContent: (targetType: 'post' | 'comment', targetId: string, reason: string, reasonLabel: string, preview: string) => Promise<void>;
  blockUser: (anonName: string) => Promise<void>;
  unblockUser: (anonName: string) => Promise<void>;
  dismissReport: (reportId: string) => Promise<void>;
  removeReportedContent: (reportId: string) => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | null>(null);

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const g = await communityRepository.getGroups();
      const p = await communityRepository.getPosts();
      const b = await communityRepository.getBlockedUsers();
      const r = await communityRepository.getReports();
      setGroups(g);
      setPosts(p);
      setBlockedUsers(b);
      setReports(r);
      if (g.length > 0 && !activeGroupId) {
        setActiveGroupId(g[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const joinGroup = async (groupId: string) => {
    await communityRepository.joinGroup(groupId);
    const updated = await communityRepository.getGroups();
    setGroups(updated);
  };

  const leaveGroup = async (groupId: string) => {
    await communityRepository.leaveGroup(groupId);
    const updated = await communityRepository.getGroups();
    setGroups(updated);
  };

  const createPost = async (content: string): Promise<{ success: boolean; error?: string }> => {
    if (!activeGroupId) return { success: false, error: 'گروه انتخاب نشده است.' };

    const filterResult = filterContent(content);
    if (!filterResult.isAllowed) {
      return { success: false, error: filterResult.reason };
    }

    const currentGroup = groups.find((g) => g.id === activeGroupId);
    const myAnonName = currentGroup?.myAnonName || 'همسفر ناشناس';

    const newPost = await communityRepository.createPost(activeGroupId, content, myAnonName);
    setPosts((prev) => [newPost, ...prev]);
    return { success: true };
  };

  const toggleReaction = async (postId: string, reaction: ReactionType) => {
    const updated = await communityRepository.toggleReaction(postId, reaction);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
  };

  const getComments = async (postId: string) => {
    return communityRepository.getComments(postId);
  };

  const addComment = async (postId: string, content: string): Promise<{ success: boolean; error?: string }> => {
    const filterResult = filterContent(content);
    if (!filterResult.isAllowed) {
      return { success: false, error: filterResult.reason };
    }

    const currentGroup = groups.find((g) => g.id === activeGroupId);
    const myAnonName = currentGroup?.myAnonName || 'همسفر ناشناس';

    await communityRepository.addComment(postId, content, myAnonName);
    // Refresh posts to update comment count
    const updatedPosts = await communityRepository.getPosts();
    setPosts(updatedPosts);
    return { success: true };
  };

  const reportContent = async (targetType: 'post' | 'comment', targetId: string, reason: string, reasonLabel: string, preview: string) => {
    await communityRepository.reportContent({
      targetType,
      targetId,
      reason,
      reasonLabel,
      contentPreview: preview,
    });
    const reps = await communityRepository.getReports();
    setReports(reps);
  };

  const blockUser = async (anonName: string) => {
    await communityRepository.blockUser(anonName);
    const blocked = await communityRepository.getBlockedUsers();
    setBlockedUsers(blocked);
    // Refresh posts
    const p = await communityRepository.getPosts();
    setPosts(p);
  };

  const unblockUser = async (anonName: string) => {
    await communityRepository.unblockUser(anonName);
    const blocked = await communityRepository.getBlockedUsers();
    setBlockedUsers(blocked);
    const p = await communityRepository.getPosts();
    setPosts(p);
  };

  const dismissReport = async (reportId: string) => {
    await communityRepository.dismissReport(reportId);
    const reps = await communityRepository.getReports();
    setReports(reps);
  };

  const removeReportedContent = async (reportId: string) => {
    await communityRepository.removeReportedContent(reportId);
    const reps = await communityRepository.getReports();
    const p = await communityRepository.getPosts();
    setReports(reps);
    setPosts(p);
  };

  return (
    <CommunityContext.Provider
      value={{
        groups,
        activeGroupId,
        setActiveGroupId,
        posts,
        loading,
        blockedUsers,
        reports,
        joinGroup,
        leaveGroup,
        createPost,
        toggleReaction,
        getComments,
        addComment,
        reportContent,
        blockUser,
        unblockUser,
        dismissReport,
        removeReportedContent,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
};
