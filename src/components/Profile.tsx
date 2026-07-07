import { useState } from 'react';
import { ACHIEVEMENTS, Achievement } from '@/types';
import { aiService } from '@/services/aiService';

export const Profile = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [assets] = useState(aiService.getMockAssets());

  const toggleAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => 
      a.id === id ? { ...a, unlocked: !a.unlocked, unlockedAt: !a.unlocked ? new Date() : undefined } : a
    ));
  };

  const stats = {
    totalAssets: 12,
    totalGames: 3,
    totalBattles: 25,
    winRate: 68,
    level: 8,
    exp: 2450,
    nextLevelExp: 3000,
  };

  const expProgress = (stats.exp / stats.nextLevelExp) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            👤 我的个人中心
          </span>
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-5xl">
                🎨
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Lv.{stats.level}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">创意玩家</h2>
              <p className="text-gray-600 mb-4">用画笔创造游戏世界的梦想家</p>
              <div className="w-full max-w-xs mx-auto md:mx-0">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>经验值</span>
                  <span>{stats.exp} / {stats.nextLevelExp}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${expProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-2">
              {stats.totalAssets}
            </div>
            <div className="text-gray-600">生成素材</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-2">
              {stats.totalGames}
            </div>
            <div className="text-gray-600">创作游戏</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-2">
              {stats.totalBattles}
            </div>
            <div className="text-gray-600">对战次数</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
              {stats.winRate}%
            </div>
            <div className="text-gray-600">胜率</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 成就系统</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-300'
                    : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                }`}
                onClick={() => toggleAchievement(achievement.id)}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="font-bold text-gray-800 text-sm">{achievement.name}</div>
                <div className="text-xs text-gray-500 mt-1">{achievement.description}</div>
                {achievement.unlocked && (
                  <div className="text-xs text-green-500 mt-2">✓ 已解锁</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎮 我的素材库</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {assets.map(asset => (
              <div key={asset.id} className="rounded-xl overflow-hidden shadow-md">
                <div className="relative w-full h-32 bg-gray-100">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🎨</div>
                      <div className="text-xs text-gray-500">{asset.name}</div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-medium text-gray-800 text-sm">{asset.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl transition-all">
            🔔 设置打卡提醒
          </button>
          <button className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">
            ⚙️ 设置
          </button>
        </div>
      </div>
    </div>
  );
};