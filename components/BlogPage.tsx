import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { apiRequest, apiFetch } from '../services/api';
import ReactMarkdown from 'react-markdown';

interface BlogPageProps {
    onBack: () => void;
    onStart: () => void;
    isAuthenticated: boolean;
    userRole?: string;
    userName?: string;
}

interface BlogPost {
    id: string;
    title: string;
    content: string;
    image_url?: string;
    created_at: string;
    profiles?: {
        full_name: string;
        avatar_url?: string;
    };
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBack, onStart, isAuthenticated, userRole }) => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Admin Manual Entry State
    const [newTitle, setNewTitle] = useState('');
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [newContent, setNewContent] = useState('');

    const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

    // Fetch blogs on mount (Public access)
    useEffect(() => {
        fetchBlogs();
    }, []); // No dependency on isAuthenticated

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            // Public endpoint, so apiRequest might need adjustment if it enforces token? 
            // apiRequest usually adds token if available. If endpoint is public, it ignores it.
            // Let's assume standard fetch for public if apiRequest fails without token (though apiRequest handles optional auth often)
            // But to be safe for unauthed users, let's use standard fetch if not authed, or just standard fetch always for public route
            const res = await apiFetch('/blogs');
            const data = await res.json();
            if (Array.isArray(data)) {
                setBlogs(data);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', newTitle);
            formData.append('slug', newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
            formData.append('content', newContent);
            formData.append('status', 'published');

            if (newImageFile) {
                formData.append('image', newImageFile);
            }

            // Using fetch directly for FormData to avoid Content-Type header issues with JSON helpers causes
            const token = localStorage.getItem('token');
            const res = await apiFetch('/blogs', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Content-Type is purposely undefined to let browser set boundary for FormData
                },
                body: formData
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Upload failed:', res.status, errorText);

                // Handle 401 Invalid Token specifically
                if (res.status === 401) {
                    alert('Your session has expired. Please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    // Reload to force state reset
                    window.location.reload();
                    return;
                }

                throw new Error(`Server Error (${res.status}): ${errorText}`);
            }

            alert('Blog post published successfully!');
            // Reset form
            setNewTitle('');
            setNewImageFile(null);
            setNewContent('');
            fetchBlogs();
        } catch (error: any) {
            console.error('Error saving blog:', error);
            alert(`Failed to publish: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans flex flex-col">
            {/* Navigation */}
            <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 group">
                        <Logo className="w-8 h-8 text-medical-600" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-medical-600 to-medical-500">
                            MDnexa Blog
                        </span>
                    </button>
                    {!isAuthenticated && (
                        <button onClick={onStart} className="text-sm font-semibold text-medical-600 dark:text-medical-400 hover:underline">
                            Login
                        </button>
                    )}
                </div>
            </nav>

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

                {/* Admin Create Section */}
                {isAuthenticated && userRole === 'admin' && (
                    <div className="mb-12 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold">Create New Blog Post</h2>
                        </div>
                        <form onSubmit={handleManualSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Enter blog title..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Image</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setNewImageFile(e.target.files ? e.target.files[0] : null)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-medical-50 file:text-medical-700 hover:file:bg-medical-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content (Markdown)</label>
                                <textarea
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    placeholder="Write your article here..."
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none resize-y"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading || !newTitle.trim() || !newContent.trim()}
                                    className="px-6 py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-medical-600/20 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? 'Publishing...' : 'Publish Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-8 relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search medical insights..."
                        className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-medical-500 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Blog Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        No blogs found. {isAuthenticated && userRole === 'admin' ? 'Try creating one!' : ''}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map(blog => {
                            const displayImage = blog.image_url;

                            return (
                                <div
                                    key={blog.id}
                                    onClick={() => setSelectedBlog(blog)}
                                    className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800 cursor-pointer flex flex-col h-full"
                                >
                                    <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                                        {displayImage ? (
                                            <img src={displayImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <Logo className="w-12 h-12 opacity-20" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                            Medical
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold mb-3 line-clamp-2 text-slate-900 dark:text-white group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors">
                                            {blog.title}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                                            {blog.content.replace(/[#*`]/g, '').substring(0, 150)}...
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                                            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                            <span>Read More →</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Blog Modal/Detail View */}
            {selectedBlog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedBlog(null)}>
                    <div
                        className="bg-white dark:bg-slate-950 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-slide-up"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="h-64 sm:h-80 relative flex-shrink-0">
                            {selectedBlog.image_url && (
                                <img src={selectedBlog.image_url} alt={selectedBlog.title} className="w-full h-full object-cover" />
                            )}
                            <button
                                onClick={() => setSelectedBlog(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">{selectedBlog.title}</h1>
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <ReactMarkdown>{selectedBlog.content}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
