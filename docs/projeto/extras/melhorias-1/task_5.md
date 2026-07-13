# Task 5: FileUpload com Erro Inline em vez de alert()

✅ **Concluído**

Substituir o `alert('Arquivo muito grande. Máximo 10MB.')` por uma mensagem de erro estilizada inline.

## O que fazer

### 1. Alterar `components/ui/FileUpload.tsx`

- Adicionar estado `erro` local (ou receber como prop)
- Substituir `alert('Arquivo muito grande. Máximo 10MB.')` por `setErro('Arquivo muito grande. Máximo 10MB.')`
- Exibir mensagem de erro em `<p className="text-red-500 text-xs mt-1">` abaixo do dropzone
- Limpar erro ao selecionar novo arquivo válido
- Adicionar prop opcional `maxSizeMB?: number` em vez de 10MB hardcoded

### 2. Melhorias adicionais

- Validar tipo de arquivo (`accept`) no onChange também
- Mostrar erro específico: "Tipo de arquivo não permitido" vs "Arquivo muito grande"
- Borda do dropzone ficar vermelha quando em erro

### 3. Acessibilidade

- Usar `role="alert"` na mensagem de erro
- Anunciar erro para leitores de tela

## Critérios de aceite

- [ ] `alert()` removido do FileUpload
- [ ] Erro de tamanho máximo exibido inline
- [ ] Erro de tipo de arquivo exibido inline
- [ ] Erro desaparece ao selecionar arquivo válido
- [ ] Prop `maxSizeMB` configurável (default 10)
- [ ] Build passa sem erros

## Commit

```
feat(ui): substituir alert() por erro inline no FileUpload
```
