import React, { useState } from 'react';

interface RegisterViewProps {
    onBackToLogin: () => void;
    onRegisterSuccess: () => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onBackToLogin, onRegisterSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!name || !email || !password) {
            setError('请填写所有必填字段');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                onRegisterSuccess();
            } else {
                const msg = await response.text();
                setError(msg || '注册失败，请检查输入或邮箱是否已占用');
            }
        } catch (err) {
            setError('无法连接到服务器，请稍后再试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="relative flex min-h-screen w-full flex-col overflow-x-hidden p-6 font-display transition-colors duration-300"
            style={{ backgroundColor: '#0D1117', color: '#E6EDF3' }}
        >
            {/* Background Blobs */}
            <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            {/* Header Section */}
            <div className="flex flex-col items-center pt-12 pb-8">
                <div className="w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20">
                    <span className="material-symbols-outlined text-white text-[32px]">person_add</span>
                </div>
                <h1 className="text-white tracking-tight text-[28px] font-bold leading-tight text-center">
                    开启你的心流之旅
                </h1>
                <p className="text-slate-400 text-sm font-normal pt-2 text-center">
                    创建一个账号以开始追踪你的习惯。
                </p>
            </div>

            {/* Form Section */}
            <div className="flex flex-col w-full max-w-[480px] mx-auto gap-5">

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Name Input */}
                <div className="flex flex-col gap-2">
                    <p className="text-slate-300 text-sm font-semibold px-1">你的姓名</p>
                    <input
                        className="w-full rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-[#2563EB] border border-[rgba(255,255,255,0.12)] bg-[#161B22] h-14 px-4 text-base font-normal transition-all placeholder:text-[#484F58]"
                        placeholder="输入姓名"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-2">
                    <p className="text-slate-300 text-sm font-semibold px-1">邮箱地址</p>
                    <input
                        className="w-full rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-[#2563EB] border border-[rgba(255,255,255,0.12)] bg-[#161B22] h-14 px-4 text-base font-normal transition-all placeholder:text-[#484F58]"
                        placeholder="输入邮箱"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-2">
                    <p className="text-slate-300 text-sm font-semibold px-1">设置密码</p>
                    <input
                        className="w-full rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-[#2563EB] border border-[rgba(255,255,255,0.12)] bg-[#161B22] h-14 px-4 text-base font-normal transition-all placeholder:text-[#484F58]"
                        placeholder="至少 6 位字符"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Register Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-4 w-full h-14 bg-[#2563EB] text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all duration-200 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '正在注册...' : '立即注册'}
                </button>

                {/* Footer Link */}
                <div className="mt-8 mb-4 text-center">
                    <p className="text-slate-500 text-base">
                        已有账号？
                        <button
                            onClick={(e) => { e.preventDefault(); onBackToLogin(); }}
                            className="text-white font-bold hover:text-[#2563EB] transition-colors ml-1"
                        >
                            返回登录
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterView;
