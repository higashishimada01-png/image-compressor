<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>画像圧縮ツールくん - 安心・安全な画像軽量化ツール</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/lucide/0.263.0/lucide.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Noto+Sans+JP:wght@400;700;900&display=swap');
        body { font-family: 'Inter', 'Noto Sans JP', sans-serif; }
        .border-3 { border-width: 3px; }
    </style>
</head>
<body class="bg-[#F8FAFC]">
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useRef } = React;

        // --- Lucide Icons Replacement (Inline SVG) ---
        const Icon = ({ name, size = 24, className = "" }) => {
            const icons = {
                Upload: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
                Download: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
                Zap: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                Smile: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>,
                Check: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>,
                ArrowRight: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
                User: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                Lock: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
                FileText: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
                ShieldCheck: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
                Smartphone: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>,
                X: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
                Settings: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            };
            return icons[name] || null;
        };

        const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
            const baseStyle = "font-bold rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
            const variants = {
                primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-200 py-3 px-6",
                secondary: "bg-white border-2 border-gray-100 hover:border-blue-200 text-gray-600 hover:text-blue-600 py-3 px-6",
                danger: "text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2",
            };
            return (
                <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
                    {children}
                </button>
            );
        };

        function App() {
            const [currentPage, setCurrentPage] = useState('home');
            const [files, setFiles] = useState([]);
            const [quality, setQuality] = useState(0.8);
            const [isProcessing, setIsProcessing] = useState(false);
            const [dragActive, setDragActive] = useState(false);
            const fileInputRef = useRef(null);

            const compressImage = async (file, currentQuality) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (event) => {
                        const img = new Image();
                        img.src = event.target.result;
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                            const format = 'image/jpeg';
                            const compressedDataUrl = canvas.toDataURL(format, currentQuality);
                            const head = 'data:' + format + ';base64,';
                            const size = Math.round((compressedDataUrl.length - head.length) * 3 / 4);
                            resolve({
                                id: file.name + Date.now(),
                                originalFile: file,
                                originalPreview: img.src,
                                compressedPreview: compressedDataUrl,
                                originalSize: file.size,
                                compressedSize: size,
                                fileName: file.name,
                            });
                        };
                    };
                });
            };

            const handleFiles = async (fileList) => {
                setIsProcessing(true);
                const validFiles = Array.from(fileList).filter(file => file.type.startsWith('image/'));
                if (validFiles.length === 0) {
                    setIsProcessing(false);
                    return;
                }
                const processed = await Promise.all(validFiles.map(file => compressImage(file, quality)));
                setFiles(prev => [...processed, ...prev]);
                setIsProcessing(false);
            };

            const formatSize = (bytes) => {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['Bytes', 'KB', 'MB', 'GB'][i];
            };

            return (
                <div className="min-h-screen">
                    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                            <button onClick={() => setCurrentPage('home')} className="flex items-center gap-3 group">
                                <div className="bg-gradient-to-tr from-blue-500 to-indigo-500 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                                    <Icon name="Smile" size={28} />
                                </div>
                                <h1 className="text-xl font-extrabold text-gray-800">画像圧縮ツールくん</h1>
                            </button>
                        </div>
                    </header>

                    <main className="max-w-5xl mx-auto px-6 py-12">
                        {currentPage === 'home' ? (
                            <div className="animate-in fade-in duration-700">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-gray-800">
                                        画像を<span className="text-blue-500">ギュッ！</span>と軽くします。
                                    </h2>
                                    <p className="text-gray-500 text-lg">サーバーに送らないから安心。ブラウザだけで完結します。</p>
                                </div>

                                <div 
                                    className={`border-3 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                                    onDragOver={(e) => {e.preventDefault(); setDragActive(true);}}
                                    onDragLeave={() => setDragActive(false)}
                                    onDrop={(e) => {e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files);}}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                                    <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        {isProcessing ? <Icon name="Zap" className="animate-spin" /> : <Icon name="Upload" />}
                                    </div>
                                    <p className="text-xl font-bold text-gray-700">ここに画像をドロップ</p>
                                    <p className="text-gray-400">またはクリックして選択</p>
                                </div>

                                {files.map(file => (
                                    <div key={file.id} className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                                        <img src={file.originalPreview} className="w-24 h-24 object-cover rounded-xl" />
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800 truncate">{file.fileName}</p>
                                            <p className="text-sm text-gray-400">{formatSize(file.originalSize)} → <span className="text-blue-600 font-bold">{formatSize(file.compressedSize)}</span></p>
                                        </div>
                                        <Button onClick={() => {
                                            const a = document.createElement('a'); a.href = file.compressedPreview; a.download = `min_${file.fileName}`; a.click();
                                        }}>
                                            <Icon name="Download" size={18} />保存
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-3xl border border-gray-100">
                                <h2 className="text-2xl font-bold mb-4">運営者情報</h2>
                                <p>昭和生まれ。画像圧縮ツールを一人で作りました。安全性を第一に考えています。</p>
                                <p className="mt-4 text-blue-600">Email: dongshantian674@gmail.com</p>
                            </div>
                        )}
                    </main>

                    <footer className="max-w-5xl mx-auto px-6 py-12 text-center text-gray-400 text-sm">
                        <div className="flex justify-center gap-6 mb-4">
                            <button onClick={() => setCurrentPage('home')}>ホーム</button>
                            <button onClick={() => setCurrentPage('operator')}>運営者情報</button>
                        </div>
                        <p>&copy; 2026 umegaoka-connect.site</p>
                    </footer>
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>