import { useEffect, useRef, useState } from 'react';
import { aiService } from '@/services/aiService';
import { STYLE_OPTIONS, StyleType, GameAsset } from '@/types';

export const DrawingBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [activeStyle, setActiveStyle] = useState<StyleType>('pixel');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<GameAsset[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

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
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const generateAsset = async () => {
    if (!prompt.trim()) {
      alert('请输入素材描述');
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const imageData = canvas.toDataURL('image/png');
    
    setIsGenerating(true);
    setShowResult(true);
    
    try {
      const asset = await aiService.generateImage(imageData, activeStyle, prompt);
      setGeneratedAssets(prev => [asset, ...prev]);
    } catch (error) {
      console.error('生成失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const lineWidths = [2, 4, 6, 8, 12];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            🎨 AI草图转游戏素材
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">颜色:</span>
                  <div className="flex gap-2">
                    {colors.map(c => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          color === c ? 'border-primary-500 scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">粗细:</span>
                  <div className="flex gap-2">
                    {lineWidths.map(w => (
                      <button
                        key={w}
                        onClick={() => setLineWidth(w)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 ${
                          lineWidth === w ? 'border-primary-500 bg-primary-100' : 'border-gray-300 bg-gray-100'
                        }`}
                      >
                        <div className="rounded-full bg-gray-800" style={{ width: w, height: w }} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={clearCanvas}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    清空
                  </button>
                  <button
                    onClick={undo}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    撤销
                  </button>
                </div>
              </div>

              <div className="canvas-container bg-gray-100 rounded-xl overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full h-auto cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🎨 风格选择</h2>
              <div className="grid grid-cols-2 gap-3">
                {STYLE_OPTIONS.map(style => (
                  <button
                    key={style.value}
                    onClick={() => setActiveStyle(style.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      activeStyle === style.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{style.icon}</div>
                    <div className="font-medium text-gray-800">{style.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📝 素材描述</h2>
              <input
                type="text"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="描述你想生成的素材..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors mb-4"
              />
              <button
                onClick={generateAsset}
                disabled={isGenerating}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg'
                } ${isGenerating ? 'ai-generating' : ''}`}
              >
                {isGenerating ? 'AI正在生成中...' : '✨ 生成游戏素材'}
              </button>
            </div>
          </div>
        </div>

        {showResult && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎮 生成的素材</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {generatedAssets.map(asset => (
                <div key={asset.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200">
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
                    <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎨</div>
                        <div className="text-sm text-gray-500">{asset.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-gray-800">{asset.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {STYLE_OPTIONS.find(s => s.value === asset.style)?.label}
                    </div>
                    <button className="mt-3 w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                      下载素材
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};