import React, { useState, useRef, useEffect } from 'react';
import { getBotResponse } from './services/geminiService';
import { Message, Topic, Option } from './types';
import { INITIAL_MESSAGE, INITIAL_OPTIONS } from './constants';
import { UserIcon, BotIcon, SendIcon, AutobotLogo } from './components/icons';

/* -------------------------------------------------------
   SIMPLE MARKDOWN PARSER
------------------------------------------------------- */
const SimpleMarkdownParser: React.FC<{ text: string }> = ({ text }) => {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/(\r\n|\n|\r)/gm, "\n")
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('* ')) {
        return `<li>${trimmed.substring(2)}</li>`;
      }
      return line ? `<p>${line}</p>` : '';
    })
    .join('')
    .replace(/(<li>.*<\/li>)+/gs, (match) => `<ul class="list-disc list-inside my-2 space-y-1">${match}</ul>`);

  return <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
};

/* -------------------------------------------------------
   MESSAGE COMPONENT
------------------------------------------------------- */
const ChatMessage: React.FC<{ message: Message; onOptionClick: (option: Option) => void }> = ({ message, onOptionClick }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start gap-3 my-4 animate-fadeIn ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 ring-2 ring-primary/50 flex items-center justify-center text-primary shadow-lg">
          <BotIcon />
        </div>
      )}

      <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div className={`max-w-xs sm:max-w-md lg:max-w-xl p-4 rounded-xl text-white ${isBot ? 'bg-base-200 shadow-md' : 'bg-accent shadow-md'}`}>
          <SimpleMarkdownParser text={message.text} />
        </div>

        {message.options && (
          <div className="flex flex-wrap gap-2 mt-4 max-w-xs sm:max-w-md lg:max-w-xl">
            {message.options.map(option => (
              <button
                key={option.topic}
                onClick={() => onOptionClick(option)}
                className="bg-base-300 text-gray-200 border border-primary/50 px-4 py-2 rounded-lg text-sm hover:bg-primary hover:text-white transition-all duration-200 transform hover:scale-105"
              >
                {option.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {!isBot && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-base-300 flex items-center justify-center text-white shadow-lg">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------
   LOADING SCREEN
------------------------------------------------------- */
const LoadingScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-base-100 text-gray-200 font-sans">
    <style>
      {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin 2s linear infinite; }
      `}
    </style>

    <AutobotLogo className="w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 mb-8 text-primary animate-spin-slow" />

    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-widest animate-pulse">
      AUTOBOT
    </h1>

    <p className="mt-4 text-lg sm:text-xl text-gray-400">
      Cargando Asistente para Mantenimiento Preventivo...
    </p>
  </div>
);

/* -------------------------------------------------------
   WELCOME SCREEN (100% RESPONSIVO)
------------------------------------------------------- */
const WelcomeScreen: React.FC<{
  onStartChat: (option: Option) => void;
  onCustomQuestion: (question: string) => void;
}> = ({ onStartChat, onCustomQuestion }) => {

  const [questionInput, setQuestionInput] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionInput.trim()) onCustomQuestion(questionInput);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 sm:px-6 md:px-8 text-center animate-fadeIn">

      <AutobotLogo className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mb-4 text-primary" />

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide text-primary">
        AUTOBOT
      </h1>

      <p className="mt-2 text-base sm:text-lg lg:text-xl text-gray-400">
        Tu Asistente Experto en Motores Vehiculares
      </p>

      <p className="mt-6 sm:mt-8 mb-6 max-w-lg sm:max-w-xl lg:max-w-2xl text-gray-300 text-base sm:text-lg leading-relaxed">
        ¡Hola! Soy Autobot. Selecciona un tema para comenzar o escribe tu pregunta directamente.
      </p>

      <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INITIAL_OPTIONS.map((option) => (
            <button
              key={option.topic}
              onClick={() => onStartChat(option)}
              className="bg-base-200 text-gray-200 border border-base-300/50 px-5 py-4 rounded-lg text-base sm:text-lg hover:bg-primary hover:text-white transition-all duration-200 transform hover:scale-105 w-full flex items-center justify-between"
            >
              <span>{option.text}</span>
              <span className="text-primary/50 text-xl">&rarr;</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl mt-8">
        <form onSubmit={submit} className="flex items-center gap-3">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 bg-base-200 border-2 border-base-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/80 text-white transition-all"
          />
          <button
            type="submit"
            disabled={!questionInput.trim()}
            className="bg-accent text-white rounded-lg p-3.5 hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-110 disabled:scale-100"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   MAIN APP (CON INACTIVIDAD)
------------------------------------------------------- */
const App: React.FC = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic>(Topic.GREETING);
  const [isChatActive, setIsChatActive] = useState(false);

  const [isAppLoading, setIsAppLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* INACTIVIDAD */
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

    inactivityTimer.current = setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 999).toString(),
          sender: "bot",
          text: "⚠️ Parece que no has interactuado en un rato. Para continuar, por favor **recarga la página** 🔄"
        }
      ]);

      setIsChatActive(false);

    }, 5 * 60 * 1000);
  };

  /* LOADING INITIAL */
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  /* SCROLL */
  useEffect(() => {
    if (isChatActive)
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isChatActive]);

  /* SEND MESSAGE */
  const handleSendMessage = async (text: string, topic: Topic, first = false) => {
    if (!text.trim()) return;

    resetInactivityTimer();

    if (!isChatActive) setIsChatActive(true);

    const history = first ? [INITIAL_MESSAGE] : messages;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "user"
    };

    const updated = [...history.map(m => ({ ...m, options: undefined })), userMsg];

    setMessages(updated);
    setIsLoading(true);
    setCurrentTopic(topic);
    setUserInput('');

    const botText = await getBotResponse(updated, userMsg, topic);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: botText,
      sender: "bot"
    };

    if (topic === Topic.CUSTOM)
      botMsg.options = INITIAL_OPTIONS;

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(userInput, Topic.CUSTOM);
  };

  const handleOptionClick = (option: Option) => {
    handleSendMessage(option.text, option.topic);
  };

  if (isAppLoading) return <LoadingScreen />;

  return (
    <div className="flex flex-col h-screen bg-base-100 text-gray-200 font-sans overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] 
          [background-size:16px_16px] 
          [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-0">
      </div>

      {!isChatActive ? (
        <WelcomeScreen
          onStartChat={(option) => handleSendMessage(option.text, option.topic, true)}
          onCustomQuestion={(q) => handleSendMessage(q, Topic.CUSTOM, true)}
        />
      ) : (
        <div className="relative z-10 flex flex-col h-full">

          <header className="bg-base-100/80 backdrop-blur-sm border-b border-base-300/50 p-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <AutobotLogo className="w-7 h-7 text-primary" />
              <h1 className="text-xl font-bold text-primary tracking-wider">AUTOBOT</h1>
            </div>
            <p className="text-sm text-gray-400">Tu Asistente Experto en Motores</p>
          </header>

          <main className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto">

              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} onOptionClick={handleOptionClick} />
              ))}

              {isLoading && (
                <div className="flex items-start gap-3 my-4">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary/20 ring-2 ring-primary/50 rounded-full flex items-center justify-center text-primary">
                    <BotIcon />
                  </div>

                  <div className="bg-base-200 p-4 rounded-xl flex items-center space-x-2 shadow-md">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </main>

          <footer className="bg-base-100/80 backdrop-blur-sm p-4 border-t border-base-300/50">
            <form onSubmit={submit} className="max-w-4xl mx-auto flex items-center gap-3">
              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                disabled={isLoading || !isChatActive}
                className="flex-1 bg-base-200 border-2 border-base-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/80 text-white transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !userInput.trim() || !isChatActive}
                className="bg-accent text-white rounded-lg p-3 hover:bg-green-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                <SendIcon />
              </button>
            </form>
          </footer>

        </div>
      )}
    </div>
  );
};

export default App;
