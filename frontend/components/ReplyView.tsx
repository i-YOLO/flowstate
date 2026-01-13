import React, { useState, useRef } from 'react';

interface ReplyViewProps {
  onCancel: () => void;
  onPost: () => void;
}

const ReplyView: React.FC<ReplyViewProps> = ({ onCancel, onPost }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<string[]>([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA8nZvNyrRPL5ExOiGvsiulNC65a2R-jjBXqTvvk65sqUgMglP5TBbzylbXjMnVUhzzcI27RlixHtabygziZvwkgCM6dRibTM_1PzxUtetQmzPdIYzdIldMkNqltVn7Hb_ND17RnhmV4n6xj2JD9aAapj7YLPz1yxs6HcWxU2bzq2c9RAf1dFBUph1ohAYBmyFZFcFhxZQEzvrZ--6ALeSWL5oiMnjLSICnfVPW259rTAi5uQGzLbpTqf9_29IFaXeaB8WiPWQEN6w',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAEqq9s2sFly0RfMuc1FxxXrUnZnyVq4VCINlXjcwpLa77u-W3qXOQUwV00CcRSewudq74v1W_Td9Dtgps0Y5KC51SS5dHt29v6IEmIVSXayoEIKP8e8y9yCjjpcS_3-bTHUaHO0m80rspdOsnk3fOkdThy15RKj5pkbmoPXVXXR9yOxjP8-WLIcPzW9PLaMQ_tu2eacCtgpsCfvfGmLtsNq88YZtvJs0xLuAe9Fdrh_OxhXJzrxIpMLXwlVbs3_2l-EfV0clOpGZ0'
  ]);
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
  };

  const handleAtClick = () => {
    setText((prev) => prev + '@');
    textareaRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setAttachments(prev => [...prev, imageUrl]);
      
      // Reset input so same file can be selected again if needed
      e.target.value = '';
    }
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="bg-[#0B101B] text-white h-full flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-white/10 shrink-0">
        <button onClick={onCancel} className="text-slate-400 text-sm font-medium hover:text-white transition-colors">取消</button>
        <h2 className="text-white text-base font-bold">回复</h2>
        <div className="w-12"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {/* Context */}
        <div className="px-4 py-3 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">回复给</span>
            <span className="text-xs font-bold text-primary">@sarah_habits</span>
          </div>
          <p className="text-[13px] text-slate-500 mt-1 line-clamp-1 italic">
            "这套装备太棒了！你用的是什么显示器支架？看起来超级..."
          </p>
        </div>

        {/* Input & Attachments */}
        <div className="p-4 space-y-4">
          <textarea 
            ref={textareaRef}
            autoFocus 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-transparent border-none p-0 text-base text-white placeholder:text-slate-600 focus:ring-0 resize-none min-h-[160px] outline-none" 
            placeholder="添加你的回复..."
          ></textarea>

          {/* Attachments */}
          <div className="flex flex-wrap gap-3">
            {attachments.map((url, index) => (
              <div key={index} className="relative group size-20 animate-in zoom-in-50 duration-200">
                <div 
                  className="size-full rounded-xl bg-cover bg-center ring-1 ring-white/10 overflow-hidden" 
                  style={{ backgroundImage: `url('${url}')` }}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
                <button 
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-2 -right-2 size-6 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center shadow-lg cursor-pointer hover:bg-slate-800 hover:scale-105 transition-all z-10"
                >
                  <span className="material-symbols-outlined text-xs text-white">close</span>
                </button>
              </div>
            ))}

            <button 
              onClick={handleGalleryClick}
              className="size-20 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-slate-400 hover:border-white/20 hover:bg-white/5 transition-all"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="bg-[#161e2d] border-t border-white/10 pb-8 px-4 py-2 shrink-0">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            {/* Hidden Inputs */}
            <input 
                type="file" 
                ref={cameraInputRef} 
                className="hidden" 
                accept="image/*" 
                capture="environment"
                onChange={handleFileChange}
            />
            <input 
                type="file" 
                ref={galleryInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />
            
            {/* Buttons */}
            <button onClick={handleCameraClick} className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">photo_camera</span>
            </button>
            <button onClick={handleGalleryClick} className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">image</span>
            </button>
            <button onClick={handleAtClick} className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">alternate_email</span>
            </button>
          </div>
          <button onClick={onPost} className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/20">
              发布
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ReplyView;