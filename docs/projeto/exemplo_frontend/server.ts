import express from 'express';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url'; // Importação necessária para o ESM

// --- CORREÇÃO DO __dirname EM ES MODULE ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Converte explicitamente para número para evitar erro de tipo do TS
const PORT = Number(process.env.PORT) || 3000;

// Servir os arquivos estáticos (para CSS, imagens, etc. se houver)
app.use(express.static(__dirname));

// Rota principal que serve o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// Iniciar o servidor escutando em 0.0.0.0 (permite acesso em toda a rede local)
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n🚀 Servidor iniciado com sucesso!');
    console.log(`➜ Acesso Local (este PC):     http://localhost:${PORT}`);
    
    // Busca automaticamente o IP da rede local para você acessar de outros dispositivos
    const networkInterfaces = os.networkInterfaces();
    Object.keys(networkInterfaces).forEach((ifaceName) => {
        const iface = networkInterfaces[ifaceName];
        if (iface) {
            iface.forEach((details) => {
                if (details.family === 'IPv4' && !details.internal) {
                    console.log(`➜ Acesso na Rede (celular/outros): http://${details.address}:${PORT}`);
                }
            });
        }
    });
    
    console.log('\n⚠️  Certifique-se de que o PC e o dispositivo de teste estão na mesma rede Wi-Fi.\n');
});