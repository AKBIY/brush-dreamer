import { GAME_TEMPLATES } from '@/types';

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export const Home = ({ onNavigate }: HomeProps) => {
  const features = [
    {
      icon: '🎨',
      title: 'AI草图转素材',
      description: '手绘草图，AI自动生成多种风格的游戏可用素材',
      button: '开始创作',
      action: 'draw',
    },
    {
      icon: '⚔️',
      title: '多人绘画对战',
      description: '实时对战，AI评分，展示你的创意才华',
      button: '进入对战',
      action: 'battle',
    },
    {
      icon: '🎮',
      title: '零代码游戏创作',
      description: '拖拽素材，可视化编辑，快速创建游戏',
      button: '创建游戏',
      action: 'game',
    },
    {
      icon: '📖',
      title: '剧本可视化',
      description: '输入剧情，AI生成分镜，可视化创作剧本',
      button: '开始编写',
      action: 'script',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="text-6xl mb-6 animate-bounce">🎨</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              用你的画笔，创造游戏世界
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            画笔造梦师是一个AI驱动的游戏创作平台，让每个人都能轻松将创意变成可玩的游戏
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('draw')}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🎨 开始创作
            </button>
            <button
              onClick={() => onNavigate('battle')}
              className="px-8 py-4 bg-white text-primary-500 font-bold rounded-full text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-primary-200"
            >
              ⚔️ 进入对战
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              核心功能
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-white rounded-2xl p-6 text-center cursor-pointer"
                onClick={() => onNavigate(feature.action)}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-medium hover:opacity-90 transition-opacity">
                  {feature.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              游戏模板
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GAME_TEMPLATES.map(template => (
              <div
                key={template.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate('game')}
              >
                <div className="relative w-full h-48 bg-gray-100">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎮</div>
                      <div className="text-sm text-gray-500">{template.name}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{template.name}</h3>
                  <p className="text-gray-600">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              为什么选择画笔造梦师？
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">零门槛创作</h3>
              <p className="text-gray-600">不需要编程经验，人人都能创造游戏</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">AI驱动</h3>
              <p className="text-gray-600">强大的AI能力，让创作更轻松高效</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">完整闭环</h3>
              <p className="text-gray-600">从绘画到游戏，一站式完成</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};