// lib/generativeLanguageApi.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
import crypto from "crypto"; // Para gerar um hash único para cada imagem
import fs from "fs";

// Access your API key as an environment variable
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

// Objeto em memória para armazenar o cache
const imageCache = {};

class GenerativeLanguageApi {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }

  async uploadImageGenerateContent(imagePath) {
    // Gerar um hash único para a imagem com base no conteúdo do arquivo
    const imageHash = crypto
      .createHash("sha256")
      .update(fs.readFileSync(imagePath))
      .digest("hex");

    // Verificar se o resultado já está no cache
    if (imageCache[imageHash]) {
      console.log("Cache hit for image:", imageHash);
      return imageCache[imageHash];
    }

    const filePart1 = fileToGenerativePart(imagePath, "image/jpeg");

    const imageParts = [filePart1];

    const model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });
    const hoje = new Date().toISOString().split("T")[0];

    const prompt = `
    Você é uma IA especializada em leitura e extração de informações de cupons fiscais. Sua tarefa é analisar o texto de um cupom fiscal e retornar as informações no formato JSON especificado abaixo. Caso alguma informação não seja encontrada no cupom, insira o valor 'Nao encontrado'. Certifique-se de seguir o formato JSON fornecido:

    produtos: Uma lista de objetos contendo:

    nome: Nome do produto.
    codigo: Código do produto.
    quantidade: Quantidade adquirida.
    unidade: Unidade de medida (ex.: 'un', 'kg').
    preco_unitario: Preço unitário do produto.
    preco_total: Preço total do produto.
    data: Data da compra no formato YYYY-MM-DD.

    apelido: Um apelido ou descrição para a compra. Caso não enconttrado, "CUPOM + campo data"

    total: O valor total da compra.

    Se alguma informação não for encontrada, preencha com 'Nao encontrado' em campos string, 0 em campos inteiro e ${hoje} em campos data .

    Exemplo de JSON esperado:
    {
      "produtos": [
        {
          "nome": "Produto A",
          "codigo": "12345",
          "quantidade": 2,
          "unidade": "un",
          "preco_unitario": 50.0,
          "preco_total": 100.0
        },
        {
          "nome": "Produto B",
          "codigo": "67890",
          "quantidade": 1,
          "unidade": "un",
          "preco_unitario": 150.0,
          "preco_total": 150.0
        }
      ],
      "data": "2023-10-01",
      "apelido": "Compra de Outubro",
      "total": 250.0
    }
    Agora, analise o seguinte texto de um cupom fiscal e retorne o JSON correspondente. Sem formatação`;

    const result = await model.generateContent([prompt, ...imageParts]);

    // Processar o resultado e armazenar no cache
    const parsedResult = JSON.parse(
      result.response.text().replace("```json", "").replace("```", "")
    );
    imageCache[imageHash] = parsedResult;

    return parsedResult;
  }
}

export default GenerativeLanguageApi;