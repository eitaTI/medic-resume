import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Excluir diretório exemplo_frontend do build
  typescript: {
    ignoreBuildErrors: false,
  },
  // Ignorar erros de tipo em diretórios não relacionados
  experimental: {
    // Isso não resolve o problema diretamente, mas ajuda
  },
};

export default nextConfig;
