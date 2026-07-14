# Especificação de Design: Reorganização do Step 1 (Dados da Clínica)

**Data**: 2026-07-14  
**Status**: Aprovado  
**Autor**: OpenCode Agent  

## 1. Visão Geral
Esta especificação detalha a reestruturação da primeira etapa (Step 1) do formulário de cadastro de clínicas do projeto `medic-resume`. O objetivo é melhorar a usabilidade para diferenciar profissionais autônomos (Pessoa Física) de clínicas empresariais (Pessoa Jurídica), trazendo preenchimento automatizado via APIs públicas (BrasilAPI) para CNPJ e CEP, além de aprimorar as validações e remover redundâncias.

## 2. Requisitos de Negócio e Funcionais
- **Nome do Titular**: Deve ser obrigatório, ter no mínimo 10 caracteres e explicitar na interface que se trata do nome completo.
- **CPF do Titular**: Obrigatório e deve ser preenchido integralmente (11 dígitos).
- **Celular do Titular (WhatsApp)**: Obrigatório e deve ser preenchido integralmente (11 dígitos com DDD).
- **Tipo de Cadastro**: Pergunta *"Será em CNPJ de Empresa?"* (`sim` ou `não`):
  - **Se sim (Empresa)**:
    - Campo **CNPJ da Empresa** é obrigatório (14 dígitos).
    - Faz requisição para a BrasilAPI (`https://brasilapi.com.br/api/cnpj/v1/{cnpj}`) ao preencher os 14 dígitos.
    - Se o CNPJ for encontrado, preenche os campos **Nome Fantasia**, **CEP** e **Endereço**.
    - Se não for encontrado, emite aviso amigável e permite preenchimento manual do Nome Fantasia, CEP e Endereço.
    - Os campos **Nome Fantasia**, **CEP** e **Endereço** expandem e ficam visíveis.
  - **Se não (Profissional Físico)**:
    - Campo **CEP** expande e fica visível (8 dígitos).
    - Faz requisição para a BrasilAPI (`https://brasilapi.com.br/api/cep/v2/{cep}`) ao preencher os 8 dígitos do CEP.
    - Se encontrado, preenche o campo **Endereço**. Se não encontrado, exibe erro e permite preenchimento manual.
    - O campo **Nome Fantasia / Nome da Clínica** no banco de dados é automaticamente definido com o **Nome do Titular**.
- **Campo Endereço**:
  - Deve ser exibido como desabilitado (apenas leitura) após o preenchimento automático.
  - Apresentará um ícone de "lápis" ao lado. Ao clicar no lápis, o campo é liberado para edição manual.
- **Quantidade de Médicos**:
  - Removido do Step 1 da interface.
  - O valor salvo no banco de dados será calculado a partir do número de usuários do tipo `examinador` adicionados na etapa seguinte (Step 2).

## 3. Modelo de Dados (Prisma Schema)
Atualização do modelo `Clinica` no arquivo `prisma/schema.prisma` adicionando as colunas opcionais para novos cadastros (sem quebra de compatibilidade durante desenvolvimento):
- `cnpjEmpresa` (`String?`)
- `cepClinica` (`String?`)
- `enderecoClinica` (`String?`)

## 4. Validações (Zod)
Regras de validação no arquivo `lib/validacoes.ts`:
- CPF (`documentoTitular`): `z.string().refine((val) => val.replace(/\D/g, '').length === 11, 'CPF deve ser preenchido integralmente')`
- Celular (`celularTitular`): `z.string().refine((val) => val.replace(/\D/g, '').length === 11, 'Celular deve ser preenchido integralmente')`
- CNPJ (`cnpjEmpresa`): Opcional se `possuiCnpj` for falso, obrigatório e preenchido integralmente se `possuiCnpj` for verdadeiro.
- CEP (`cepClinica`): Obrigatório (8 dígitos numéricos).
- Endereço (`enderecoClinica`): Obrigatório.

## 5. Interface Gráfica (UX/UI)
- Componente `StepClinica.tsx` reestruturado para acomodar os novos campos usando grid responsivo do Tailwind CSS.
- Adicionado estado local `possuiCnpj` para controlar a exibição condicional.
- Adicionado estado local `enderecoEditavel` para controlar a liberação do campo Endereço com o botão de lápis.
- Implementadas máscaras para CPF, Celular, CNPJ e CEP.
