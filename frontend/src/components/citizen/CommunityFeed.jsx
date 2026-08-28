import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  HandHeart, 
  HelpCircle, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  Radio, 
  WifiOff, 
  Filter,
  PlusCircle,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { triggerHapticFeedback } from '../../utils/haptics';

export default function CommunityFeed({
  currentTheme,
  currentLocation,
  onBack,
  isOnline,
  feedPosts = [],
  onAddNewFeedPost,
  onVerifyFeedPost,
  onReportFeedPost,
  onAddFeedReply
}) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [distanceFilter, setDistanceFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Active Open Reply Box State
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [replyInputText, setReplyInputText] = useState('');

  // New Post Form State
  const [postType, setPostType] = useState('NEED_AID');
  const [postCategory, setPostCategory] = useState('Medical Aid');
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postLocation, setPostLocation] = useState(currentLocation?.address || 'Sector 62, Noida');

  // Filter Logic
  const filteredFeed = feedPosts.filter((post) => {
    if (activeTab === 'OFFICIAL' && !post.isOfficial) return false;
    if (activeTab === 'OFFER' && post.type !== 'OFFER_AID') return false;
    if (activeTab === 'NEED' && post.type !== 'NEED_AID') return false;
    if (activeTab === 'HAZARDS' && post.type !== 'HAZARD_ALERT') return false;

    if (distanceFilter === '2km' && post.distanceKm > 2) return false;
    if (distanceFilter === '5km' && post.distanceKm > 5) return false;

    return true;
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postDesc.trim()) return;

    triggerHapticFeedback('medium');
    const newPost = {
      id: 'FEED-' + Date.now(),
      type: postType,
      category: postCategory,
      title: postTitle.trim(),
      desc: postDesc.trim(),
      location: postLocation.trim(),
      distanceKm: 0.8,
      time: 'Just now',
      author: 'Citizen (You)',
      isOfficial: false,
      confirmedCount: 1,
      reportedCount: 0,
      synced: isOnline,
      comments: []
    };

    onAddNewFeedPost(newPost);
    setPostTitle('');
    setPostDesc('');
    setIsCreateModalOpen(false);
  };

  const handleSendReply = (postId) => {
    if (!replyInputText.trim()) return;
    triggerHapticFeedback('light');

    onAddFeedReply(postId, {
      id: Date.now(),
      user: 'Citizen (You)',
      text: replyInputText.trim(),
      time: 'Just now'
    });

    setReplyInputText('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col space-y-4 animate-fadeIn text-left my-2 pb-12">
      
      {/* Header Bar */}
      <div 
        className="p-4 sm:p-5 rounded-3xl border shadow-lg flex items-center justify-between backdrop-blur-md"
        style={{ backgroundColor: currentTheme.bgCard, borderColor: currentTheme.border }}
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-transform active:scale-90"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: currentTheme.textPrimary }} />
          </button>
          <div>
            <h2 className="text-lg font-black flex items-center space-x-2" style={{ color: currentTheme.textPrimary }}>
              <Radio className="w-5 h-5 text-red-600 animate-pulse" />
              <span>Tactical Community Grid</span>
            </h2>
            <p className="text-[11px]" style={{ color: currentTheme.textMuted }}>
              Hyper-local ground intelligence & peer-to-peer resource network
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-red-600/30 cursor-pointer active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Post Ground Report / Aid</span>
          <span className="sm:hidden">Post</span>
        </button>
      </div>

      {/* Offline Outbox Banner */}
      {!isOnline && (
        <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center space-x-2.5 animate-fadeIn">
          <WifiOff className="w-4 h-4 shrink-0 animate-bounce" />
          <span>Offline Mesh Cache Active. Replies & posts are queued locally and will sync when network connects.</span>
        </div>
      )}

      {/* Official Pinned Authority Broadcast Banner */}
      <div className="p-4 rounded-3xl bg-red-600/10 border-2 border-red-500/40 text-left relative overflow-hidden">
        <div className="flex items-center space-x-2 mb-1">
          <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3" />
            <span>HQ OFFICIAL BROADCAST</span>
          </span>
          <span className="text-[11px] font-bold text-red-600 dark:text-red-400">Pinned Alert • 12 mins ago</span>
        </div>
        <h3 className="text-xs sm:text-sm font-black text-red-700 dark:text-red-300">
          Emergency Transit Camp #4 Activated at Sports Complex
        </h3>
        <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
          Clean drinking water, generator charging hubs, and emergency first-aid kits are open for all residents. Avoid Route 12 due to tree collapse.
        </p>
      </div>

      {/* Tactical Sub-Bar & Radius Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Feeds' },
            { id: 'OFFICIAL', label: 'Verified HQ' },
            { id: 'NEED', label: 'Need Aid 🆘' },
            { id: 'OFFER', label: 'Can Help 🤝' },
            { id: 'HAZARDS', label: 'Road Blocks ⚠️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveTab(tab.id);
              }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100'
              }`}
              style={{ color: activeTab === tab.id ? '#ffffff' : currentTheme.textPrimary }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl shrink-0 self-start sm:self-auto border" style={{ borderColor: currentTheme.border }}>
          <Filter className="w-3.5 h-3.5 ml-1.5 text-stone-400" />
          {[
            { id: '2km', label: '< 2 km' },
            { id: '5km', label: '< 5 km' },
            { id: 'ALL', label: 'City' }
          ].map((dist) => (
            <button
              key={dist.id}
              onClick={() => setDistanceFilter(dist.id)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition cursor-pointer ${
                distanceFilter === dist.id
                  ? 'bg-white dark:bg-stone-800 text-red-600 shadow'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              {dist.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Feed List */}
      <div className="space-y-3.5">
        {filteredFeed.length === 0 ? (
          <div 
            className="p-8 rounded-3xl border text-center my-6"
            style={{ backgroundColor: currentTheme.bgCard, borderColor: currentTheme.border }}
          >
            <HelpCircle className="w-10 h-10 text-stone-400 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold" style={{ color: currentTheme.textMuted }}>
              No ground alerts found under this radius/category.
            </p>
          </div>
        ) : (
          filteredFeed.map((post) => {
            const isOffer = post.type === 'OFFER_AID';
            const isNeed = post.type === 'NEED_AID';
            const isHazard = post.type === 'HAZARD_ALERT';
            const isReplying = activeReplyPostId === post.id;

            return (
              <div
                key={post.id}
                className="p-4 sm:p-5 rounded-3xl border shadow-md transition-all hover:shadow-lg relative overflow-hidden"
                style={{ backgroundColor: currentTheme.bgCard, borderColor: currentTheme.border }}
              >
                {/* Top Meta */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 ${
                        isOffer
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : isNeed
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {isOffer && <HandHeart className="w-3 h-3" />}
                      {isNeed && <HelpCircle className="w-3 h-3" />}
                      {isHazard && <AlertTriangle className="w-3 h-3" />}
                      <span>{isOffer ? 'Aid Offered' : isNeed ? 'Resource Request' : 'Hazard Warning'}</span>
                    </span>

                    {post.confirmedCount >= 3 && (
                      <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[10px] font-black flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Community Verified</span>
                      </span>
                    )}

                    {!post.synced && (
                      <span className="px-2 py-0.5 rounded-lg bg-stone-500/10 text-stone-500 border border-stone-500/30 text-[10px] font-black flex items-center space-x-1">
                        <WifiOff className="w-3 h-3" />
                        <span>Outbox Queued</span>
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-stone-400">{post.time}</span>
                </div>

                {/* Content */}
                <h3 className="text-sm font-black mb-1" style={{ color: currentTheme.textPrimary }}>
                  {post.title}
                </h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: currentTheme.textMuted }}>
                  {post.desc}
                </p>

                {/* Location Bar */}
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-3.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span className="truncate">{post.location}</span>
                  <span>•</span>
                  <span className="text-red-600 dark:text-red-400 font-extrabold">{post.distanceKm} km away</span>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: currentTheme.border }}>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onVerifyFeedPost(post.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-black flex items-center space-x-1.5 cursor-pointer transition active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Ground Truth ({post.confirmedCount})</span>
                    </button>

                    <button
                      onClick={() => onReportFeedPost(post.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-stone-400 text-xs font-bold flex items-center space-x-1 cursor-pointer transition"
                      title="Report misleading"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Report Fake</span>
                    </button>
                  </div>

                  {/* Reply Button Trigger */}
                  <button
                    onClick={() => {
                      triggerHapticFeedback('light');
                      setActiveReplyPostId(isReplying ? null : post.id);
                      setReplyInputText('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-red-500/10 hover:text-red-600 text-xs font-black flex items-center space-x-1.5 cursor-pointer transition"
                    style={{ color: currentTheme.textPrimary }}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-red-500" />
                    <span>{post.comments?.length || 0} Replies</span>
                    {isReplying ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                </div>

                {/* Reply Section & Comment List */}
                {isReplying && (
                  <div className="mt-3 pt-3 border-t border-dashed space-y-2.5 animate-fadeIn" style={{ borderColor: currentTheme.border }}>
                    {/* Existing Comments */}
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {post.comments.map((cmt) => (
                          <div key={cmt.id} className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 text-[11px] leading-relaxed">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-black text-red-600 dark:text-red-400">{cmt.user}</span>
                              <span className="text-[10px] text-stone-400">{cmt.time}</span>
                            </div>
                            <p style={{ color: currentTheme.textPrimary }}>{cmt.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-stone-400 italic">No replies yet. Be the first to share an update.</p>
                    )}

                    {/* Active Input Box */}
                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        placeholder="Write a ground update or offer assistance..."
                        value={replyInputText}
                        onChange={(e) => setReplyInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendReply(post.id);
                        }}
                        className="flex-1 p-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                        style={{
                          backgroundColor: currentTheme.bgPage,
                          borderColor: currentTheme.border,
                          color: currentTheme.textPrimary
                        }}
                      />
                      <button
                        onClick={() => handleSendReply(post.id)}
                        disabled={!replyInputText.trim()}
                        className="px-3.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1 shadow cursor-pointer active:scale-95 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* --- CREATE NEW GROUND REPORT MODAL --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg p-6 rounded-3xl border shadow-2xl animate-scaleUp text-left"
            style={{ backgroundColor: currentTheme.bgCard, borderColor: currentTheme.border }}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: currentTheme.border }}>
              <div>
                <h3 className="text-base font-black" style={{ color: currentTheme.textPrimary }}>
                  Post Ground Intelligence / Resource Aid
                </h3>
                <p className="text-[11px] text-stone-400">Broadcast updates to nearby citizens and disaster response grids</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider block mb-1 text-stone-400">Report Classification</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'NEED_AID', label: 'Need Help 🆘' },
                    { id: 'OFFER_AID', label: 'Offer Aid 🤝' },
                    { id: 'HAZARD_ALERT', label: 'Hazard ⚠️' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPostType(t.id)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-black border transition cursor-pointer ${
                        postType === t.id
                          ? 'bg-red-600 text-white border-red-600 shadow'
                          : 'bg-black/5 dark:bg-white/5 border-transparent opacity-70 hover:opacity-100'
                      }`}
                      style={{ color: postType === t.id ? '#ffffff' : currentTheme.textPrimary }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider block mb-1 text-stone-400">Summary / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drinking Water & Power Generator Available at Block C"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full p-3 rounded-2xl border text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  style={{ backgroundColor: currentTheme.bgPage, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider block mb-1 text-stone-400">Detailed On-Ground Context</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Provide precise details, quantity available, or exact hazard obstruction..."
                  value={postDesc}
                  onChange={(e) => setPostDesc(e.target.value)}
                  className="w-full p-3 rounded-2xl border text-xs focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
                  style={{ backgroundColor: currentTheme.bgPage, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider block mb-1 text-stone-400">Landmark Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 62, Near Gate 01"
                  value={postLocation}
                  onChange={(e) => setPostLocation(e.target.value)}
                  className="w-full p-3 rounded-2xl border text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  style={{ backgroundColor: currentTheme.bgPage, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast to Community Grid</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}