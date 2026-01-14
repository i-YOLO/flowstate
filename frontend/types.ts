export enum View {
  HOME = 'HOME',
  ANALYTICS = 'ANALYTICS',
  NEW_ENTRY = 'NEW_ENTRY',
  CALENDAR = 'CALENDAR',
  COMMUNITY = 'COMMUNITY',
  PROFILE = 'PROFILE',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  ADD_TIME_RECORD = 'ADD_TIME_RECORD',
  ADD_HABIT = 'ADD_HABIT',
  FOCUS_MODE = 'FOCUS_MODE',
  POST_DETAILS = 'POST_DETAILS',
  REPLY = 'REPLY',
  NOTIFICATIONS = 'NOTIFICATIONS',
  CHAT = 'CHAT',
  PUBLIC_PROFILE = 'PUBLIC_PROFILE',
  CATEGORY_MANAGEMENT = 'CATEGORY_MANAGEMENT',
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  icon: string;
  goal: string;
  completed: number;
  total: number;
  color: string;
  streak: number[]; // 0 for missed, 1 for done, 2 for today
  unit: string;
}

export interface Post {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
  };
  time: string;
  tag: string;
  image?: string;
  content: string;
  likes: number;
  comments: number;
  isStreak?: boolean;
}