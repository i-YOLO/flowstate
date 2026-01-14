import React, { useState, useEffect } from 'react';

interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
}

interface CategoryManagementViewProps {
    onBack: () => void;
}

const CategoryManagementView: React.FC<CategoryManagementViewProps> = ({ onBack }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState('');
    const [selectedColor, setSelectedColor] = useState('indigo');
    const [selectedIcon, setSelectedIcon] = useState('work');
    const [loading, setLoading] = useState(true);

    const colors = [
        { key: 'indigo', label: '靛蓝', hex: '#6366f1' },
        { key: 'amber', label: '琥珀', hex: '#f59e0b' },
        { key: 'emerald', label: '祖母绿', hex: '#10b981' },
        { key: 'rose', label: '玫瑰红', hex: '#f43f5e' },
        { key: 'purple', label: '紫色', hex: '#a855f7' },
        { key: 'sky', label: '天蓝', hex: '#0ea5e9' },
        { key: 'orange', label: '活力橙', hex: '#f97316' },
        { key: 'pink', label: '浪漫粉', hex: '#ec4899' },
        { key: 'cyan', label: '青色', hex: '#06b6d4' },
        { key: 'slate', label: '石板灰', hex: '#64748b' },
    ];

    const icons = [
        'work', 'school', 'fitness_center', 'group', 'bedtime',
        'self_improvement', 'fastfood', 'code', 'palette', 'menu_book',
        'movie', 'sports_esports', 'pets', 'local_cafe', 'brush',
        'timer', 'bolt', 'rocket_launch', 'favorite', 'home_repair_service',
        'headphones', 'camera_alt', 'explore', 'flight_takeoff', 'auto_stories',
        'calculate', 'translate', 'psychology', 'biotech', 'piano'
    ];

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newName.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newName, color: selectedColor, icon: selectedIcon })
            });
            if (response.ok) {
                setNewName('');
                fetchCategories();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('确定要删除这个分类吗？相关日程将显示为默认颜色。')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                fetchCategories();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const selectedHex = colors.find(c => c.key === selectedColor)?.hex || '#6366f1';

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden">
            {/* Header */}
            <header className="flex items-center p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="ml-2 text-lg font-bold">分类管理</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                {/* Add Section */}
                <section className="bg-white dark:bg-card-dark rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">创建新分类</h3>
                    <div className="space-y-6">
                        <input
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                            placeholder="分类名称，如：深度工作"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />

                        <div>
                            <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">选择颜色</p>
                            <div className="grid grid-cols-5 gap-3">
                                {colors.map((c) => (
                                    <button
                                        key={c.key}
                                        onClick={() => setSelectedColor(c.key)}
                                        className={`relative aspect-square rounded-full flex items-center justify-center transition-transform active:scale-90 ${selectedColor === c.key ? 'scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'}`}
                                        style={{ backgroundColor: c.hex }}
                                    >
                                        {selectedColor === c.key && (
                                            <span className="material-symbols-outlined text-white text-lg font-bold">check</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">选择图标</p>
                            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl no-scrollbar">
                                {icons.map((icon) => (
                                    <button
                                        key={icon}
                                        onClick={() => setSelectedIcon(icon)}
                                        className={`aspect-square rounded-lg flex items-center justify-center transition-all ${selectedIcon === icon
                                            ? 'bg-primary text-white scale-110 shadow-md'
                                            : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleAddCategory}
                            disabled={!newName.trim()}
                            className="w-full py-3.5 rounded-xl text-white font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                            style={{ backgroundColor: selectedHex, boxShadow: `0 8px 20px -6px ${selectedHex}80` }}
                        >
                            <span className="material-symbols-outlined">{selectedIcon}</span>
                            <span>添加分类</span>
                        </button>
                    </div>
                </section>

                {/* List Section */}
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1 mb-3">现有分类</h3>
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {categories.map((cat) => {
                                const catHex = colors.find(c => c.key === cat.color)?.hex || '#6366f1';
                                return (
                                    <div
                                        key={cat.id}
                                        className="flex items-center justify-between p-4 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl group transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center size-10 rounded-xl" style={{ backgroundColor: `${catHex}15`, color: catHex }}>
                                                <span className="material-symbols-outlined">{cat.icon}</span>
                                            </div>
                                            <span className="font-bold">{cat.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default CategoryManagementView;
