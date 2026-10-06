export const MAX_ARQUIVO_MB = 10

export const MAX_SUBMISSAO_MB = 35

export function paraMegabytes(bytes: number): number {
  return Math.round((bytes / (1024 * 1024)) * 10) / 10
}
