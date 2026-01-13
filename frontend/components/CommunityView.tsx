import React, { useState } from 'react';

interface CommunityViewProps {
  onOpenPost: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({ onOpenPost, onOpenNotifications, onOpenProfile }) => {
  const [activeTab, setActiveTab] = useState('热门');

  const [posts, setPosts] = useState([
    {
        id: 1,
        user: { 
            name: '@alex_prod', 
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8nZvNyrRPL5ExOiGvsiulNC65a2R-jjBXqTvvk65sqUgMglP5TBbzylbXjMnVUhzzcI27RlixHtabygziZvwkgCM6dRibTM_1PzxUtetQmzPdIYzdIldMkNqltVn7Hb_ND17RnhmV4n6xj2JD9aAapj7YLPz1yxs6HcWxU2bzq2c9RAf1dFBUph1ohAYBmyFZFcFhxZQEzvrZ--6ALeSWL5oiMnjLSICnfVPW259rTAi5uQGzLbpTqf9_29IFaXeaB8WiPWQEN6w' 
        },
        time: '2小时前',
        tag: '#深度工作',
        type: 'image',
        content: {
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU1zLbyLDZXLkmSGQyoESgNhTEKl4cwvXAXulmdDRkLligedngkQ9-N4wPauKy1gZrv9Q7C_VKY9GO9eAToaZedaiUoBV5h1fFy5gUQQ-jN7IF4TDqP_k0m3CUZNFc6_5ab-BnxgAKyCmcUVWBye7o3soYCcA31F1J7QSYJNWeCyrq_ecJ1Sduk3k46xO5l6covjeSKXfkRTc-E-vpwyvGkOTdVJwaUGuKJmTyDVv8wwWaPQ3znyCh59FVkaDpwqYB7swAb0pbCYE',
            title: '我的深度工作桌面设置',
            text: '干净的设置有助于我集中注意力。今天使用番茄工作法来攻克新项目的后端。 #桌面设置'
        },
        stats: { likes: 124, comments: 18, liked: false }
    },
    {
        id: 2,
        user: { 
            name: '@sarah_habits', 
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEqq9s2sFly0RfMuc1FxxXrUnZnyVq4VCINlXjcwpLa77u-W3qXOQUwV00CcRSewudq74v1W_Td9Dtgps0Y5KC51SS5dHt29v6IEmIVSXayoEIKP8e8y9yCjjpcS_3-bTHUaHO0m80rspdOsnk3fOkdThy15RKj5pkbmoPXVXXR9yOxjP8-WLIcPzW9PLaMQ_tu2eacCtgpsCfvfGmLtsNq88YZtvJs0xLuAe9Fdrh_OxhXJzrxIpMLXwlVbs3_2l-EfV0clOpGZ0' 
        },
        time: '5小时前',
        tag: '#习惯追踪',
        type: 'quote',
        content: {
            quote: '"你未来的秘密隐藏在你的日常生活中。"',
            text: '刚刚达成了连续 45 天早上 5 点起床。早晨的清醒感是无与伦比的。 🚀'
        },
        hasStreak: true,
        stats: { likes: 342, comments: 56, liked: true }
    }
  ]);

  const toggleLike = (id: number) => {
      setPosts(current => current.map(post => {
          if (post.id === id) {
              const isLiked = !post.stats.liked;
              return {
                  ...post,
                  stats: {
                      ...post.stats,
                      liked: isLiked,
                      likes: post.stats.likes + (isLiked ? 1 : -1)
                  }
              };
          }
          return post;
      }));
  };

  return (
    <div className="h-full overflow-y-auto bg-background-light dark:bg-background-dark no-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4 pb-2">
            <div className="size-10"></div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">社区</h2>
            <button 
                onClick={onOpenNotifications}
                className="size-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
                <span className="material-symbols-outlined">notifications</span>
            </button>
        </div>
        
        {/* Search */}
        <div className="px-4 py-2">
            <div className="flex items-center w-full h-10 overflow-hidden rounded-xl bg-slate-100 dark:bg-surface-dark">
                <div className="flex items-center justify-center pl-4 text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input 
                    className="w-full h-full px-3 text-sm bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-500"
                    placeholder="搜索话题、用户或 #标签"
                />
            </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-8">
            <div 
                onClick={() => setActiveTab('关注')}
                className={`flex-1 py-3 text-center border-b-2 cursor-pointer transition-colors duration-200 ${
                    activeTab === '关注' 
                    ? 'border-primary text-slate-900 dark:text-white' 
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
            >
                <p className="text-sm font-bold">关注</p>
            </div>
            <div 
                onClick={() => setActiveTab('热门')}
                className={`flex-1 py-3 text-center border-b-2 cursor-pointer transition-colors duration-200 ${
                    activeTab === '热门' 
                    ? 'border-primary text-slate-900 dark:text-white' 
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
            >
                <p className="text-sm font-bold">热门</p>
            </div>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-md mx-auto pb-24">
        {posts.map((post) => (
            <article 
                key={post.id} 
                className="p-4 border-b border-slate-200 dark:border-slate-800 cursor-pointer active:bg-slate-50 dark:active:bg-white/5 transition-colors"
                onClick={onOpenPost}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div 
                        className="size-10 rounded-full bg-cover cursor-pointer hover:opacity-80 transition-opacity" 
                        style={{ backgroundImage: `url("${post.user.avatar}")` }}
                        onClick={(e) => { e.stopPropagation(); onOpenProfile(); }}
                    ></div>
                    <div>
                        <h3 
                            className="text-sm font-bold text-slate-900 dark:text-white cursor-pointer hover:underline"
                            onClick={(e) => { e.stopPropagation(); onOpenProfile(); }}
                        >
                            {post.user.name}
                        </h3>
                        <p className="text-xs text-slate-500">{post.time} • {post.tag}</p>
                    </div>
                    {post.hasStreak ? (
                        <div className="ml-auto flex items-center gap-1 bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px] filled">local_fire_department</span>
                            <span className="text-[10px] font-bold">45天 连续记录</span>
                        </div>
                    ) : (
                        <button className="ml-auto text-slate-400" onClick={(e) => e.stopPropagation()}>
                            <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                    )}
                </div>
                <div className="flex flex-col gap-3">
                    {post.type === 'image' && post.content.image && (
                         <div className="w-full rounded-xl aspect-video bg-cover bg-center" style={{ backgroundImage: `url("${post.content.image}")` }}></div>
                    )}
                    
                    {post.type === 'quote' ? (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                            <p className="text-base font-medium italic text-slate-900 dark:text-white">{post.content.quote}</p>
                            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{post.content.text}</p>
                        </div>
                    ) : (
                        <div>
                             {post.content.title && <h4 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">{post.content.title}</h4>}
                             <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{post.content.text}</p>
                        </div>
                    )}

                    <div className="flex items-center gap-4 py-1">
                        <button 
                            onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-95 ${
                                post.stats.liked 
                                ? 'bg-primary text-white shadow-glow' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            <span className={`material-symbols-outlined text-[20px] ${post.stats.liked ? 'filled' : ''}`}>pan_tool</span>
                            <span className="text-xs font-bold">{post.stats.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
                            <span className="material-symbols-outlined text-slate-500 text-[20px]">chat_bubble</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{post.stats.comments}</span>
                        </button>
                    </div>
                </div>
            </article>
        ))}
      </div>

      {/* FAB */}
      <button className="fixed z-30 flex items-center justify-center text-white transition-transform rounded-full bottom-24 right-6 size-14 bg-primary shadow-glow active:scale-90">
            <span className="material-symbols-outlined text-[24px]">add</span>
      </button>
    </div>
  );
};

export default CommunityView;