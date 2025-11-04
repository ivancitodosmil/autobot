import { Message, Topic, Option } from './types';

export const INITIAL_OPTIONS: Option[] = [
  { text: 'Revisión Básica del Motor', topic: Topic.BASIC_CHECK },
  { text: 'Mantenimiento del Motor', topic: Topic.REMINDERS },
  { text: 'Señales de Alerta', topic: Topic.ALERTS },
  { text: 'Tips de Cuidado', topic: Topic.TIPS },
];

export const INITIAL_MESSAGE: Message = {
  id: 'init',
  sender: 'bot',
  text: '¡Hola! Soy Autobot, tu asistente de mantenimiento preventivo. ¿En qué puedo ayudarte hoy?',
  options: INITIAL_OPTIONS,
};