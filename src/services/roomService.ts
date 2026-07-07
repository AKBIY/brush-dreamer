import { Room, User, Drawing } from '@/types';

const MOCK_USER: User = {
  id: 'user-1',
  username: '创意玩家',
  avatar: '🎨',
  level: 1,
  achievements: [],
  createdAt: new Date(),
};

const MOCK_ROOMS: Room[] = [
  {
    id: 'room-1',
    name: '创意对战房间',
    maxPlayers: 4,
    currentPlayers: 2,
    status: 'waiting',
    players: [MOCK_USER],
    createdAt: new Date(),
  },
  {
    id: 'room-2',
    name: '绘画大师赛',
    maxPlayers: 2,
    currentPlayers: 1,
    status: 'waiting',
    players: [MOCK_USER],
    createdAt: new Date(),
  },
];

export const roomService = {
  createRoom: (name: string, maxPlayers: number = 4): Room => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name,
      maxPlayers,
      currentPlayers: 1,
      status: 'waiting',
      players: [MOCK_USER],
      createdAt: new Date(),
    };
    MOCK_ROOMS.push(newRoom);
    return newRoom;
  },

  getRooms: (): Room[] => {
    return MOCK_ROOMS;
  },

  getRoomById: (roomId: string): Room | undefined => {
    return MOCK_ROOMS.find(room => room.id === roomId);
  },

  joinRoom: (roomId: string): boolean => {
    const room = MOCK_ROOMS.find(r => r.id === roomId);
    if (room && room.currentPlayers < room.maxPlayers && room.status === 'waiting') {
      room.currentPlayers++;
      room.players.push(MOCK_USER);
      return true;
    }
    return false;
  },

  leaveRoom: (roomId: string): void => {
    const room = MOCK_ROOMS.find(r => r.id === roomId);
    if (room) {
      room.currentPlayers = Math.max(0, room.currentPlayers - 1);
    }
  },

  startGame: (roomId: string): boolean => {
    const room = MOCK_ROOMS.find(r => r.id === roomId);
    if (room && room.currentPlayers >= 2) {
      room.status = 'playing';
      return true;
    }
    return false;
  },

  submitDrawing: (roomId: string, imageData: string): Drawing => {
    return {
      id: `drawing-${Date.now()}`,
      userId: MOCK_USER.id,
      roomId,
      imageData,
      createdAt: new Date(),
    };
  },

  getDrawings: (_roomId: string): Drawing[] => {
    return [];
  },

  endGame: (roomId: string): void => {
    const room = MOCK_ROOMS.find(r => r.id === roomId);
    if (room) {
      room.status = 'finished';
    }
  },

  getCurrentUser: (): User => {
    return MOCK_USER;
  },

  generateQuestion: (): string => {
    const questions = [
      '画一只会飞的猫',
      '画一座未来城市',
      '画一只可爱的机器人',
      '画一片神秘森林',
      '画一辆赛车',
      '画一只魔法宠物',
      '画一座城堡',
      '画一只恐龙',
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  },
};