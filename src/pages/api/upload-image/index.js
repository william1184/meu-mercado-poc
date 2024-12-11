import GenerativeLanguageApi from '@/lib/generative_ai_api';
import formidable from 'formidable';
import fs from 'fs';

const apiKey = process.env.GOOGLE_API_KEY; // Certifique-se de definir sua chave de API no arquivo .env.local

// Configuração para permitir o parsing de arquivos
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({ multiples: false }); // Atualizado para a nova API

    form.uploadDir = '/tmp'; // Diretório temporário para uploads
    form.keepExtensions = true; // Manter a extensão do arquivo

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao processar a imagem' });
      }
      const imagePath = files.image[0].filepath;

      const generativeApi = new GenerativeLanguageApi(apiKey);
      try {
        const json = await generativeApi.uploadImageGenerateContent(imagePath);

        // Excluir o arquivo após o processamento bem-sucedido
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Erro ao excluir o arquivo:', unlinkErr);
          } else {
            console.log('Arquivo excluído com sucesso:', imagePath);
          }
        });

        return res.status(200).json({ data: json });
      } catch (error) {
        console.log(error);

        // Excluir o arquivo mesmo em caso de erro
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Erro ao excluir o arquivo:', unlinkErr);
          } else {
            console.log('Arquivo excluído com sucesso:', imagePath);
          }
        });

        return res.status(500).json({ error: 'Failed to generate content' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}