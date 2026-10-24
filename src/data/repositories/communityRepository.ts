import { CommunityGroup, CommunityPost, CommunityComment, CommunityReport, ReactionType } from '../types';
import { StorageAdapter } from '../storage/storageAdapter';
import { localStorageAdapter } from '../storage/localStorageAdapter';

export interface CommunityRepository {
  getGroups(): Promise<CommunityGroup[]>;
  joinGroup(groupId: string): Promise<void>;
  leaveGroup(groupId: string): Promise<void>;
  getPosts(groupId?: string): Promise<CommunityPost[]>;
  createPost(groupId: string, content: string, authorAnonName: string): Promise<CommunityPost>;
  toggleReaction(postId: string, reaction: ReactionType): Promise<CommunityPost>;
  getComments(postId: string): Promise<CommunityComment[]>;
  addComment(postId: string, content: string, authorAnonName: string): Promise<CommunityComment>;
  reportContent(report: Omit<CommunityReport, 'id' | 'createdAtText' | 'status'>): Promise<void>;
  getReports(): Promise<CommunityReport[]>;
  dismissReport(reportId: string): Promise<void>;
  removeReportedContent(reportId: string): Promise<void>;
  getBlockedUsers(): Promise<string[]>;
  blockUser(anonName: string): Promise<void>;
  unblockUser(anonName: string): Promise<void>;
}

const STORAGE_KEYS = {
  GROUPS: 'community:groups',
  POSTS: 'community:posts',
  COMMENTS: 'community:comments',
  REPORTS: 'community:reports',
  BLOCKED: 'community:blocked',
};

const INITIAL_GROUPS: CommunityGroup[] = [
  {
    id: 'g1',
    title: 'سحرخیزی و انرژی صبحگاهی',
    slug: 'early-birds',
    description: 'برای کسانی که می‌خواهند روزشان را قبل از بقیه با آرامش و هدف شروع کنند.',
    memberCount: 248,
    isMember: true,
    myAnonName: 'جنگجوی سپیده‌دم',
    rules: 'احترام به اعضا، عدم قضاوت، تمرکز بر تجربیات شخصی و تشویق همدیگر.',
  },
  {
    id: 'g2',
    title: 'ترک دخانیات و پاکی',
    slug: 'quit-smoking',
    description: 'همراهی در روزهای سخت ترک و جشن گرفتن روزهای پاکی و تنفس عمیق.',
    memberCount: 412,
    isMember: true,
    myAnonName: 'نفس تازه',
    rules: 'اشتراک راهکارهای گذر از ولع، مهربانی با خود در صورت لغزش و عدم نام بردن از برندها.',
  },
  {
    id: 'g3',
    title: 'مطالعه و یادگیری روزانه',
    slug: 'daily-reading',
    description: 'حتی ۱۰ صفحه در روز؛ گام‌های کوچک برای ذهنی بازتر.',
    memberCount: 185,
    isMember: false,
    myAnonName: 'همسفر کتاب',
    rules: 'معرفی بخش‌های الهام‌بخش بدون اسپویل و گفت‌وگو درباره آموخته‌ها.',
  },
  {
    id: 'g4',
    title: 'تحرک و ورزش خانگی',
    slug: 'home-workout',
    description: '۲۰ دقیقه تحرک روزانه برای سلامت روح و جسم بدون نیاز به باشگاه.',
    memberCount: 310,
    isMember: false,
    myAnonName: 'قدم استوار',
    rules: 'تمرکز بر پیوستگی نه رکوردشکنی؛ حفظ انگیزه و تبادل حرکات ایمن.',
  },
];

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    groupId: 'g1',
    authorAnonName: 'سیمرغ رها',
    content: 'امروز روز پانزدهم بیداری ساعت ۶ صبح بود. اوایل خیلی سخت بود ولی الان احساس می‌کنم وقت بیشتری برای خودم دارم.',
    timeAgo: '۲ ساعت پیش',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isMe: false,
    reactionsCount: { support: 12, proud: 8, empathy: 3 },
    myReaction: 'support',
    commentsCount: 2,
  },
  {
    id: 'p2',
    groupId: 'g2',
    authorAnonName: 'امید نو',
    content: 'دیروز بعد از یک هفته پاکی یه لحظه لغزیدم، اولش خیلی ناامید شدم ولی پیام مربی یادم انداخت که زمین خوردن پایان مسیر نیست. امروز دوباره شروع کردم.',
    timeAgo: '۵ ساعت پیش',
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    isMe: false,
    reactionsCount: { support: 25, proud: 6, empathy: 19 },
    myReaction: null,
    commentsCount: 4,
  },
  {
    id: 'p3',
    groupId: 'g1',
    authorAnonName: 'جنگجوی سپیده‌دم',
    content: 'دوستان، وقتی صبح زود بیدار میشید اولین کاری که انرژی میده چیه؟ من با یه لیوان آب ولرم و کشش ۵ دقیقه‌ای شروع می‌کنم.',
    timeAgo: '۱ روز پیش',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isMe: true,
    reactionsCount: { support: 14, proud: 5, empathy: 2 },
    myReaction: null,
    commentsCount: 3,
  },
];

