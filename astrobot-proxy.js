// api/astrobot-proxy.js - Node.js para Vercel/Netlify Functions
// O Vercel/Netlify vai ler a chave de uma variável de ambiente segura.

const API_KEY = process.env.GEMINI_API_KEY; 
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

export default async (req, res) => {
    // 1. Validar que é um POST
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        // 2. Encaminhar o corpo da requisição para a API do Google
        const geminiResponse = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await geminiResponse.json();

        // 3. Retornar o erro ou a resposta do Gemini
        if (!geminiResponse.ok) {
            // Retorna o erro exato para o cliente (pode ser útil para depuração)
            res.status(geminiResponse.status).json({ 
                error: 'GEMINI_API_ERROR', 
                message: data.error?.message || 'Erro desconhecido da API.' 
            });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Proxy Internal Error:", error);
        res.status(500).json({ error: 'SERVER_ERROR', message: 'Erro interno do AsthroBot proxy. Verifique logs do servidor.' });
    }
};
