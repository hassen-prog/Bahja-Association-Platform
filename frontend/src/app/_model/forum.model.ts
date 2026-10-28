import { User } from './user.model';

export interface ForumTopic {
  id?: number;
  name: string;
  description: string;
  createdAt?: Date;
  creator?: User;
  isActive?: boolean;
  fileUrl?: string;
}

export interface ForumPost {
  id?: number;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  author?: User;
  topic?: ForumTopic;
  comments?: ForumComment[];
  likes?: ForumLike[];
  isActive?: boolean;
  fileUrl?: string;
}


export interface ForumLike {
  id?: number;
  user?: User;
  post?: ForumPost;
  createdAt?: Date;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}


export interface ForumComment {
  id?: number;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  author?: User;
  post?: ForumPost;
  parentComment?: ForumComment;
  replies?: ForumComment[];
  // For UI purposes only
  showReplyForm?: boolean;
  replyContent?: string;
}