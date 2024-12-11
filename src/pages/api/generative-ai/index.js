// pages/api/generate-content.js
import crypto from 'crypto';
import GenerativeLanguageApi from '../../../lib/generative_ai_api';

const cache = {}; // Objeto em memória para armazenar o cache

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { prompt, image } = req.body;

        if (!prompt || !image) {
            return res.status(400).json({ error: 'Prompt and image are required' });
        }

        const apiKey = process.env.GOOGLE_API_KEY; // Certifique-se de definir sua chave de API no arquivo .env.local
        const generativeApi = new GenerativeLanguageApi(apiKey);

        try {
            // Gerar um hash único para a imagem
            const imageHash = crypto.createHash('sha256').update(image).digest('hex');

            // Verificar se o resultado já está no cache
            if (cache[imageHash]) {
                console.log('Cache hit for image:', imageHash);
                return res.status(200).json({ response: cache[imageHash] });
            }

            // Processar a imagem se não estiver no cache
            const result = await generativeApi.generateContent(prompt);

            // Concatenar todas as partes do conteúdo gerado
            const concatenatedResponse = result.candidates[0].content.parts
                .map(part => part.text)
                .join(' '); // Junta as partes com um espaço entre elas

            // Armazenar o resultado no cache
            cache[imageHash] = concatenatedResponse;

            return res.status(200).json({ response: concatenatedResponse });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Failed to generate content' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}