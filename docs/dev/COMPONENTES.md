# Padrões de Componentes

Guia para criação de componentes React no projeto Medic Resume.

## Estrutura

```
components/
├── ui/          # Genéricos reutilizáveis (Button, Input, FileUpload, StatusBadge)
├── wizard/      # Etapas do formulário (Stepper, StepClinica, StepMedicos, StepExames, StepDispositivos)
└── admin/       # Painel admin (SubmissaoCard, AprovarRejeitarButtons, AdminForm, AuditLogCard)
```

## Regras

1. **Um componente por arquivo**, nome PascalCase = nome do arquivo
2. **Exportação nomeada** (nunca `export default`)
3. **Server Component por padrão** — adicione `'use client'` só quando necessário (eventos, estado, hooks)

## Exemplos Rápidos

### Server Component

```tsx
export function SubmissaoCard({ submissao }: SubmissaoCardProps) {
  // Sem 'use client' — busca dados, renderiza
  return <div className="p-4 bg-white rounded-lg shadow">{/* ... */}</div>
}
```

### Client Component

```tsx
'use client'

export function AprovarRejeitarButtons({ clinicaId }: Props) {
  const [carregando, setCarregando] = useState(false)
  // Eventos, useActionState, etc.
}
```

## Props

- Interface com sufixo `Props`: `interface ButtonProps { ... }`
- Props opcionais com valor default na desestruturação
- `children` tipado como `React.ReactNode`

```typescript
interface CardProps {
  titulo: string
  children?: React.ReactNode
}
```

## Composição

Prefira composição a componentes monolíticos:

```tsx
<Card titulo="Clínica">
  <StatusBadge status="PENDENTE" />
  <p>Dados</p>
</Card>
```

## Checklist

- [ ] Um componente por arquivo, PascalCase
- [ ] Exportação nomeada
- [ ] `'use client'` apenas quando necessário
- [ ] Props com interface `NomeProps`
- [ ] Tipagem explícita (sem `any`)
