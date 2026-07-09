import React, { useState, useRef, useEffect, useCallback } from 'react';
import API from '../api/axiosInstance';
import { MessageSquare, X, Send, Bot, User, Sparkles, ChefHat } from 'lucide-react';

const Chatbot = ({ onSelectRecipe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I'm your AI Recipe Chef 🍳 Ask me to suggest a vegetarian dish, something spicy, quick weeknight dinner ideas — anything culinary!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const lastScrollY = useRef(window.scrollY);
  const scrollThreshold = 120; // px scrolled before auto-close

  // Auto-scroll chat to newest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px';
    }
  }, [input]);

  // Auto-close chatbot on significant scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - lastScrollY.current);
      if (delta > scrollThreshold && isOpen) {
        setIsOpen(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const suggestions = [
    'Suggest a vegetarian recipe',
    'Something spicy 🌶️',
    'Quick dinner under 30 minutes',
    'Dessert recipe ideas',
  ];

  const handleSend = useCallback(async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await API.post('/chatbot', { message: text });
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.response,
        recommendations: data.recommendedRecipes
      }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Sorry, I'm having trouble connecting to the kitchen AI right now.";
      setMessages(prev => [...prev, { sender: 'bot', text: errMsg }]);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleKeyDown = (e) => {
    // Send on Enter (not Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpen = () => {
    lastScrollY.current = window.scrollY;
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end">

      {/* Chat Window */}
      <div
        className={`mb-3 bg-slate-900 border border-slate-800 rounded-3xl w-[90vw] sm:w-96 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{ maxHeight: isOpen ? '520px' : '0px', height: isOpen ? '520px' : '0px' }}
      >
        {/* Header */}
        <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-md">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-none flex items-center gap-1">
                AI Recipe Chef <Sparkles size={11} className="text-orange-400" />
              </h3>
              <span className="text-[10px] text-green-400 font-semibold">Online & ready</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
            aria-label="Close chatbot"
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/40 overscroll-contain">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[87%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-1.5 rounded-full h-fit shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-orange-600/20 text-orange-400' : 'bg-slate-800 text-slate-300'}`}>
                  {msg.sender === 'user' ? <User size={12} /> : <ChefHat size={12} />}
                </div>
                <div className="space-y-2">
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-tr-none'
                      : 'bg-slate-800/80 text-slate-300 rounded-tl-none border border-slate-700/50'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Recipe Recommendations */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1.5">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Matched Recipes:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.recommendations.map((rec) => (
                          <button
                            key={rec.id || rec._id}
                            onClick={() => { onSelectRecipe(rec); setIsOpen(false); }}
                            className="text-[10px] font-bold bg-orange-600/10 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/20 px-2.5 py-1 rounded-lg transition-all active:scale-95"
                          >
                            🍽️ {rec.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-2 items-center">
                <div className="p-1.5 rounded-full bg-slate-800 text-slate-300">
                  <ChefHat size={12} />
                </div>
                <div className="flex space-x-1 p-3 bg-slate-800/50 rounded-2xl rounded-tl-none border border-slate-700/30">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick suggestions (shown on first message) */}
        {messages.length === 1 && !loading && (
          <div className="px-3 pb-2 pt-1 bg-slate-900/80 border-t border-slate-800/50 flex flex-wrap gap-1.5 shrink-0">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="text-[10px] bg-slate-800 hover:bg-orange-600/20 hover:text-orange-400 text-slate-400 border border-slate-700 hover:border-orange-500/40 px-2.5 py-1 rounded-full transition-all active:scale-95"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Input form with auto-growing textarea */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="p-3 bg-slate-800 border-t border-slate-700/50 flex gap-2 items-end shrink-0"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for recipe suggestions... (Enter to send)"
            disabled={loading}
            rows={1}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500 transition-colors disabled:opacity-50 resize-none overflow-hidden leading-relaxed"
            style={{ minHeight: '34px', maxHeight: '100px' }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center shrink-0 self-end"
            aria-label="Send message"
          >
            <Send size={14} />
          </button>
        </form>
      </div>

      {/* FAB Trigger Button */}
      <button
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className={`p-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-full shadow-2xl text-white active:scale-95 transition-all flex items-center justify-center border border-orange-500/20 group relative`}
        title={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
      >
        <div className={`transition-all duration-300 ${isOpen ? 'rotate-90 scale-90' : 'rotate-0 scale-100'}`}>
          {isOpen ? <X size={26} /> : <Bot size={26} className="group-hover:rotate-12 transition-transform duration-300" />}
        </div>
        {/* Ping indicator (only when closed) */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
          </span>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
