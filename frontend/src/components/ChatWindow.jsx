export default function ChatWindow({ chat, message, setMessage, sendMessage, myId, activeFriend, goBack }) {

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="glass border border-cyan-500/40 flex-1 rounded-xl p-4 flex flex-col h-full">

      {!activeFriend ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <p className="text-gray-400 text-center">Select a friend to start chatting</p>
        </div>
      ) : (
        <>
          {/* ✅ MOBILE BACK BUTTON */}
          <div className="md:hidden mb-3">
            <button
              onClick={goBack}
              className="px-3 py-1 rounded-lg border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 transition"
            >
              ← Back
            </button>
          </div>

          {/* CHAT MESSAGES */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.from === myId ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-3 py-2 rounded-xl max-w-xs break-words ${
                    m.from === myId ? "bg-cyan-500 text-black" : "bg-gray-800 text-cyan-200"
                  }`}
                >
                  {m.message}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT BOX */}
          <div className="flex mt-3">
            <input
              className="flex-1 bg-gray-900/70 px-3 py-2 rounded-l-lg outline-none
              border border-cyan-500/40 text-cyan-200"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
            />

            <button
              onClick={sendMessage}
              className="bg-cyan-500 hover:bg-cyan-400 px-4 rounded-r-lg text-black font-semibold transition"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
