## Contexto
O componente `HannyaLogo` renderiza a mesma imagem em todas as telas, mas recebe tamanhos diferentes via `className`:

- **Welcome** (`src/routes/welcome.tsx`): container `size-28` (112px), logo `size-full` + `object-cover`.
- **Auth** (`src/routes/auth.tsx`): container `size-12` (48px), logo `size-7` (28px).
- **Onboarding** (`src/routes/_authenticated/onboarding.tsx`): container `size-12` (48px), logo `size-7` (28px).
- **AppShell** (`src/components/AppShell.tsx`): logo `size-16` (64px), sem container.

A diferença é intencional de hierarquia visual, mas gera inconsistência. A falta de `object-cover` em alguns usos e tamanhos distintos pode deixar a marca com aparência desproporcional entre telas.

## Proposta
Padronizar o uso da logo com tamanhos semânticos e proporção consistente.

### Passos
1. **Refinar o componente `HannyaLogo`** para aplicar sempre `object-cover` (ou `object-contain`) e expor variantes de tamanho internas (`sm`, `md`, `lg`, `xl`), mantendo o `className` customizável quando necessário.
2. **Atualizar os pontos de uso** para adotar as variantes:
   - `welcome.tsx`: usar `xl` (≈112px) como destaque de marca.
   - `auth.tsx` e `onboarding.tsx`: usar `md` (≈48px) no container de título.
   - `AppShell.tsx`: usar `lg` (≈64px) no header do app.
3. **Revisar containers** para garantir que o fundo primário/redondo (`bg-primary`) e o alinhamento fiquem consistentes, sem duplicação de tamanho entre container e logo.
4. **Verificar preview** nas rotas `/welcome`, `/auth`, `/onboarding` e `/app` para confirmar proporção e alinhamento.

## Detalhes técnicos
- Arquivo do componente: `src/components/brand/HannyaLogo.tsx`.
- Arquivos de uso: `src/routes/welcome.tsx`, `src/routes/auth.tsx`, `src/routes/_authenticated/onboarding.tsx`, `src/components/AppShell.tsx`.
- Nenhuma alteração de backend ou lógica de negócio — apenas apresentação e consistência visual.

## Resultado esperado
A logo Hannya aparece com tamanhos previsíveis por contexto, mantendo a proporção correta e alinhada, sem distorção ou variação abrupta entre telas.