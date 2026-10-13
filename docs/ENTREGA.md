# Publicação e entrega na DIO

## Antes de publicar

Este pacote está pronto para ser colocado em um repositório. Ele é uma adaptação educacional e não comprova uso do SET. Confira os critérios da sua turma antes de apresentar a atividade como concluída.

- [ ] Assistir a todas as aulas do desafio.
- [ ] Executar a demonstração local e revisar seu funcionamento.
- [ ] Executar `node --test` e conferir os resultados no seu ambiente.
- [ ] Ler o README e personalizar o texto com seu aprendizado.
- [ ] Verificar a aceitação da adaptação; se necessário, acrescentar o laboratório SET efetivamente realizado.
- [ ] Conferir os arquivos que serão publicados.

## Criar o repositório público

Nome sugerido: **desafio-phishing-educacional**.

Descrição sugerida:

> Laboratório educacional de conscientização sobre phishing, com demonstração local, dados fictícios, relatório técnico e testes automatizados.

Crie um repositório público em sua conta seguindo a [documentação oficial do GitHub](https://docs.github.com/pt/repositories/creating-and-managing-repositories/creating-a-new-repository). Como o pacote já contém README, licença e `.gitignore`, crie o repositório vazio para facilitar o primeiro envio.

Você pode enviar os arquivos pela interface do GitHub, preservando as pastas, ou usar Git. O README, `package.json` e `server.mjs` devem ficar na raiz do repositório, não dentro de uma segunda pasta com o mesmo nome. Envie o conteúdo do pacote extraído, e não somente o arquivo ZIP.

Com Git, execute na pasta extraída do projeto:

```bash
git init -b main
git add .
git commit -m "Adiciona laboratório educacional sobre phishing"
```

Depois, use o comando `git remote add origin` com a URL exata do repositório criado e execute:

```bash
git push -u origin main
```

A autenticação usa sua configuração do GitHub. Não coloque senhas ou tokens nos arquivos do projeto.

## Conferir a publicação

- [ ] O repositório abre publicamente.
- [ ] O README aparece na página principal e as imagens carregam.
- [ ] Os links relativos para `docs/` funcionam.
- [ ] O repositório contém a demonstração e os testes.
- [ ] A situação do SET continua descrita com precisão.

O código inclui um servidor Node.js local; apenas ativar GitHub Pages não executa o endpoint da demonstração. O repositório público é a entrega dos arquivos e da documentação.

## Texto breve para o botão “Entregar Projeto”

Use o link real do seu repositório e adapte este texto depois de revisar os arquivos:

> Desenvolvi uma adaptação educacional do desafio de phishing, com página de treinamento fictícia e demonstração executada localmente. O projeto documenta o fluxo entre página e servidor, decisões técnicas e medidas de prevenção, e inclui testes automatizados. Esta versão usa dados fixos e não executa o SET; essa limitação está registrada no README e no relatório.

Se você acrescentar um laboratório autorizado com o SET, atualize a descrição para refletir o que de fato realizou, com suas próprias evidências.

## O que permanece com o participante

A publicação na conta do GitHub, a confirmação das aulas e a submissão na DIO não foram realizadas na preparação deste pacote. Nenhum link de repositório foi criado por esta entrega local.
