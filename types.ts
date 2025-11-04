
export type Sender = 'user' | 'bot';

export enum Topic {
  GREETING = 'GREETING',
  BASIC_CHECK = 'Revisión Básica del Motor',
  REMINDERS = 'Mantenimiento del Motor',
  ALERTS = 'Señales de Alerta',
  TIPS = 'Tips de Cuidado',
  CUSTOM = 'Personalizar',
}

export interface Option {
  text: string;
  topic: Topic;
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  options?: Option[];
}