const INITIAL_COMMENTS: CommunityComment[] = [
  {
    id: 'c1',
    postId: 'p1',
    authorAnonName: 'سفر بی‌پایان',
    content: 'ماشاالله به این اراده! دمت گرم رفیق.',
    timeAgo: '۱ ساعت پیش',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isMe: false,
  },
  {
    id: 'c2',
    postId: 'p2',
    authorAnonName: 'پرنده آزاد',
    content: 'فدای سرت! مهم اینه برگشتی به مسیر. همین شجاعتت قابل احترامه.',
    timeAgo: '۳ ساعت پیش',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    isMe: false,
  },
];

export class MockCommunityRepository implements CommunityRepository {
  private storage: StorageAdapter;

  constructor(storage: StorageAdapter = localStorageAdapter) {
    this.storage = storage;
  }

  async getGroups(): Promise<CommunityGroup[]> {
    const list = await this.storage.getItem<CommunityGroup[]>(STORAGE_KEYS.GROUPS);
    if (!list || list.length === 0) {
      await this.storage.setItem(STORAGE_KEYS.GROUPS, INITIAL_GROUPS);
      return INITIAL_GROUPS;
    }
    return list;
  }

  async joinGroup(groupId: string): Promise<void> {
    const groups = await this.getGroups();
    const updated = groups.map((g) => (g.id === groupId ? { ...g, isMember: true, memberCount: g.memberCount + 1 } : g));
    await this.storage.setItem(STORAGE_KEYS.GROUPS, updated);
  }

  async leaveGroup(groupId: string): Promise<void> {
    const groups = await this.getGroups();
    const updated = groups.map((g) => (g.id === groupId ? { ...g, isMember: false, memberCount: Math.max(0, g.memberCount - 1) } : g));
    await this.storage.setItem(STORAGE_KEYS.GROUPS, updated);
  }

