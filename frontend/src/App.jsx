import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import AddFriendModal from "./components/AddFriendModal";
import IncomingRequestCard from "./components/IncomingRequestCard";
import FriendList from "./components/FriendList";
import ChatWindow from "./components/ChatWindow";
import Loader from "./components/Loader";
import BackgroundGrid from "./components/BackgroundGrid";

const socket = io(import.meta.env.VITE_BACKEND_URL, { autoConnect: true });

export default function App() {
  const [booting, setBooting] = useState(true);
  const [myId, setMyId] = useState("");
  const [friends, setFriends] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [chat, setChat] = useState({});
  const [unread, setUnread] = useState({});
  const [message, setMessage] = useState("");

  const [mobileView, setMobileView] = useState("friends"); // "friends" | "chat"

  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [friendIdInput, setFriendIdInput] = useState("");

  const [incomingRequest, setIncomingRequest] = useState(null);

  // Boot splash
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Auto invite accept
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get("invite");

    if (invite && invite !== myId) {
      socket.emit("send-friend-request", { to: invite });
      toast(`📨 Auto friend request sent to ${invite}`);
      window.history.replaceState({}, "", "/");
    }
  }, [myId]);

  // Socket setup
  useEffect(() => {
    socket.on("your-id", setMyId);

    socket.on("incoming-request", ({ from }) => {
      setIncomingRequest(from);
      toast(`📩 Friend request from ${from}`);
    });

    socket.on("friend-accepted", ({ from }) => {
      setFriends((prev) => [...new Set([...prev, from])]);
      toast.success(`✅ Connected with ${from}`);
      setIncomingRequest(null);
    });

    socket.on("receive-message", ({ from, message }) => {
      setChat((prev) => ({
        ...prev,
        [from]: [...(prev[from] || []), { from, message }]
      }));
      if (from !== activeFriend) {
        setUnread((prev) => ({ ...prev, [from]: true }));
      }
    });

    socket.on("friend-left", ({ userId }) => {
      toast(`⚠️ ${userId} disconnected`, { icon: "💨" });
      setFriends((prev) => prev.filter((f) => f !== userId));
      if (activeFriend === userId) setActiveFriend(null);
    });

    return () => socket.off();
  }, [activeFriend]);

  // Send friend request
  const sendFriendRequest = () => {
    if (!friendIdInput.trim()) return toast.error("Enter ID");
    socket.emit("send-friend-request", { to: friendIdInput.trim() });
    toast.success("📨 Friend Request Sent!");
    setFriendIdInput("");
    setIsAddFriendOpen(false);
  };

  // Respond to request
  const respondRequest = (accept) => {
    socket.emit("respond-friend-request", { from: incomingRequest, accepted: accept });
    setIncomingRequest(null);
  };

  // Send message
  const sendMessage = () => {
    if (!message.trim() || !activeFriend) return;

    socket.emit("send-message", { to: activeFriend, message });

    setChat((prev) => ({
      ...prev,
      [activeFriend]: [...(prev[activeFriend] || []), { from: myId, message }]
    }));

    toast.success("💬 Message Sent");
    setMessage("");
  };

  if (booting) return <Loader />;

  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      <BackgroundGrid />
      <Toaster position="top-center" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 h-screen flex flex-col">

        <Navbar myId={myId} onAddFriend={() => setIsAddFriendOpen(true)} />

        {incomingRequest && (
          <IncomingRequestCard incomingRequest={incomingRequest} respond={respondRequest} />
        )}

        {/* Responsive Chat Layout */}
        <div className="flex flex-1 mt-6 h-full w-full">

          {/* FRIEND LIST */}
          <div
            className={`
              h-full
              ${mobileView === "chat" ? "hidden" : "block"}
              md:block
              md:w-72
              w-full
            `}
          >
            <FriendList
              friends={friends}
              activeFriend={activeFriend}
              unread={unread}
              setActiveFriend={(f) => {
                setActiveFriend(f);
                setUnread((prev) => ({ ...prev, [f]: false }));
                setMobileView("chat");
              }}
            />
          </div>

          {/* CHAT WINDOW */}
          <div
            className={`
              flex-1
              ${mobileView === "friends" ? "hidden" : "block"}
              md:block
            `}
          >
            <ChatWindow
              chat={chat[activeFriend] || []}
              myId={myId}
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              activeFriend={activeFriend}
              goBack={() => setMobileView("friends")}
            />
          </div>

        </div>
      </div>

      <AddFriendModal
        open={isAddFriendOpen}
        setOpen={setIsAddFriendOpen}
        friendIdInput={friendIdInput}
        setFriendIdInput={setFriendIdInput}
        sendFriendRequest={sendFriendRequest}
      />
    </div>
  );
}
