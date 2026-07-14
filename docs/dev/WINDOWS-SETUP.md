# Configuração do Ambiente Windows

Guia de configuração do ambiente de desenvolvimento no Windows para evitar erros comuns ao buildar e rodar o projeto.

## Modo Desenvolvedor (obrigatório)

O Next.js `standalone` cria symlinks durante o `pnpm build`. No Windows, criar symlinks requer o **Modo Desenvolvedor** ativado ou privilégios de Administrator.

Sem isso, o build falha com:

```
Error: EPERM: operation not permitted, symlink ...
```

### Ativar via interface

1. **Configurações** → **Sistema** → **Para desenvolvedores**
2. Alternar **Modo Desenvolvedor** para **Ativado**

### Ativar via PowerShell (Admin)

```powershell
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" /v AllowDevelopmentWithoutDevLicense /t REG_DWORD /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" /v AllowAllTrustedApps /t REG_DWORD /d 1 /f
```

### Verificar se está ativo

```powershell
Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock' -Name AllowDevelopmentWithoutDevLicense
```
> Retorno esperado: `AllowDevelopmentWithoutDevLicense : 1`


## Troubleshooting

### `EPERM: operation not permitted, symlink`

Causa: Modo Desenvolvedor não ativado.
Solução: Ativar conforme instruções acima.

### `EPERM: operation not permitted, rename` (better-sqlite3)

Causa: Processo Node.js anterior travando o arquivo.
Solução:

```powershell
Get-Process -Name node | Stop-Process -Force
pnpm install
```

### Build funciona mas `pnpm dev` falha

Verificar se o Prisma Client foi gerado:

```bash
pnpm prisma generate
pnpm dev
```
