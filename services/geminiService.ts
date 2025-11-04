import { GoogleGenAI } from "@google/genai";
import { Message, Topic } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = ai.models;

// *** INSTRUCCIÓN DEL SISTEMA (MODIFICADA: AÑADE FEEDBACK SOLO PARA CUSTOM) ***
const getSystemInstruction = (topic: Topic) => {
    let customInstruction = '';
    
    // AÑADE LA INSTRUCCIÓN DE FEEDBACK SOLO SI EL TÓPICO ES CUSTOM
    if (topic === Topic.CUSTOM) {
        customInstruction = '\n\nDespués de responder a la pregunta abierta del usuario, **DEBES** incluir la siguiente frase al final de tu respuesta para solicitar feedback:\n\n**¿Te ha sido útil esta información? Si no fue así, por favor, reformula tu pregunta para que pueda ayudarte mejor.**';
    }

    return `
You are "Autobot", a friendly, professional, and educational chatbot specializing in preventive vehicle maintenance. Your name is Autobot. You MUST respond in Spanish. Use markdown for formatting. Keep responses concise and focused.

Current Conversation Topic: "${topic}"

Your task is to respond to the user's message based on the current topic.

Here are your strict instructions for each topic (Solo aplica para las continuaciones del diálogo, después de la primera respuesta):
- **${Topic.GREETING}**: This is the initial state. You've already greeted the user. Wait for their selection.
- **${Topic.BASIC_CHECK}**: **Ya has iniciado la guía de revisión de aceite.** Tu tarea es simplemente responder a la pregunta del usuario sobre el nivel de aceite y continuar la guía (ej. si está bajo, sugerir rellenar; si está bien, preguntar por el refrigerante, etc.).
- **${Topic.ALERTS}**: **Ya has proporcionado la lista de alertas.** Tu tarea es responder a la consulta del usuario, dándole una causa probable y una recomendación de acción INMEDIATA. Manten siempre un tono de urgencia y seguridad ("visita un mecánico profesional").
- **${Topic.REMINDERS}**: **Ya proporcionaste el consejo de cambio de aceite y mantenimiento general.** Tu tarea es responder a cualquier pregunta de seguimiento del usuario sobre ese tema o cualquier otra consulta sobre programas de mantenimiento general.
- **${Topic.TIPS}**: **Ya has proporcionado los tips iniciales al usuario.** Tu tarea es responder a cualquier pregunta de seguimiento del usuario sobre esos tips o cualquier otra consulta general sobre el cuidado del motor.
- **${Topic.CUSTOM}**: Answer the user's open-ended question directly and helpfully.

**REGLA DE FORMATO ESTRICTA:** **ESTRICTAMENTE NO DEBES utilizar comillas simples (backticks: \` \`)** para destacar nombres de tópicos o frases. Utiliza **negritas (** **) ** en su lugar para mantener un tono amigable.

If a user asks something outside of vehicle maintenance, politely steer them back to your purpose.
${customInstruction}
`;
};

