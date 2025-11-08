import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Share2, UserPlus, Copy } from "lucide-react";
import { useState } from "react";

export default function Navbar({ myId, onAddFriend }) {
  const [showCopyBox, setShowCopyBox] = useState(false);

  const copyMyId = () => {
    navigator.clipboard.writeText(myId);
    setShowCopyBox(true);
    toast.success("✅ ID Copied");
    setTimeout(() => setShowCopyBox(false), 1500);
  };

  const shareLink = () => {
    const link = `${window.location.origin}?invite=${myId}`;
    navigator.clipboard.writeText(link);
    toast.success(`🔗 Invite Link Copied!c ${myId}`);
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass border border-cyan-500/30 rounded-xl shadow-xl
      w-full px-4 py-3 flex items-center justify-between"
    >

      <h1 className="text-xl md:text-2xl font-bold neon tracking-wide">
        ⚡ Cyber  Chat
      </h1>

      <div className="flex items-center gap-3">

        {/* Copy ID */}
        <h2
          onClick={copyMyId}
          className="p-2 rounded-lg bg-gray-900/60 border border-cyan-500/30 hover:border-cyan-300 transition"
        >
          {myId}
        </h2>

        {/* Share Invite */}
        {myId && <button
          onClick={shareLink}
          className="p-2 rounded-lg bg-gray-900/60 border border-cyan-500/30 hover:border-cyan-300 transition"
        >
          <Share2 size={18} className="text-cyan-300" />
        </button>}

        {/* Add Friend */}
        <button
          onClick={onAddFriend}
          className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black transition"
        >
          <UserPlus size={18} />
        </button>
      </div>

      {showCopyBox && (
        <div className="absolute right-4 top-14 bg-gray-900/90 border border-cyan-500/40 rounded-lg px-4 py-2 text-cyan-300 text-sm shadow-2xl">
          <div className="font-mono">{myId}</div>
        </div>
      )}
    </motion.div>
  );
}
