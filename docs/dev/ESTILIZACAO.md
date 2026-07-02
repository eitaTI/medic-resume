# Padrões de Estilização

Guia de estilos com Tailwind CSS v4 no projeto ZScan Formulário.

## Configuração

### Tailwind CSS v4

O projeto usa Tailwind CSS v4 com configuração via CSS (sem `tailwind.config.ts`).

```css
/* app/globals.css */
@import "tailwindcss";
```

### PostCSS

```javascript
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

## Classes Utilitárias

### Layout

```tsx
// Flexbox
<div className="flex items-center justify-between">
<div className="flex gap-4">
<div className="flex flex-col space-y-4">

// Grid
<div className="grid grid-cols-2 gap-4">
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

// Container
<div className="max-w-7xl mx-auto p-6">
```

### Espaçamento

```tsx
// Padding
<div className="p-4">           // 1rem em todos os lados
<div className="px-4 py-2">     // horizontal e vertical
<div className="p-6">           // 1.5rem

// Margin
<div className="mb-4">          // margin-bottom
<div className="ml-2">          // margin-left
<div className="mt-8 mx-auto">  // top e center
```

### Tipografia

```tsx
<h1 className="text-2xl font-bold">
<h2 className="text-xl font-bold mb-6">
<h3 className="font-bold mb-2">
<p className="text-gray-600 text-sm">
<span className="text-xs text-gray-400">
```

### Cores

```tsx
// Background
<div className="bg-white">
<div className="bg-gray-50">
<div className="bg-blue-600">
<div className="bg-green-100">
<div className="bg-red-100">

// Texto
<p className="text-gray-800">
<p className="text-blue-600">
<p className="text-green-800">
<p className="text-red-600">
```

### Bordas e Sombras

```tsx
<div className="border border-gray-300 rounded-lg">
<div className="rounded-full">
<div className="shadow">
<div className="hover:shadow-md transition-shadow">
```

## Padrões de Componentes

### Cards

```tsx
// Card básico
<div className="p-4 bg-white rounded-lg shadow">

// Card clicável
<Link href="/admin/submissao/1">
  <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
    <h3 className="font-bold text-lg">Título</h3>
    <p className="text-gray-600 text-sm">Descrição</p>
  </div>
</Link>

// Card com borda
<div className="p-4 border border-gray-200 rounded-lg">
```

### Formulários

```tsx
// Container do formulário
<form className="space-y-4">

// Campo de input
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">
    Nome
  </label>
  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg 
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
</div>

// Textarea
<textarea className="w-full p-2 border rounded-lg" rows={3} />

// Select
<select className="px-3 py-2 border rounded-lg text-sm">
```

### Botões

```tsx
// Primário
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg 
  font-medium hover:bg-blue-700 transition-colors">

// Secundário
<button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg 
  font-medium hover:bg-gray-300 transition-colors">

// Perigo
<button className="px-4 py-2 bg-red-600 text-white rounded-lg 
  font-medium hover:bg-red-700 transition-colors">

// Desabilitado
<button className="opacity-50 cursor-not-allowed" disabled>
```

### Badges

```tsx
// Badge de status
<span className="px-2 py-1 text-xs font-medium rounded-full 
  bg-yellow-100 text-yellow-800">
  Pendente
</span>

<span className="px-2 py-1 text-xs font-medium rounded-full 
  bg-green-100 text-green-800">
  Aprovada
</span>

<span className="px-2 py-1 text-xs font-medium rounded-full 
  bg-red-100 text-red-800">
  Rejeitada
</span>
```

### Listas

```tsx
// Lista de itens
<div className="space-y-2">
  {itens.map((item) => (
    <div key={item.id} className="p-3 bg-gray-50 rounded">
      {item.nome}
    </div>
  ))}
</div>

// Lista com hover
<div className="space-y-2">
  {itens.map((item) => (
    <div key={item.id} className="flex justify-between items-center 
      p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
      <span>{item.nome}</span>
      <span className="text-sm text-gray-500">{item.valor}</span>
    </div>
  ))}
</div>
```

### Filtros

```tsx
// Filtros em linha
<div className="flex gap-2 mb-4">
  {['Todas', 'Pendentes', 'Aprovadas', 'Rejeitadas'].map((filtro) => (
    <a
      key={filtro}
      href={`?status=${filtro}`}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        statusAtual === filtro
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {filtro}
    </a>
  ))}
</div>
```

### Modal/Dialog

```tsx
// Overlay
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

// Conteúdo
<div className="bg-white rounded-lg p-6 max-w-md w-full">
  <h3 className="text-xl font-bold mb-4">Título</h3>
  <p className="text-gray-600">Conteúdo</p>
</div>
```

### Tabela

```tsx
<table className="w-full">
  <thead>
    <tr className="border-b">
      <th className="text-left py-2">Nome</th>
      <th className="text-left py-2">Email</th>
    </tr>
  </thead>
  <tbody>
    {itens.map((item) => (
      <tr key={item.id} className="border-b hover:bg-gray-50">
        <td className="py-2">{item.nome}</td>
        <td className="py-2">{item.email}</td>
      </tr>
    ))}
  </tbody>
</table>
```

## Responsividade

### Breakpoints

```tsx
// Mobile primeiro
<div className="w-full md:w-1/2 lg:w-1/3">

// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Ocultar em mobile
<div className="hidden md:block">

// Mostrar apenas em mobile
<div className="block md:hidden">
```

## Estados

### Hover

```tsx
<button className="hover:bg-blue-700 transition-colors">
<div className="hover:shadow-md transition-shadow">
```

### Focus

```tsx
<input className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
```

### Disabled

```tsx
<button className="opacity-50 cursor-not-allowed" disabled>
```

### Loading

```tsx
<button disabled={pending}>
  {pending ? 'Carregando...' : 'Enviar'}
</button>
```

## Animações

```tsx
// Transição suave
<div className="transition-all duration-200">

// Animação de loading
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
```

## Ícones

```tsx
// Usando emojis (simples)
<button>➕ Adicionar</button>
<button>❌ Remover</button>

// Usando SVG inline
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
</svg>
```

## Padrões de Cor

| Elemento | Cor |
|----------|-----|
| Primário | `blue-600` |
| Sucesso | `green-600` / `green-100` |
| Erro | `red-600` / `red-100` |
| Aviso | `yellow-600` / `yellow-100` |
| Texto | `gray-800` |
| Texto secundário | `gray-600` |
| Texto muted | `gray-400` |
| Fundo | `gray-50` |
| Card | `white` |
| Borda | `gray-200` / `gray-300` |

## Checklist

- [ ] Usar Tailwind CSS v4 (sem config file)
- [ ] Mobile-first (breakpoints md:, lg:)
- [ ] Transições em hover/focus
- [ ] Estados disabled/loading
- [ ] Cores consistentes
- [ ] Espaçamento uniforme
