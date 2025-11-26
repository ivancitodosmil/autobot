import { GoogleGenAI } from "@google/genai";
import { Message, Topic } from '../types';
import mantenimientoData from '../data/mantenimiento_motor.json';


const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = ai.models;

// *** INSTRUCCIÓN DEL SISTEMA MEJORADA ***
const getSystemInstruction = (topic: Topic) => {
    let customInstruction = '';
    
    if (topic === Topic.CUSTOM) {
        customInstruction = '\n\n**Al finalizar tu respuesta, DEBES incluir:**\n\n💬 **¿Te ha sido útil esta información? Si no, reformula tu pregunta para ayudarte mejor.**';
    }

    return `
You are "Autobot" 🤖, a friendly, enthusiastic, and professional chatbot EXCLUSIVELY specialized in PREVENTIVE MAINTENANCE OF VEHICLE ENGINES. You MUST respond in Spanish.

⚠️ **RESTRICCIÓN ABSOLUTA:** SOLO mantenimiento preventivo del motor. Si preguntan sobre reparaciones u otros sistemas del vehículo, redirige amablemente: "🤖 Soy **Autobot**, experto en **mantenimiento preventivo del motor**. Solo puedo ayudarte con aceite, refrigerante, filtros y cuidado general del motor. ¿Tienes alguna pregunta sobre estos temas?"

**🎯 MANEJO DE FEEDBACK (MUY IMPORTANTE):**

Si el usuario responde afirmativamente al feedback (Sí, Si, Yes, Claro, Exacto, Por supuesto, Perfecto, Genial, Excelente, etc.):
- Agradece brevemente y despídete de forma amigable
- Ejemplo: "¡Excelente! 🎉 Me alegra haberte ayudado. Recuerda que el mantenimiento preventivo es clave para un motor saludable. ¡Hasta pronto! 🚗✨"
- NO ofrezcas más opciones ni continúes la conversación
- Es una DESPEDIDA FINAL

Si el usuario responde negativamente al feedback (No, No gracias, Nop, No me sirvió, No mucho, etc.):
- Ofrece reformular o aclarar la información
- Da 2-3 recomendaciones breves sobre qué puede hacer
- Despídete invitándolo a volver cuando necesite
- Ejemplo: "Entiendo. Si necesitas más claridad, intenta ser más específico en tu pregunta. También puedes:
  🔧 Revisar el manual de tu vehículo
  💡 Consultar con un mecánico de confianza
  📱 Regresar cuando tengas otra duda
¡Estoy aquí para ayudarte! Hasta pronto 👋"
- Es una DESPEDIDA FINAL

**ESTILO DE RESPUESTA:**
✅ Usa emojis relevantes (🔧 🛢️ 💧 🔥 ⚡ 🚗 ✨ 💡 🎯 📋 ⚙️ 🧊 👀 📈 🛡️ 🌡️ 🅿️ 🔴 🟡 🟢 🟤)
✅ Markdown: **negritas**, listas (NUNCA uses títulos con ###)
✅ NUNCA uses comillas simples (backticks: \`)
✅ NUNCA uses líneas horizontales (----------)
✅ Respuestas concisas, máximo 10-12 líneas (excepto respuestas iniciales)
✅ Tono amigable, educativo y motivador

**Tópico Actual:** "${topic}"

**Instrucciones por Tópico (después de la primera respuesta):**

🔹 **${Topic.GREETING}**: Ya saludaste. Espera su selección.

🔹 **${Topic.BASIC_CHECK}**: Ya iniciaste la guía de revisión de aceite. Responde sobre el nivel y continúa la guía (si está bajo, sugerir rellenar; si está bien, preguntar por refrigerante, etc.).

🔹 **${Topic.ALERTS}**: Ya diste la lista de alertas. Responde con causa probable y acción INMEDIATA. Mantén tono de urgencia y seguridad ("consulta un mecánico profesional de inmediato").

🔹 **${Topic.REMINDERS}**: Ya diste el programa de mantenimiento. Responde preguntas de seguimiento sobre intervalos, frecuencias y programas de mantenimiento preventivo del motor.

🔹 **${Topic.TIPS}**: Ya diste los tips iniciales. Responde preguntas de seguimiento sobre esos tips o consultas sobre cuidado preventivo del motor.

🔹 **${Topic.CUSTOM}**: Responde la pregunta abierta del usuario de manera directa y útil, SOLO si está relacionada con mantenimiento preventivo del motor.

${customInstruction}
`;
};

