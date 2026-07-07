export interface GameAsset {
  id: string;
  name: string;
  type: 'character' | 'scene' | 'prop';
  style: 'pixel' | 'cartoon' | 'anime' | 'cyberpunk';
  url: string;
  thumbnail: string;
  createdAt: Date;
  userId: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  level: number;
  achievements: Achievement[];
  createdAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Room {
  id: string;
  name: string;
  maxPlayers: number;
  currentPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  players: User[];
  createdAt: Date;
}

export interface Drawing {
  id: string;
  userId: string;
  roomId: string;
  imageData: string;
  score?: number;
  createdAt: Date;
}

export interface GameTemplate {
  id: string;
  name: string;
  type: 'platformer' | 'topdown' | 'card';
  thumbnail: string;
  description: string;
}

export interface SceneObject {
  id: string;
  type: 'character' | 'scene' | 'prop';
  assetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface GameProject {
  id: string;
  name: string;
  templateId: string;
  objects: SceneObject[];
  bgColor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScriptScene {
  id: string;
  description: string;
  imageUrl?: string;
  cameraAngle: string;
  dialogue?: string;
}

export interface Script {
  id: string;
  title: string;
  outline: string;
  scenes: ScriptScene[];
  createdAt: Date;
}

export type StyleType = 'pixel' | 'cartoon' | 'anime' | 'cyberpunk';

export const STYLE_OPTIONS: { value: StyleType; label: string; icon: string }[] = [
  { value: 'pixel', label: '像素风', icon: '🖼️' },
  { value: 'cartoon', label: '卡通', icon: '🎨' },
  { value: 'anime', label: '日式动漫', icon: '✨' },
  { value: 'cyberpunk', label: '赛博朋克', icon: '🌃' },
];

export const GAME_TEMPLATES: GameTemplate[] = [
  {
    id: 'platformer-1',
    name: '横版过关',
    type: 'platformer',
    thumbnail: 'https://image.pollinations.ai/prompt/platform%20game%20level%20pixel%20art%20retro%20style%20scenery/?width=1024&height=768',
    description: '经典横版过关游戏模板',
  },
  {
    id: 'topdown-1',
    name: '俯视角探索',
    type: 'topdown',
    thumbnail: 'https://image.pollinations.ai/prompt/topdown%20game%20map%20pixel%20art%20exploration%20game/?width=1024&height=768',
    description: '俯视角探索游戏模板',
  },
  {
    id: 'card-1',
    name: '卡牌对战',
    type: 'card',
    thumbnail: 'https://image.pollinations.ai/prompt/card%20game%20interface%20fantasy%20style%20magical%20cards/?width=1024&height=768',
    description: '卡牌对战游戏模板',
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-draw', name: '初试画笔', description: '完成第一次绘画', icon: '🎨', unlocked: false },
  { id: 'first-asset', name: '素材大师', description: '生成第一个游戏素材', icon: '✨', unlocked: false },
  { id: 'first-game', name: '游戏制作人', description: '创建第一个游戏项目', icon: '🎮', unlocked: false },
  { id: 'first-win', name: '胜利时刻', description: '获得第一次对战胜利', icon: '🏆', unlocked: false },
  { id: 'streak-5', name: '连胜达人', description: '连续获胜5场', icon: '🔥', unlocked: false },
  { id: 'creator-s', name: '创意之星', description: '获得S级评分', icon: '⭐', unlocked: false },
  { id: 'invite-friend', name: '好友相聚', description: '邀请一位好友', icon: '👥', unlocked: false },
  { id: '100-likes', name: '人气王', description: '获得100个点赞', icon: '❤️', unlocked: false },
];