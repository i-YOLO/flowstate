import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: () => void;
  onGoToRegister: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onGoToRegister }) => {
  const [email, setEmail] = useState('demo@flowstate.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.email);
        onLogin();
      } else {
        setError('登录失败，请检查邮箱和密码');
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
      <div className="flex flex-col items-center pt-16 pb-10">
        <div className="w-20 h-20 bg-[#2563EB] rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20">
          <span className="material-symbols-outlined text-white text-[48px]">calendar_today</span>
        </div>
        <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight text-center">
          掌控你的时间。
        </h1>
        <p className="text-slate-400 text-base font-normal leading-normal pt-2 text-center">
          登录以同步你的习惯和日历。
        </p>
      </div>

      {/* Form Section */}
      <div className="flex flex-col w-full max-w-[480px] mx-auto gap-5">

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

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
          <div className="flex justify-between items-center px-1">
            <p className="text-slate-300 text-sm font-semibold">密码</p>
            <a className="text-[#2563EB] text-sm font-bold hover:text-white transition-colors" href="#">忘记密码？</a>
          </div>
          <div className="flex w-full items-stretch rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#161B22] focus-within:ring-2 focus-within:ring-[#2563EB] overflow-hidden transition-all">
            <input
              className="flex-1 border-none bg-transparent h-14 text-white px-4 text-base font-normal outline-none focus:ring-0 placeholder:text-[#484F58]"
              placeholder="输入密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full h-14 bg-[#2563EB] text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all duration-200 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '正在登录...' : '登录'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-6">
          <div className="h-px flex-1 bg-white/5"></div>
          <p className="text-slate-500 text-sm font-medium">或通过以下方式继续</p>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-3 w-full h-14 bg-[#161B22] border border-[rgba(255,255,255,0.12)] rounded-xl text-white font-semibold transition-all hover:bg-white/5">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Google
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-8 mb-4 text-center">
          <p className="text-slate-500 text-base">
            新用户？
            <button
              onClick={(e) => { e.preventDefault(); onGoToRegister(); }}
              className="text-white font-bold hover:text-[#2563EB] transition-colors ml-1"
            >
              创建账号
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;