  async getPosts(groupId?: string): Promise<CommunityPost[]> {
    const posts = await this.storage.getItem<CommunityPost[]>(STORAGE_KEYS.POSTS);
    const all = posts && posts.length > 0 ? posts : INITIAL_POSTS;
    if (!posts || posts.length === 0) {
      await this.storage.setItem(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    }
    const blocked = await this.getBlockedUsers();
    const filtered = all.filter((p) => !blocked.includes(p.authorAnonName));
    if (groupId) {
      return filtered.filter((p) => p.groupId === groupId);
    }
    return filtered;
  }

  async createPost(groupId: string, content: string, authorAnonName: string): Promise<CommunityPost> {
    const posts = await this.getPosts();
    const newPost: CommunityPost = {
      id: 'p_' + Date.now(),
      groupId,
      authorAnonName: authorAnonName || 'همسفر ناشناس',
      content,
      timeAgo: 'همین الان',
      createdAt: new Date().toISOString(),
      isMe: true,
      reactionsCount: { support: 0, proud: 0, empathy: 0 },
      myReaction: null,
      commentsCount: 0,
    };
    posts.unshift(newPost);
    await this.storage.setItem(STORAGE_KEYS.POSTS, posts);
    return newPost;
  }

  async toggleReaction(postId: string, reaction: ReactionType): Promise<CommunityPost> {
    const posts = await this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    if (post.myReaction === reaction) {
      // Remove reaction
      post.reactionsCount[reaction] = Math.max(0, post.reactionsCount[reaction] - 1);
      post.myReaction = null;
    } else {
      // If had previous reaction, decrement it
      if (post.myReaction) {
        post.reactionsCount[post.myReaction] = Math.max(0, post.reactionsCount[post.myReaction] - 1);
      }
      post.reactionsCount[reaction] += 1;
      post.myReaction = reaction;
    }

    await this.storage.setItem(STORAGE_KEYS.POSTS, posts);
    return post;
  }

  async getComments(postId: string): Promise<CommunityComment[]> {
    const comments = await this.storage.getItem<CommunityComment[]>(STORAGE_KEYS.COMMENTS);
    const all = comments && comments.length > 0 ? comments : INITIAL_COMMENTS;
    if (!comments || comments.length === 0) {
      await this.storage.setItem(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    }
    const blocked = await this.getBlockedUsers();
    return all.filter((c) => c.postId === postId && !blocked.includes(c.authorAnonName));
  }

  async addComment(postId: string, content: string, authorAnonName: string): Promise<CommunityComment> {
    const all = await this.storage.getItem<CommunityComment[]>(STORAGE_KEYS.COMMENTS) || [...INITIAL_COMMENTS];
    const newComment: CommunityComment = {
      id: 'c_' + Date.now(),
      postId,
      authorAnonName: authorAnonName || 'همسفر ناشناس',
      content,
      timeAgo: 'همین الان',
      createdAt: new Date().toISOString(),
      isMe: true,
    };
    all.push(newComment);
    await this.storage.setItem(STORAGE_KEYS.COMMENTS, all);

    // Update post commentsCount
    const posts = await this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (post) {
      post.commentsCount += 1;
      await this.storage.setItem(STORAGE_KEYS.POSTS, posts);
    }

    return newComment;
  }

  async reportContent(reportData: Omit<CommunityReport, 'id' | 'createdAtText' | 'status'>): Promise<void> {
    const reports = await this.getReports();
    const newReport: CommunityReport = {
      ...reportData,
      id: 'rep_' + Date.now(),
      status: 'pending',
      createdAtText: 'همین الان',
    };
    reports.unshift(newReport);
    await this.storage.setItem(STORAGE_KEYS.REPORTS, reports);
  }

  async getReports(): Promise<CommunityReport[]> {
    const list = await this.storage.getItem<CommunityReport[]>(STORAGE_KEYS.REPORTS);
    return list || [];
  }

  async dismissReport(reportId: string): Promise<void> {
    const reports = await this.getReports();
    const updated = reports.map((r) => (r.id === reportId ? { ...r, status: 'dismissed' as const } : r));
    await this.storage.setItem(STORAGE_KEYS.REPORTS, updated);
  }

  async removeReportedContent(reportId: string): Promise<void> {
    const reports = await this.getReports();
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;

    if (report.targetType === 'post') {
      const posts = await this.getPosts();
      const updated = posts.filter((p) => p.id !== report.targetId);
      await this.storage.setItem(STORAGE_KEYS.POSTS, updated);
    } else {
      const comments = await this.storage.getItem<CommunityComment[]>(STORAGE_KEYS.COMMENTS) || [];
      const updated = comments.filter((c) => c.id !== report.targetId);
      await this.storage.setItem(STORAGE_KEYS.COMMENTS, updated);
    }

    const updatedReports = reports.map((r) => (r.id === reportId ? { ...r, status: 'reviewed' as const } : r));
    await this.storage.setItem(STORAGE_KEYS.REPORTS, updatedReports);
  }

  async getBlockedUsers(): Promise<string[]> {
    const list = await this.storage.getItem<string[]>(STORAGE_KEYS.BLOCKED);
    return list || [];
  }

  async blockUser(anonName: string): Promise<void> {
    const blocked = await this.getBlockedUsers();
    if (!blocked.includes(anonName)) {
      blocked.push(anonName);
      await this.storage.setItem(STORAGE_KEYS.BLOCKED, blocked);
    }
  }

  async unblockUser(anonName: string): Promise<void> {
    const blocked = await this.getBlockedUsers();
    const filtered = blocked.filter((name) => name !== anonName);
    await this.storage.setItem(STORAGE_KEYS.BLOCKED, filtered);
  }
}

export const communityRepository = new MockCommunityRepository();
