import { motion } from "framer-motion";

export default function AddFriendModal({ open, setOpen, friendIdInput, setFriendIdInput, sendFriendRequest }) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"

    >
      <motion.div
        initial={{ scale: .8 }} animate={{ scale: 1 }}
        className="glass p-6 w-80 rounded-2xl text-center shadow-xl "
      >
        <h3 className="text-xl mb-4 font-semibold neon">Add Friend</h3>
        <input
          className="bg-gray-800 w-full px-3 py-2 rounded-lg outline-none text-cyan-300"
          placeholder="Enter Friend ID"
          value={friendIdInput}
          onChange={(e) => setFriendIdInput(e.target.value)}
        />
        <div className="flex justify-between mt-5">
          <button onClick={sendFriendRequest} className="bg-cyan-500 px-4 py-1 rounded-lg">Send</button>
          <button onClick={() => setOpen(false)} className="bg-red-500 px-4 py-1 rounded-lg">Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
