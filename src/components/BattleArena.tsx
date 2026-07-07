import { useState, useEffect, useRef } from 'react';
import { Room, User } from '@/types';
import { roomService } from '@/services/roomService';

type GamePhase = 'lobby' | 'waiting' | 'playing' | 'result';

export const BattleArena = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('lobby');
  const [question, setQuestion] = useState('');
  const [timeLeft, setTimeLeft] = useState(90);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawings, setDrawings] = useState<{ user: User; image: string }[]>([]);
  const [roomName, setRoomName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setRooms(roomService.getRooms());
  }, []);

  useEffect(() => {
    if (gamePhase === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'playing') {
      endGame();
    }
  }, [gamePhase, timeLeft]);

  const createRoom = () => {
    if (!roomName.trim()) return;
    const room = roomService.createRoom(roomName);
    setCurrentRoom(room);
    setGamePhase('waiting');
    setShowCreateModal(false);
    setRoomName('');
    setRooms(roomService.getRooms());
  };

  const joinRoom = (roomId: string) => {
    const success = roomService.joinRoom(roomId);
    if (success) {
      const room = roomService.getRoomById(roomId);
      setCurrentRoom(room || null);
      setGamePhase('waiting');
      setRooms(roomService.getRooms());
    }
  };

  const startGame = () => {
    if (!currentRoom) return;
    const success = roomService.startGame(currentRoom.id);
    if (success) {
      setQuestion(roomService.generateQuestion());
      setTimeLeft(90);
      setGamePhase('playing');
      clearCanvas();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const endGame = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL('image/png');
      setDrawings([
        ...drawings,
        { user: roomService.getCurrentUser(), image: imageData },
        { user: { id: '2', username: 'AI玩家', avatar: '🤖', level: 5, achievements: [], createdAt: new Date() }, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cat%20drawing&image_size=square' },
      ]);
    }
    setGamePhase('result');
  };

  const leaveRoom = () => {
    if (currentRoom) {
      roomService.leaveRoom(currentRoom.id);
    }
    setCurrentRoom(null);
    setGamePhase('lobby');
    setDrawings([]);
    setRooms(roomService.getRooms());
  };

  const getStatusText = (status: Room['status']) => {
    switch (status) {
      case 'waiting': return '等待中';
      case 'playing': return '游戏中';
      case 'finished': return '已结束';
    }
  };

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-500';
      case 'playing': return 'bg-green-500';
      case 'finished': return 'bg-gray-500';
    }
  };

  if (gamePhase === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              ⚔️ 多人绘画对战
            </span>
          </h1>

          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-8"
          >
            🎮 创建对战房间
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map(room => (
              <div
                key={room.id}
                className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-shadow"
                onClick={() => joinRoom(room.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(room.status)}`}>
                    {getStatusText(room.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">玩家:</span>
                    <div className="flex -space-x-2">
                      {room.players.map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white text-sm border-2 border-white">
                          {room.players[i]?.avatar || '👤'}
                        </div>
                      ))}
                    </div>
                    <span className="text-gray-500">{room.currentPlayers}/{room.maxPlayers}</span>
                  </div>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                    加入
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">创建对战房间</h2>
                <input
                  type="text"
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  placeholder="输入房间名称..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors mb-4"
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={createRoom}
                    className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                  >
                    创建
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🏠 {currentRoom?.name}</h2>
            <div className="mb-6">
              <span className="text-gray-600">等待其他玩家加入...</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-8">
              {Array.from({ length: currentRoom?.maxPlayers || 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    i < (currentRoom?.currentPlayers || 0)
                      ? 'bg-gradient-to-r from-primary-400 to-secondary-400 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {i < (currentRoom?.currentPlayers || 0) ? '👤' : '❓'}
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={leaveRoom}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
              >
                离开房间
              </button>
              <button
                onClick={startGame}
                disabled={(currentRoom?.currentPlayers || 0) < 2}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  (currentRoom?.currentPlayers || 0) >= 2
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                开始游戏
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-gray-800">题目:</span>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  {question}
                </span>
              </div>
              <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-primary-500'}`}>
                ⏱️ {timeLeft}s
              </div>
            </div>
            
            <div className="canvas-container bg-gray-100 rounded-xl overflow-hidden mb-4">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full h-auto cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            
            <button
              onClick={endGame}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              提交作品
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">🎉 对战结果</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drawings.map((d, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-xl">
                    {d.user.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{d.user.username}</div>
                    <div className="text-sm text-gray-500">等级 {d.user.level}</div>
                  </div>
                  {i === 0 && (
                    <span className="ml-auto px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-bold">
                      🏆 胜利
                    </span>
                  )}
                </div>
                <img
                  src={d.image}
                  alt="作品"
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">创意评分:</span>
                  <span className="text-2xl font-bold text-primary-500">
                    {i === 0 ? 'S' : 'A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={leaveRoom}
            className="mt-8 w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl text-lg hover:shadow-xl transition-all"
          >
            返回大厅
          </button>
        </div>
      </div>
    );
  }

  return null;
};