import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { Button } from '../button';
import ReactMarkdown from 'react-markdown';
import { useItinerary } from '../../../features/itinerary/hooks/useItinerary';

function ChatbotWidget() {
  const { itineraryData, setItineraryData } = useItinerary();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! I am your AI travel guide. Exploring a new city or need an itinerary? Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input.trim() };
    const currentHistory = [...messages];
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          history: currentHistory,
          currentItinerary: itineraryData
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
      
      if (data.updatedItinerary) {
        setItineraryData(data.updatedItinerary);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: 'model', text: "I'm sorry, I encountered an error and couldn't process your request. Please ensure the backend is connected and the API key is configured." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 sm:right-8 z-50 w-full max-w-[340px] sm:max-w-[380px] h-[500px] max-h-[70vh] flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-slate-950/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                  <MessageSquare size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white">AI Travel Guide</h3>
                  <p className="text-xs text-slate-300">Powered by Gemini</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md overflow-hidden ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm' 
                        : 'bg-white/10 text-slate-100 border border-white/5 rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      <div className="space-y-2">
                        <ReactMarkdown 
                           components={{
                             p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                             h1: ({node, ...props}) => <h1 className="text-base font-bold text-cyan-300 mt-3 mb-1" {...props} />,
                             h2: ({node, ...props}) => <h2 className="text-base font-bold text-cyan-300 mt-3 mb-1" {...props} />,
                             h3: ({node, ...props}) => <h3 className="text-sm font-bold text-cyan-300 mt-3 mb-1" {...props} />,
                             ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />,
                             ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1 mb-2" {...props} />,
                             li: ({node, ...props}) => <li className="text-slate-200" {...props} />,
                             strong: ({node, ...props}) => <strong className="font-semibold text-white inline" {...props} />,
                           }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-slate-300 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm shadow-md flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-cyan-400" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="border-t border-white/10 bg-slate-900/50 p-3">
              <div className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about a destination..."
                  className="w-full rounded-full border border-white/20 bg-slate-950 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-slate-400 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1 h-8 w-8 rounded-full hero-gradient-btn text-white disabled:opacity-50"
                >
                  <Send size={14} />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full hero-gradient-btn shadow-xl shadow-cyan-900/30 text-white transition-all hover:shadow-cyan-900/50 focus:outline-none"
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </>
  );
}

export default ChatbotWidget;
