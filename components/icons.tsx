import React from 'react';

export const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M15 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2.35a2.5 2.5 0 0 0-1.8.7l-.85.85a1 1 0 0 1-1.4 0l-.85-.85a2.5 2.5 0 0 0-1.8-.7H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"/>
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0Z"/>
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
);

export const AutobotLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M3.51465 9H6.51465" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M17.4854 9H20.4854" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M3.51465 15H6.51465" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M17.4854 15H20.4854" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 3.51465V6.51465" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 17.4854V20.4854" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 3.51465V6.51465" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 17.4854V20.4854" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);


export const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);