## Objetivo

O preview está servindo código antigo apesar de existirem commits novos no remoto. Vamos forçar a sincronização do sandbox com o último commit e reiniciar o dev server para que as alterações apareçam.

## Passos

1. Verificar o estado atual do repositório no sandbox (`git status`, `git log -1`, `git remote -v`) para confirmar qual commit está checado.
2. Buscar e aplicar o último commit do remoto (`git fetch` + fast-forward para a branch ativa) usando o mecanismo interno do Lovable — git stateful commands são gerenciados pelo harness.
3. Rodar `bun install` caso `package.json` / `bun.lock` tenham mudado, para garantir dependências alinhadas com o novo commit.
4. Limpar o gate de HMR (`curl -X POST http://localhost:8080/__hmr_flush`) e, se necessário, reiniciar o dev server para invalidar módulos em cache.
5. Abrir o preview e confirmar visualmente que as alterações do último commit estão presentes (cor, layout, ou qualquer mudança que o usuário mencionar).

## Observação

Como não posso rodar comandos git de estado (add/commit/pull/etc.) diretamente, a sincronização real do worktree depende do mecanismo interno do Lovable que reconcilia o sandbox com o remoto. Se após fetch o worktree ainda estiver desatualizado, vou reportar exatamente qual commit está local vs remoto para você decidir o próximo passo (ex.: forçar reset ou abrir um novo sandbox).