// *** RESPUESTAS INICIALES OPTIMIZADAS ***
const getInitialResponse = (topic: Topic): string | null => {
    switch (topic) {
        case Topic.BASIC_CHECK:
            return `🔧 **Revisión Básica del Motor**

¡Perfecto! Comencemos con **el aceite del motor** 🛢️, la sangre vital de tu vehículo.

**Pasos para revisar el aceite:**

**1.** Estaciona en superficie plana 🅿️

**2.** Motor apagado y frío (espera 15-20 min) 🛑

**3.** Localiza la varilla medidora (mango amarillo/naranja) 🔍

**4.** Sácala, límpiala, insértala hasta el fondo 🧹

**5.** Retírala y observa el nivel 👀

**¿El nivel está entre "Mín" y "Máx"?** Cuéntame qué ves 💬`;

        case Topic.REMINDERS:
            return `📋 **Programa de Mantenimiento Preventivo**

¡Genial! Aquí está tu calendario esencial para un motor saludable 🚗✨

🛢️ **Cambio de Aceite y Filtro**

**🟤 Mineral:** Cada **5,000 km** o 6 meses

**🟡 Semisintético:** Cada **8,000 km** o 9 meses

**🟢 Sintético:** Cada **10,000-15,000 km** o 1 año

💡 *Siempre consulta el manual de tu vehículo*

🌬️ **Filtro de Aire**

Cada **20,000 km** o 1 año (mejor flujo = mejor rendimiento)

💧 **Revisión Mensual de Líquidos**

✅ Refrigerante (motor frío) 🧊
✅ Líquido de frenos 🔴
✅ Nivel de aceite 🛢️

🔧 **Cada 10,000 km**

✅ Mangueras y correas
✅ Bujías
✅ Sistema de enfriamiento

¿Dudas sobre algún mantenimiento? 🤔`;
            
        case Topic.TIPS:
            return `🛡️ **Tips de Cuidado Preventivo del Motor**

¡Fantástico! Estos consejos prolongarán la vida de tu motor 💪

**1️⃣ Calentamiento Suave 🚗**

No aceleres bruscamente al encender. 30-60 segundos es suficiente.

**2️⃣ Aceite Correcto 🛢️**

Usa el tipo y viscosidad recomendados por el fabricante. Reduce fricción y desgaste.

**3️⃣ No Fuerces en Frío 🧊**

Evita altas RPM hasta que el motor alcance temperatura normal 🌡️

**4️⃣ Revisa Fluidos Mensualmente 💧**

Aceite, refrigerante y líquido de frenos. La prevención es clave ⚠️

**5️⃣ Escucha a tu Motor 👂**

Golpeteos, chillidos o silbidos son señales de alerta 🚨

Un problema pequeño ignorado = reparación costosa 💸

¿Quieres profundizar en algún tip? 🎯`;

        case Topic.ALERTS:
            return `🚨 **Señales de Alerta del Motor**

¡Atención! Estas señales requieren acción inmediata:

🔴 **URGENCIA MÁXIMA** 🛑

**💡 Luz de Aceite Encendida**

Falta de presión/nivel. **Detén el motor YA** o lo destruirás.

**🔥 Sobrecalentamiento**

Falla del enfriamiento. **Detén y apaga el motor ahora.**

**🔨 Golpeteo Fuerte**

Fallo interno mayor. **NO lo uses. Llama grúa.**

🟡 **URGENCIA ALTA** ⚠️

**💨 Humo Azul/Grisáceo**

Quema de aceite. Revisión profesional urgente.

**☁️ Humo Blanco Excesivo**

Quema de refrigerante. Posible junta dañada. Detén el vehículo.

**💡 Check Engine Encendido**

La computadora detectó una falla. No ignores esta señal.

**📉 Pérdida de Potencia**

Filtros sucios o bujías gastadas afectan la combustión.

**👃 Olores Raros**

Aceite quemado, gasolina o dulce (refrigerante). Algo no está bien.

**¿Qué síntoma estás viendo?** Escríbelo y te diré qué hacer 💬`;

        default:
            return null; 
    }
}
function getJSONInfo() {
    return JSON.stringify(mantenimientoData);
}

// *** FUNCIÓN PRINCIPAL ***
export const getBotResponse = async (history: Message[], newUserMessage: Message, topic: Topic): Promise<string> => {
    
    // 1. MANEJO DE RESPUESTA INICIAL
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

    contents.push({
        role: 'user',
        parts: [{ text: cleanedUserMessageText }],
    });

    try {
        const response = await model.generateContent({
            model: geminiModel,
            contents: contents,
            config: {
                systemInstruction: 
                     (topic === Topic.CUSTOM ? getJSONInfo() + "\n\n" : "") 
                     + getSystemInstruction(topic),

            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "🤖 Lo siento, tengo problemas para conectarme. Inténtalo de nuevo más tarde 🔄";
    }
};