// *** RESPUESTAS INICIALES QUEMADAS (SIN CAMBIOS) ***
const getInitialResponse = (topic: Topic): string | null => {
    switch (topic) {
        case Topic.BASIC_CHECK:
            return `¡Excelente elección! La **"Revisión Básica del Motor"** es fundamental para la salud de tu vehículo.
Comencemos con el **aceite del motor**, que es la sangre de tu coche.

1. Asegúrate de que el vehículo esté en una **superficie plana** y el motor **apagado y frío** (al menos 15-20 minutos después de haberlo usado).
2. Localiza la **varilla medidora del aceite** (suele tener un mango de color brillante, como amarillo o naranja).
3. Sácala, límpiala con un paño o papel, e insértala de nuevo hasta el fondo.
4. Retírala nuevamente y observa el nivel del aceite.

**¿El nivel de aceite está entre las marcas de "Mín" y "Máx" en la varilla?**`;

        case Topic.REMINDERS:
            return `¡Un buen programa de **Mantenimiento del Motor** es vital! Aquí tienes un resumen de las tareas más importantes:

### ⚙️ Mantenimiento Esencial

1.  **Cambio de Aceite y Filtro:**
    * **Aceite Convencional/Mineral:** Cámbialo cada **5,000 km** o 6 meses.
    * **Aceite Semisintético:** Cámbialo cada **8,000 km** o 9 meses.
    * **Aceite Sintético:** Cámbialo cada **10,000 a 15,000 km** o 1 año.
    * *Sigue siempre las indicaciones exactas del manual de tu vehículo.*

2.  **Filtro de Aire del Motor:**
    * Generalmente se cambia cada **20,000 km** o 1 año. Un filtro limpio asegura un flujo de aire adecuado y una mejor eficiencia.

3.  **Revisión de Líquidos:**
    * Mensualmente, verifica el nivel de **refrigerante** (¡solo con motor frío!) y el **líquido de frenos**.

4.  **Revisión de Neumáticos:**
    * Revisa la presión de inflado semanalmente y realiza la **rotación de neumáticos** cada **10,000 km** para asegurar un desgaste uniforme.

¿Tienes alguna otra pregunta sobre el calendario de mantenimiento o deseas saber más detalles de alguna de estas revisiones?`;
            
        case Topic.TIPS:
            // Respuesta de Tips de Cuidado - CON EMOJIS (Como en tu código)
            return `¡Buena Iniciativa! Los **Tips de Cuidado** 🛡️ son la clave para prolongar la vida útil de tu motor y mantener tu vehículo en excelente estado.

Aquí tienes 5 tips esenciales para comenzar:

1.  **🚗 Respeta los Tiempos de Calentamiento:** No aceleres bruscamente apenas enciendas el motor. Deja que el aceite circule y alcance la temperatura de operación óptima (unos 30-60 segundos es suficiente).
2.  **💧 Usa el Aceite Correcto:** Siempre utiliza el tipo de aceite (sintético, semisintético, y viscosidad) recomendado por el fabricante de tu vehículo. Esto reduce la fricción y el desgaste.
3.  **🧊 No Fuerces el Motor en Frío:** Evita llevar las RPM al límite hasta que el indicador de temperatura del motor haya alcanzado su nivel normal.
4.  **📈 Revisa tus Fluidos Regularmente:** Acostúmbrate a revisar el nivel de aceite, refrigerante y otros fluidos al menos una vez al mes. La falta de fluidos es una causa principal de fallas graves.
5.  **👂 Presta Atención a los Ruidos:** Cualquier ruido inusual (golpeteo, chillidos, silbidos) es una señal de que algo necesita atención. Ignorarlos puede convertir un problema menor en una reparación costosa.

¿Tienes alguna pregunta específica sobre alguno de estos tips o deseas más información sobre un aspecto particular del cuidado del motor?`;

        case Topic.ALERTS:
            // Respuesta de Señales de Alerta - CON EMOJIS (Tabla original)
            return `🚨 ¡ATENCIÓN! Si tu motor presenta alguna de estas señales, es crucial actuar de inmediato para prevenir daños graves.

| Señal de Alerta | Posible Causa y Acción Inmediata | Urgencia |
| :--- | :--- | :--- |
| **Luz de Aceite Encendida** 💡 | **Falta de presión/nivel de aceite.** Detén el motor *inmediatamente* de forma segura para evitar la destrucción del motor. | **¡MÁXIMA!** 🛑 |
| **Humo Azul/Grisáceo** 💨 | **Quema de aceite** (problemas de sellos o anillos). Requiere revisión profesional urgente. | **ALTA** ⚠️ |
| **Humo Blanco Excesivo** ☁️ | **Quema de refrigerante/agua.** Posible junta de culata dañada. Detén el vehículo y apaga el motor para evitar daños por calor. | **ALTA** ⚠️ |
| **Ruido de Golpeteo Fuerte** 🔨 | **Fallo interno mayor** (bielas, pistones). No uses el vehículo. Llama a una grúa. | **¡MÁXIMA!** 🛑 |
| **Motor se Sobrecalienta** 🔥 | **Falla del sistema de enfriamiento.** Detén el vehículo y apaga el motor para evitar daños por calor. | **¡MÁXIMA!** 🛑 |

Si experimentas una alerta, por favor, **escribe el síntoma específico** que estás viendo (ej. "sale humo azul") y te diré qué hacer.`;

        default:
            return null; 
    }
}

// *** FUNCIÓN PRINCIPAL (SIN CAMBIOS) ***
export const getBotResponse = async (history: Message[], newUserMessage: Message, topic: Topic): Promise<string> => {
    
    // 1. MANEJO DE RESPUESTA INICIAL QUEMADA
    if (history.length === 0) {
        const initialResponse = getInitialResponse(topic);
        if (initialResponse) {
            return initialResponse;
        }
    }

    // 2. PREPARACIÓN DE LA LLAMADA A GEMINI
    const cleanedUserMessageText = newUserMessage.text; 

    const geminiModel = topic === Topic.ALERTS ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

    const contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
    }));

    // Agregar el mensaje del usuario para la API
    contents.push({
        role: 'user',
        parts: [{ text: cleanedUserMessageText }],
    });

    try {
        const response = await model.generateContent({
            model: geminiModel,
            contents: contents,
            config: {
                systemInstruction: getSystemInstruction(topic),
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Lo siento, estoy teniendo problemas para conectarme. Por favor, inténtalo de nuevo más tarde.";
    }
};