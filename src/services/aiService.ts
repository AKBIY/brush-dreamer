import { StyleType, GameAsset } from '@/types';

const MOCK_ASSETS: GameAsset[] = [
  {
    id: '1',
    name: '像素勇士',
    type: 'character',
    style: 'pixel',
    url: 'https://image.pollinations.ai/prompt/pixel%20art%20warrior%20character%20retro%20game%20style%20transparent%20background?width=512&height=512',
    thumbnail: 'https://image.pollinations.ai/prompt/pixel%20art%20warrior%20character%20retro%20game%20style%20transparent%20background?width=512&height=512',
    createdAt: new Date(),
    userId: '1',
  },
  {
    id: '2',
    name: '卡通猫咪',
    type: 'character',
    style: 'cartoon',
    url: 'https://image.pollinations.ai/prompt/cute%20cartoon%20cat%20character%20game%20asset%20kawaii%20style?width=512&height=512',
    thumbnail: 'https://image.pollinations.ai/prompt/cute%20cartoon%20cat%20character%20game%20asset%20kawaii%20style?width=512&height=512',
    createdAt: new Date(),
    userId: '1',
  },
  {
    id: '3',
    name: '动漫少女',
    type: 'character',
    style: 'anime',
    url: 'https://image.pollinations.ai/prompt/anime%20girl%20character%20game%20style%20beautiful%20portrait?width=512&height=512',
    thumbnail: 'https://image.pollinations.ai/prompt/anime%20girl%20character%20game%20style%20beautiful%20portrait?width=512&height=512',
    createdAt: new Date(),
    userId: '1',
  },
  {
    id: '4',
    name: '赛博忍者',
    type: 'character',
    style: 'cyberpunk',
    url: 'https://image.pollinations.ai/prompt/cyberpunk%20ninja%20character%20neon%20lights%20futuristic%20game%20asset?width=512&height=512',
    thumbnail: 'https://image.pollinations.ai/prompt/cyberpunk%20ninja%20character%20neon%20lights%20futuristic%20game%20asset?width=512&height=512',
    createdAt: new Date(),
    userId: '1',
  },
];

export const aiService = {
  generateImage: async (_sketchImage: string, style: StyleType, prompt: string): Promise<GameAsset> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const stylePrompts: Record<StyleType, string> = {
      pixel: 'pixel art style game asset 8-bit retro',
      cartoon: 'cute cartoon style game asset kawaii',
      anime: 'anime style game asset beautiful detailed',
      cyberpunk: 'cyberpunk neon style game asset futuristic',
    };
    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(`${prompt} ${stylePrompts[style]} game asset character transparent background`)}/?width=512&height=512&seed=${Date.now()}`;
    
    return {
      id: `${Date.now()}`,
      name: `生成素材_${Date.now()}`,
      type: 'character',
      style,
      url: imageUrl,
      thumbnail: imageUrl,
      createdAt: new Date(),
      userId: '1',
    };
  },

  generateScriptScenes: async (outline: string): Promise<{ description: string; cameraAngle: string }[]> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return [
      { description: `${outline} - 开场场景：主角站在城堡门前`, cameraAngle: '全景' },
      { description: `${outline} - 冒险开始：主角进入神秘森林`, cameraAngle: '中景' },
      { description: `${outline} - 遭遇挑战：主角面对强大敌人`, cameraAngle: '特写' },
      { description: `${outline} - 胜利时刻：主角战胜敌人获得宝藏`, cameraAngle: '全景' },
    ];
  },

  generateSceneImage: async (description: string, cameraAngle: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(`${description} ${cameraAngle} cinematic scene movie quality beautiful lighting`)}/?width=1024&height=576&seed=${Date.now()}`;
  },

  getMockAssets: (): GameAsset[] => {
    return MOCK_ASSETS;
  },

  getAssetsByStyle: (style: StyleType): GameAsset[] => {
    return MOCK_ASSETS.filter(asset => asset.style === style);
  },
};
