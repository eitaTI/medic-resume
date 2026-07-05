# Padrões de Estilização

Guia de estilos com Tailwind CSS v4 no projeto Medic Resume.

## Configuração

Tailwind v4 é CSS-first (sem `tailwind.config.ts`):

```css
/* app/globals.css */
@import "tailwindcss";
```

## Padrões de Componentes

### Card
```tsx
<div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
```

### Input
```tsx
<input className="w-full px-3 py-2 border border-gray-300 rounded-lg 
  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
```

### Botões
```tsx
// Primário
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
// Secundário
<button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors">
// Perigo
<button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
```

### Badge de Status
```tsx
<span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
```

### Container de Formulário
```tsx
<form className="space-y-4">
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">Nome</label>
```

## Paleta de Cores

| Elemento | Cor |
|----------|-----|
| Primário | `blue-600` |
| Sucesso | `green-600` / `green-100` |
| Erro | `red-600` / `red-100` |
| Aviso | `yellow-600` / `yellow-100` |
| Texto | `gray-800` |
| Fundo | `gray-50` |
| Borda | `gray-200` / `gray-300` |

## Responsividade

Mobile-first: `w-full md:w-1/2 lg:w-1/3`

## Estados

- Hover: `hover:bg-blue-700 transition-colors`
- Focus: `focus:ring-2 focus:ring-blue-500`
- Disabled: `opacity-50 cursor-not-allowed`
- Loading: `disabled={pending}` + texto condicional

## Checklist

- [ ] Tailwind v4 (sem config file)
- [ ] Mobile-first
- [ ] Transições em hover/focus
- [ ] Estados disabled/loading
- [ ] Cores consistentes com a paleta
