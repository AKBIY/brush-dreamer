import { useState } from 'react';
import { aiService } from '@/services/aiService';

interface ScriptScene {
  id: string;
  description: string;
  cameraAngle: string;
  imageUrl?: string;
  isGenerating: boolean;
}

export const ScriptTool = () => {
  const [title, setTitle] = useState('');
  const [outline, setOutline] = useState('');
  const [scenes, setScenes] = useState<ScriptScene[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateScenes = async () => {
    if (!title.trim() || !outline.trim()) {
      alert('请填写剧本标题和大纲');
      return;
    }

    setIsGenerating(true);
    
    try {
      const generatedScenes = await aiService.generateScriptScenes(outline);
      const newScenes: ScriptScene[] = generatedScenes.map((scene, index) => ({
        id: `scene-${index}`,
        description: scene.description,
        cameraAngle: scene.cameraAngle,
        isGenerating: false,
      }));
      setScenes(newScenes);
    } catch (error) {
      console.error('生成失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSceneImage = async (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene || scene.isGenerating) return;

    setScenes(prev => prev.map(s => 
      s.id === sceneId ? { ...s, isGenerating: true } : s
    ));

    try {
      const imageUrl = await aiService.generateSceneImage(scene.description, scene.cameraAngle);
      setScenes(prev => prev.map(s => 
        s.id === sceneId ? { ...s, imageUrl, isGenerating: false } : s
      ));
    } catch (error) {
      console.error('生成图片失败:', error);
      setScenes(prev => prev.map(s => 
        s.id === sceneId ? { ...s, isGenerating: false } : s
      ));
    }
  };

  const addScene = () => {
    const newScene: ScriptScene = {
      id: `scene-${Date.now()}`,
      description: '',
      cameraAngle: '全景',
      isGenerating: false,
    };
    setScenes(prev => [...prev, newScene]);
  };

  const updateScene = (sceneId: string, field: 'description' | 'cameraAngle', value: string) => {
    setScenes(prev => prev.map(s => 
      s.id === sceneId ? { ...s, [field]: value } : s
    ));
  };

  const deleteScene = (sceneId: string) => {
    setScenes(prev => prev.filter(s => s.id !== sceneId));
  };

  const cameraAngles = ['全景', '中景', '特写', '远景', '低角度', '高角度'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            📖 剧本可视化工具
          </span>
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">剧本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="剧本标题..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <textarea
            value={outline}
            onChange={e => setOutline(e.target.value)}
            placeholder="输入剧本大纲或剧情描述..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors resize-none mb-4"
          />
          <button
            onClick={generateScenes}
            disabled={isGenerating}
            className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold transition-all ${
              isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg'
            }`}
          >
            {isGenerating ? 'AI正在生成分镜...' : '✨ 智能生成分镜'}
          </button>
        </div>

        <div className="space-y-6">
          {scenes.map((scene, index) => (
            <div
              key={scene.id}
              className="bg-white rounded-2xl shadow-xl p-6 fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  🎬 场景 {index + 1}
                </h3>
                <button
                  onClick={() => deleteScene(scene.id)}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  删除
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">场景描述</label>
                    <textarea
                      value={scene.description}
                      onChange={e => updateScene(scene.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">镜头角度</label>
                    <select
                      value={scene.cameraAngle}
                      onChange={e => updateScene(scene.id, 'cameraAngle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                    >
                      {cameraAngles.map(angle => (
                        <option key={angle} value={angle}>{angle}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => generateSceneImage(scene.id)}
                    disabled={scene.isGenerating || !scene.description.trim()}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      scene.isGenerating || !scene.description.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg'
                    } ${scene.isGenerating ? 'ai-generating' : ''}`}
                  >
                    {scene.isGenerating ? '生成中...' : '🎨 生成概念图'}
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">概念图</label>
                  {scene.imageUrl ? (
                    <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={scene.imageUrl}
                        alt="场景概念图"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center text-gray-400">
                          <div className="text-3xl mb-2">🎬</div>
                          <div>图片加载失败</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                      点击上方按钮生成概念图
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {scenes.length > 0 && (
            <button
              onClick={addScene}
              className="w-full py-4 border-2 border-dashed border-primary-300 rounded-xl text-primary-500 font-bold hover:bg-primary-50 transition-colors"
            >
              + 添加新场景
            </button>
          )}
        </div>

        {scenes.length > 0 && (
          <div className="mt-8">
            <button className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl transition-all">
              💾 导出剧本
            </button>
          </div>
        )}
      </div>
    </div>
  );
};