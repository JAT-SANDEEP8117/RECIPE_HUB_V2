import React, { useState, useRef, useEffect } from 'react';
import API from '../api/axiosInstance';
import { MessageSquare, X, Send, Bot, User, Sparkles, ChefHat } from 'lucide-react';

const Chatbot = ({ onSelectRecipe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your AI Recipe Assistant. Ask me to recommend a recipe from our website, or suggest something vegetarian, spicy, or easy!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const suggestions = [
    'Suggest me a vegetarian recipe',
    'Suggest something spicy',
    'Recommend something quick and easy',
    'What should I cook for dinner?'
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add user message to log
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
      console.error(err);
      const errMsg = err.response?.data?.message || 'I am sorry, but I am having trouble connecting to the kitchen AI at the moment.';
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: errMsg 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-full shadow-2xl text-white active:scale-95 transition-all flex items-center justify-center border border-orange-500/20 group"
          title="Open AI Assistant"
        >
          <Bot size={28} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-80 sm:w-96 h-[500px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <Bot size={22} className="text-orange-500" />
              <div>
                <h3 className="text-sm font-bold text-white leading-none flex items-center gap-1">
                  AI Recipe Chef <Sparkles size={12} className="text-orange-400" />
                </h3>
                <span className="text-[10px] text-green-400 font-semibold">Online & ready</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-900/40">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-2 rounded-full h-fit flex items-center justify-center ${msg.sender === 'user' ? 'bg-orange-600/20 text-orange-400' : 'bg-slate-800 text-slate-300'}`}>
                    {msg.sender === 'user' ? <User size={14} /> : <ChefHat size={14} />}
                  </div>
                  
                  <div className="space-y-2">
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-orange-600 text-white rounded-tr-none' 
                        : 'bg-slate-800/80 text-slate-300 rounded-tl-none border border-slate-800'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Recommendations links if any */}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="p-2 bg-slate-950/40 border border-slate-800 rounded-xl space-y-1.5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Matched recipes:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.recommendations.map((rec) => (
                            <button
                              key={rec.id}
                              onClick={() => onSelectRecipe(rec)}
                              className="text-[10px] font-bold bg-orange-600/10 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/20 px-2 py-1 rounded-lg transition-all"
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

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 items-center">
                  <div className="p-2 rounded-full bg-slate-800 text-slate-300">
                    <ChefHat size={14} />
                  </div>
                  <div className="flex space-x-1 p-3 bg-slate-800/50 rounded-2xl rounded-tl-none border border-slate-850">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions chips */}
          {messages.length === 1 && (
            <div className="p-2 border-t border-slate-850 bg-slate-900/80 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug)}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2.5 py-1 rounded-full border border-slate-700/50 transition-all active:scale-95"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-slate-800 border-t border-slate-700/50 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask for recipe suggestions..."
              disabled={loading}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
