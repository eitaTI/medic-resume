# Como Contribuir

Guia para o grupo de desenvolvimento contribuir no projeto medic-resume.

## Fluxo de Trabalho

### 1. Setup Inicial

```bash
# Fork e clone o repositório
git clone https://github.com/SEU-USER/medic-resume.git
cd medic-resume

# Instale dependências
npm install

# Configure o ambiente
cp .env.example .env

# Rode o projeto
npm run dev
```

### 2. Criando uma Branch

Sempre crie uma branch para cada tarefa:

```bash
# Format: tipo/tarefa-curta
git checkout -b feat/formulario-wizard
git checkout -b fix/validacao-email
git checkout -b docs/readme-update
```

**Tipos de branch:**
- `feat/` — Nova funcionalidade
- `fix/` — Correção de bug
- `docs/` — Documentação
- `refactor/` — Refatoração de código
- `test/` — Testes

### 3. Desenvolvendo

- Siga o padrão de pastas do projeto
- Use TypeScript para tipagem
- Comente código complexo
- Teste localmente antes de commitar

### 4. Commit

Use commits claros e descritivos:

```bash
# Formato: tipo(escopo): descrição
git commit -m "feat(formulario): adiciona validação de email"
git commit -m "fix(auth): corrige login com credenciais inválidas"
git commit -m "docs: atualiza README com instruções de instalação"
```

**Tipos de commit:**
- `feat` — Nova funcionalidade
- `fix` — Correção de bug
- `docs` — Documentação
- `style` — Formatação (não afeta lógica)
- `refactor` — Refatoração
- `test` — Adição de testes
- `chore` — Configurações, dependências

### 5. Push e PR

```bash
# Push para sua branch
git push origin feat/formulario-wizard

# Crie um Pull Request no GitHub
# Descreva o que foi feito e referencie issues (ex: "Closes #12")
```

## Regras Importantes

### ✅ Faça

- Uma branch por tarefa
- Commits pequenos e frequentes
- Teste antes de enviar
- Documente mudanças complexas
- Respeite a estrutura de pastas

### ❌ Não Faça

- Commite direto na `main`
- Envie código que não compila
- Ignore erros de TypeScript
- Deixe código comentado desnecessariamente
- Adicione dependências sem necessidade

## Estrutura de Pastas

```
medic-resume/
├── app/              # Rotas e páginas (Next.js App Router)
├── components/       # Componentes React reutilizáveis
├── actions/          # Server Actions (lógica do servidor)
├── lib/              # Utilitários e configurações
├── prisma/           # Schema do banco de dados
├── data/uploads/     # Arquivos enviados (não committar!)
├── docs/             # Documentação detalhada por fase
└── public/           # Arquivos estáticos (imagens públicas)
```

## Componentes UI

Ao criar componentes, siga o padrão:

```tsx
// components/ui/Botao.tsx
import { ButtonHTMLAttributes } from 'react'

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'perigo'
  tamanho?: 'pequeno' | 'medio' | 'grande'
}

export function Botao({ 
  variante = 'primario', 
  tamanho = 'medio',
  children,
  ...props 
}: BotaoProps) {
  const estilos = {
    primario: 'bg-blue-600 text-white hover:bg-blue-700',
    secundario: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    perigo: 'bg-red-600 text-white hover:bg-red-700'
  }
  
  const tamanhos = {
    pequeno: 'px-3 py-1 text-sm',
    medio: 'px-4 py-2',
    grande: 'px-6 py-3 text-lg'
  }
  
  return (
    <button 
      className={`${estilos[variante]} ${tamanhos[tamanho]} rounded-lg font-medium transition-colors`}
      {...props}
    >
      {children}
    </button>
  )
}
```

## Server Actions

Server Actions ficam em `actions/` e devem ser funções `"use server"`:

```tsx
// actions/exemplo.ts
'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schemaExemplo = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido')
})

export async function criarExemplo(formData: FormData) {
  const dados = {
    nome: formData.get('nome') as string,
    email: formData.get('email') as string
  }
  
  const validacao = schemaExemplo.safeParse(dados)
  if (!validacao.success) {
    return { erro: validacao.error.errors[0].message }
  }
  
  const registro = await prisma.exemplo.create({
    data: validacao.data
  })
  
  return { sucesso: true, registro }
}
```

## Dúvidas?

Abra uma issue com a tag `pergunta` ou consulte o responsável pelo projeto.