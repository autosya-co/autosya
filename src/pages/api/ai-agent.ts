import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFileContent, updateFileContent } from '../../lib/github';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { prompt, filePath, action, config } = await request.json();

    if (!prompt || !filePath) {
      return new Response(JSON.stringify({ error: 'Faltan parámetros' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Obtener contenido actual
    const { content, sha } = await getFileContent(filePath);

    // 2. Configuración para Google AI Studio (Gemini API)
    const apiKey = config?.apiKey || import.meta.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Falta GEMINI_API_KEY' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: config?.modelId || "gemini-1.5-flash" });

    const fullPrompt = `
      Eres un Agente Constructor experto en Astro 6 y Tailwind CSS 4.
      Tu tarea es modificar el código fuente de un archivo basado en la instrucción del usuario.
      
      CONTENIDO ACTUAL DEL ARCHIVO (${filePath}):
      \`\`\`
      ${content}
      \`\`\`
      
      INSTRUCCIÓN DEL USUARIO:
      ${prompt}
      
      REGLAS:
      1. Retorna ÚNICAMENTE el código completo y actualizado del archivo.
      2. No añadas explicaciones, ni bloques de markdown (como \`\`\`astro).
      3. Mantén el estilo y la estructura existente del proyecto.
      4. Si la instrucción no es clara o no se puede realizar, retorna el código original sin cambios.
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const generatedCode = response.text().trim();

    // Limpiar posibles bloques markdown si el modelo los incluyó a pesar de la instrucción
    const cleanCode = generatedCode.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '');

    // 3. Acciones: 'preview' solo retorna el código, 'push' realiza el commit
    if (action === 'push') {
      const commitMessage = `AI Builder: ${prompt.substring(0, 50)}...`;
      await updateFileContent(filePath, cleanCode, sha, commitMessage);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Cambio pusheado a producción con éxito',
        code: cleanCode 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Por defecto (preview)
    return new Response(JSON.stringify({ 
      success: true, 
      code: cleanCode 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error en AI Agent:', error);
    return new Response(JSON.stringify({ 
      error: 'Error procesando la solicitud', 
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
