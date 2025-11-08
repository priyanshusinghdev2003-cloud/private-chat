export default function IncomingRequestCard({ incomingRequest, respond }) {
  return (
    <div className="glass rounded-xl p-4 mt-4 w-full max-w-md mx-auto ">
      <p className="text-cyan-300 text-center text-lg">📩 {incomingRequest} wants to be friends</p>
      <div className="flex justify-center gap-4 mt-3">
        <button onClick={() => respond(true)} className="bg-green-500 px-4 py-1 rounded-lg">Accept ✅</button>
        <button onClick={() => respond(false)} className="bg-red-500 px-4 py-1 rounded-lg">Reject ❌</button>
      </div>
    </div>
  );
}
