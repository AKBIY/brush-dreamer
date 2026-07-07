import { useState, useEffect } from 'react';
import { GAME_TEMPLATES, GameTemplate, GameAsset } from '@/types';
import { aiService } from '@/services/aiService';

interface SceneObject {
  id: string;
  assetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const GameCreator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(null);
  const [projectName, setProjectName] = useState('');
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [assets, setAssets] = useState<GameAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setAssets(aiService.getMockAssets());
  }, []);

  const handleTemplateSelect = (template: GameTemplate) => {
    setSelectedTemplate(template);
    setProjectName(template.name + '项目');
  };

  const handleAssetClick = (assetId: string) => {
    setSelectedAsset(assetId);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedAsset) return;
    
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 800;
    const y = (e.clientY - rect.top) / rect.height * 500;
    
    const newObject: SceneObject = {
      id: `${Date.now()}`,
      assetId: selectedAsset,
      x,
      y,
      width: 64,
      height: 64,
    };
    
    setObjects(prev => [...prev, newObject]);
    setSelectedAsset(null);
  };

  const handleObjectClick = (e: React.MouseEvent, objectId: string) => {
    e.stopPropagation();
    setObjects(prev => prev.filter(obj => obj.id !== objectId));
  };

  const getAssetUrl = (assetId: string) => {
    return assets.find(a => a.id === assetId)?.url || '';
  };

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              🎮 游戏创作
            </span>
          </h1>
          <p className="text-center text-gray-600 mb-8">选择一个游戏模板开始创作</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GAME_TEMPLATES.map(template => (
              <div
                key={template.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105"
                onClick={() => handleTemplateSelect(template)}
              >
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{template.name}</h3>
                  <p className="text-gray-600">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            🎮 游戏创作 - {selectedTemplate.name}
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">项目设置</h2>
              <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors mb-4"
                placeholder="项目名称"
              />
              <button
                onClick={() => setIsPlaying(true)}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                ▶ 预览游戏
              </button>
              <button className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-lg transition-all mt-3">
                💾 保存项目
              </button>
              <button className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors mt-3">
                ← 返回选择模板
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">素材库</h2>
              <div className="grid grid-cols-2 gap-3">
                {assets.map(asset => (
                  <div
                    key={asset.id}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      selectedAsset === asset.id
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => handleAssetClick(asset.id)}
                  >
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">点击素材后，在画布上点击放置</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">场景编辑器</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setObjects([])}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    清空场景
                  </button>
                </div>
              </div>

              <div className="relative bg-gray-100 rounded-xl overflow-hidden" onClick={handleCanvasClick}>
                <canvas
                  width={800}
                  height={500}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 pointer-events-none">
                  {objects.map(obj => (
                    <img
                      key={obj.id}
                      src={getAssetUrl(obj.assetId)}
                      alt=""
                      className="absolute object-contain cursor-pointer pointer-events-auto hover:ring-2 hover:ring-primary-500 transition-all"
                      style={{
                        left: `${(obj.x / 800) * 100}%`,
                        top: `${(obj.y / 500) * 100}%`,
                        width: `${(obj.width / 800) * 100}%`,
                        height: `${(obj.height / 500) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onClick={e => handleObjectClick(e, obj.id)}
                    />
                  ))}
                </div>
              </div>

              {objects.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">场景对象 ({objects.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {objects.map(obj => (
                      <span
                        key={obj.id}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-red-100 hover:text-red-600 transition-colors"
                        onClick={() => setObjects(prev => prev.filter(o => o.id !== obj.id))}
                      >
                        🗑️ 对象 {obj.id.slice(-4)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isPlaying && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">🎮 游戏预览</h2>
                <button
                  onClick={() => setIsPlaying(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="bg-gray-100 rounded-xl overflow-hidden">
                <canvas
                  width={800}
                  height={500}
                  className="w-full h-auto game-canvas"
                />
                <div className="absolute inset-0 pointer-events-none">
                  {objects.map(obj => (
                    <img
                      key={obj.id}
                      src={getAssetUrl(obj.assetId)}
                      alt=""
                      className="absolute object-contain"
                      style={{
                        left: `${(obj.x / 800) * 100}%`,
                        top: `${(obj.y / 500) * 100}%`,
                        width: `${(obj.width / 800) * 100}%`,
                        height: `${(obj.height / 500) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-center text-gray-500 mt-4">使用方向键控制角色移动</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
