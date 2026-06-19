# Otimização de cores: #ED90A1 + #8E1912

## Objetivo
Reorganizar o tema visual do Hannya para que **#8E1912** (vermelho profundo) continue como cor principal das peônias, marca e alertas, enquanto **#ED90A1** (rosa) entre como cor secundária de botões e elementos de interface. Fundo deve ficar neutro claro e fontes pretas.

## Mudanças no design system (`src/styles.css`)

1. Trocar `--background` para um tom neutro claro (ex.: `#FAFAFA` / `oklch(0.97 0 0)`).
2. Ajustar `--card`, `--popover` e `--input` para tons de branco/off-white compatíveis.
3. Manter `--primary` em `#8E1912` (vermelho) para preservar a cor das peônias e da marca.
4. Adicionar novos tokens semânticos para o rosa:
   - `--accent-rose: #ED90A1`
   - `--accent-rose-foreground: #1E1E1E` (texto preto sobre o rosa)
   - `--rose-muted: oklch(0.88 0.05 12)` (fundo rosado bem sutil para estados inativos)
5. Mapear esses tokens no `@theme inline` para gerar utilidades Tailwind: `bg-rose`, `text-rose`, `border-rose`, `hover:bg-rose/90`, etc.
6. Manter `--foreground` próximo do preto (`#1E1E1E`) e garantir contraste com ambas as cores de botão.

## Componente Button (`src/components/ui/button.tsx`)

Adicionar variantes ao `cva` para separar a hierarquia de ação:

- `default` (primária): `bg-primary text-primary-foreground` — vermelho `#8E1912`, texto claro. Usar para ações principais: "Criar minha conta", "Vincular dispositivo", "Ligar".
- `secondary` (rosa): `bg-rose text-rose-foreground` — rosa `#ED90A1`, texto escuro. Usar para ações secundárias: "Já tenho conta", "Adicionar contato", "Encerrar".
- `outline`: bordas e texto em `primary` ou `rose`, conforme contexto.
- `ghost`: hover em tom `primary/10` ou `rose/10`.
- Manter `destructive` como vermelho para alertas críticos e SOS.

## Aplicação por tela

### `welcome.tsx`
- Botão principal "Criar minha conta": variante `default` (vermelho).
- Botão secundário "Já tenho conta": variante `secondary` (rosa) ou `outline` com borda rosa.
- Ícones das features: manter em vermelho para coerência com as peônias.

### `onboarding.tsx`
- Botão "Vincular dispositivo": variante `default` (vermelho).
- Ícones de dispositivos: manter em vermelho.
- Tela de sucesso: círculo e ícone em vermelho.

### `app.tsx` (`src/routes/_authenticated/_paired/app.tsx`)
- Cartões de status (Rastreador / Botão SOS): fundo branco, ícones em vermelho, bordas neutras.
- Alerta SOS ativo: manter vermelho com fundo `primary/10` e texto/branco.
- Botão discreto "Emergência discreta": manter outline vermelho.
- Botões de ação secundários (ex.: "Encerrar", "Adicionar"): rosa.

### `AppShell.tsx`
- Navegação ativa: vermelho.
- Fundo da barra: card neutro claro.
- Peônias: continuar com `text-primary/25` e `text-primary/20` (vermelho), garantindo que a cor das flores não mude.

### Outras telas (`location`, `contacts`, `incidents`, `settings`)
- Aplicar a mesma regra: ações principais em vermelho, secundárias em rosa, fundos e superfícies em neutro claro.

## Validação
- Rodar `bun run build` para garantir que nenhum token Tailwind está quebrado.
- Verificar no preview as telas `/welcome`, `/onboarding` e `/app` para confirmar contraste legível e hierarquia de botões.

## Resumo das regras de uso das cores
| Elemento | Cor |
|---|---|
| Fundo | Neutro claro (#FAFAFA) |
| Texto | Preto/grafite (#1E1E1E) |
| Ações principais, alertas, SOS, peônias | Vermelho #8E1912 |
| Ações secundárias, botões outline, hover suave | Rosa #ED90A1 |
| Superfícies (cards, input) | Branco/off-white |
