import React, { useState, useRef, useEffect } from 'react';
import { getBotResponse } from './services/geminiService';
import { Message, Topic, Option } from './types';
import { INITIAL_MESSAGE, INITIAL_OPTIONS } from './constants';
import { UserIcon, BotIcon, SendIcon, AutobotLogo } from './components/icons';


const SimpleMarkdownParser: React.FC<{ text: string }> = ({ text }) => {
  // This parser handles bold text and unordered lists.
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/(\r\n|\n|\r)/gm, "\n") // Standardize line breaks
    .split('\n')
    .map(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('* ')) {
        return `<li>${trimmedLine.substring(2)}</li>`; // List items
      }
      return line ? `<p>${line}</p>` : '';
    })
    .join('')
    // Group consecutive list items into a single <ul>
    .replace(/(<li>.*<\/li>)+/gs, (match) => `<ul class="list-disc list-inside my-2 space-y-1">${match}</ul>`);

  return <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
};


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
            {message.options.map((option) => (
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

/**
 * Nuevo componente de pantalla de carga
 */
const LoadingScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-base-100 text-gray-200 font-sans">
    <style>
      {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
      `}
    </style>
    <AutobotLogo className="w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 mb-8 text-primary animate-spin-slow" />
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-widest animate-pulse">AUTOBOT</h1>
    <p className="mt-4 text-lg sm:text-xl text-gray-400">Cargando Asistente Para Mantenimiento Preventivo del Motor de tu Vehículo...</p>
  </div>
);

const WelcomeScreen: React.FC<{
  onStartChat: (option: Option) => void;
  onCustomQuestion: (question: string) => void;
}> = ({ onStartChat, onCustomQuestion }) => {
  const [questionInput, setQuestionInput] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionInput.trim()) {
      onCustomQuestion(questionInput);
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 sm:p-6 md:p-8 text-center animate-fadeIn">
      <AutobotLogo className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-4 text-primary" />
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-wider">AUTOBOT</h1>
      <p className="mt-2 text-md sm:text-lg lg:text-xl text-gray-400">Tu Asistente Experto en Motores Vehiculares</p>
      <p className="mt-6 sm:mt-8 mb-6 max-w-md lg:max-w-xl text-gray-300 text-base lg:text-lg">
        ¡Hola! Soy Autobot. Selecciona un tema para comenzar o haz tu pregunta directamente.
      </p>
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mt-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {INITIAL_OPTIONS.map((option) => (
            <button
              key={option.topic}
              onClick={() => onStartChat(option)}
              className="bg-base-200 text-gray-200 border border-base-300/50 px-5 py-4 rounded-lg text-base hover:bg-primary hover:text-white transition-all duration-200 transform hover:scale-105 w-full text-left flex items-center justify-between"
            >
              <span>{option.text}</span>
              <span className="text-primary/50 text-xl">&rarr;</span>
            </button>
          ))}
        </div>
      </div>
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mt-8">
        <form onSubmit={handleFormSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-1 bg-base-200 border-2 border-base-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent text-white transition-all"
          />
          <button
            type="submit"
            className="bg-accent text-white rounded-lg p-3.5 hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-110 disabled:scale-100"
            disabled={!questionInput.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic>(Topic.GREETING);
  const [isChatActive, setIsChatActive] = useState(false);
  
  // 1. Nuevo estado para la carga inicial de la aplicación
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 2. Simulación de la carga inicial por 2 segundos
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 5000); 

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    if (isChatActive) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isChatActive]);

  const handleSendMessage = async (text: string, topic: Topic, isFirstMessage = false) => {
    if (!text.trim()) return;
    if (!isChatActive) setIsChatActive(true);

    const messageHistory = isFirstMessage ? [INITIAL_MESSAGE] : messages;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
    };

    const updatedMessages = [...messageHistory.map(m => ({ ...m, options: undefined })), userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setCurrentTopic(topic);
    setUserInput('');

    const botResponseText = await getBotResponse(updatedMessages, userMessage, topic);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      sender: 'bot',
    };
    
    // After a custom question, show main options again to guide the user.
    if (topic === Topic.CUSTOM) {
        botMessage.options = INITIAL_OPTIONS;
    }

    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setIsLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(userInput, Topic.CUSTOM);
  };
  
  const handleOptionClick = (option: Option) => {
    handleSendMessage(option.text, option.topic);
  };

  // 3. Renderizado condicional: si está cargando, muestra la pantalla de carga.
  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col h-screen bg-base-100 text-gray-200 font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-0"></div>
      
      {!isChatActive ? (
        <WelcomeScreen
          onStartChat={(option) => handleSendMessage(option.text, option.topic, true)}
          onCustomQuestion={(question) => handleSendMessage(question, Topic.CUSTOM, true)}
        />
      ) : (
        <div className="relative z-10 flex flex-col h-full">
            <header className="bg-base-100/80 backdrop-blur-sm border-b border-base-300/50 p-4 sm:px-6 text-center shrink-0">
                <div className="flex items-center justify-center gap-3 max-w-4xl mx-auto">
                    <div className="text-primary"><AutobotLogo className="w-7 h-7" /></div>
                    <h1 className="text-xl font-bold text-primary tracking-wider">AUTOBOT</h1>
                </div>
                <p className="text-sm text-gray-400">Tu Asistente Experto en Motores</p>
            </header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="max-w-4xl mx-auto">
                    {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} onOptionClick={handleOptionClick} />
                    ))}
                    {isLoading && (
                    <div className="flex items-start gap-3 my-4 justify-start animate-fadeIn">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 ring-2 ring-primary/50 flex items-center justify-center text-primary shadow-lg">
                            <BotIcon />
                        </div>
                        <div className="bg-base-200 shadow-md p-4 rounded-xl flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </main>

            <footer className="bg-base-100/80 backdrop-blur-sm p-4 sm:px-6 border-t border-base-300/50 shrink-0">
                <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto flex items-center gap-3">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Escribe tu pregunta aquí..."
                        className="flex-1 bg-base-200 border-2 border-base-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent text-white transition-all"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-accent text-white rounded-lg p-3 hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-110 disabled:scale-100"
                        disabled={isLoading || !userInput.trim()}
                        aria-label="Send message"
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