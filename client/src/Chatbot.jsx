import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, User, Bot } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me about appointments or timings.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(
    () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages, isOpen]
  );

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { text: input, sender: "user" };
    setMessages((p) => [...p, userMsg]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/ask", {
        message: userMsg.text,
      });
      setMessages((p) => [...p, { text: res.data.reply, sender: "bot" }]);
    } catch {
      setMessages((p) => [
        ...p,
        { text: "Server offline. Call +91 9342258492", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-white w-[320px] h-[450px] rounded-2xl shadow-2xl flex flex-col border overflow-hidden"
          >
            <div className="bg-teal-600 p-4 text-white flex justify-between">
              <div className="flex gap-2 items-center">
                <Sparkles size={16} />
                <b>Dental AI</b>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded max-w-[80%] text-sm ${
                    m.sender === "user"
                      ? "ml-auto bg-slate-800 text-white"
                      : "bg-white border"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-2 border-t flex gap-2">
              <input
                className="flex-1 border rounded px-2 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type..."
              />
              <button
                type="submit"
                className="bg-teal-600 text-white p-2 rounded"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
      >
        <MessageCircle />
      </button>
    </div>
  );
};
export default Chatbot;
