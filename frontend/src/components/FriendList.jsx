export default function FriendList({ friends, setActiveFriend, activeFriend, unread }) {
  return (
    <div className="glass border border-cyan-500/40 p-4 w-64 rounded-xl h-full">
      <h3 className="text-lg font-semibold mb-3 neon">Friends</h3>

      {friends.length === 0 ? <p className="text-gray-400">No friends yet</p> :
        friends.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFriend(f)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg my-1 transition
              ${activeFriend === f ? "bg-cyan-500 text-black" : "hover:bg-cyan-400/20 text-cyan-300"}`}
          >
            {f}
            {unread?.[f] && activeFriend !== f && (
              <span className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></span>
            )}
          </button>
        ))}
    </div>
  );
}
