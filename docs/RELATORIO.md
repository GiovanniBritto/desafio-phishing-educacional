# Relatório técnico

## Pergunta de estudo

Como demonstrar a diferença entre a aparência de uma página e o destino de uma requisição, mantendo o exercício reproduzível e sem solicitar dados pessoais?

## Abordagem

Foi construída uma página de treinamento com identidade fictícia. Os exemplos de usuário e senha são texto fixo, sem campos de entrada. O botão envia somente o identificador `dados-ficticios` para um servidor local. O servidor valida esse identificador e responde com um exemplo predefinido.

Essa abordagem torna observáveis o evento da página, a requisição e a resposta. Seu limite é explícito: não simula a coleta efetiva de um formulário, não testa a suscetibilidade de pessoas e não reproduz o SET. A execução original solicitada no curso continua sem evidência neste projeto.

## Ambiente de validação

| Item | Ambiente observado |
| --- | --- |
| Data | 13/10/2026 |
| Sistema | Windows |
| Runtime | Node.js v24.19.0 |
| Endereço da demonstração | `http://127.0.0.1:8765` |
| Testes automatizados | `node --test` |
| Dependências externas do projeto | Nenhuma |
| Kali Linux e SET | Não executados |

## Implementação e decisões

`dist/index.html` organiza a demonstração e os conteúdos de prevenção. `dist/app.js` controla os estados inicial, execução, resultado e erro. A resposta é inserida com `textContent`, sem interpretar seu conteúdo como HTML.

`server.mjs` publica somente cinco rotas estáticas conhecidas e um endpoint de simulação. O endereço de escuta é fixo em `127.0.0.1`. O endpoint exige a origem local, JSON e um objeto com exatamente uma propriedade permitida. Não há entrada para uma URL de destino, coleta de credenciais ou configuração de exposição pública.

A resposta utiliza um par de valores fictícios definido no próprio código. O indicador `persistido: false` descreve essa implementação; isoladamente, um campo JSON não comprova a privacidade de qualquer outro sistema. Aqui, a ausência de escrita e de logs de requisição também pode ser revisada no código do servidor.

Os controles de Host e Origin reduzem acesso fora do cenário previsto, mas não identificam o operador de um cliente HTTP: clientes personalizados podem definir seus próprios cabeçalhos. A restrição de rede depende da escuta em loopback. Este servidor é didático e não deve ser usado como sistema de login.

## Resultado dos testes

Os dez casos passaram na execução registrada. A [saída original da suíte](VALIDACAO.txt) acompanha o projeto.

| Caso | Resultado |
| --- | --- |
| Escuta exclusiva em `127.0.0.1` | Aprovado |
| HTML, CSS, JavaScript e ícone com cabeçalhos restritivos | Aprovado |
| Cenário permitido retorna o exemplo esperado | Aprovado |
| Campos extras e valores arbitrários são rejeitados sem reflexão | Aprovado |
| Origin externo ou ausente é rejeitado | Aprovado |
| Host arbitrário é rejeitado | Aprovado |
| Arquivos do repositório e rotas indevidas não são servidos | Aprovado |
| Método, JSON e tipo de conteúdo inválidos são rejeitados | Aprovado |
| Corpo maior que 256 bytes é rejeitado | Aprovado |
| HEAD responde sem corpo | Aprovado |

O primeiro ensaio encontrou uma restrição de conexão de loopback do ambiente de execução. A mesma suíte foi executada novamente com acesso local permitido e passou. A implementação não foi alterada para contornar os controles do laboratório.

## Evidências visuais

As imagens são capturas da implementação deste repositório. Não representam captura de senhas reais nem saída do SET.

No navegador, foram verificados o carregamento da página, a execução do cenário, a exibição da resposta e o botão de reinício. Também foi revisada a apresentação em uma largura de 390 pixels, sem rolagem horizontal no cenário observado.

1. [Página completa de treinamento](../images/01-demonstracao.jpg).
2. [Resposta do cenário fictício](../images/02-resultado.jpg).
3. [Apresentação em tela pequena](../images/03-mobile.jpg).

## Limites e próximos passos

Os testes verificam os comportamentos listados e não equivalem a uma auditoria completa. Não foram realizados testes de desempenho, de leitores de tela ou de compatibilidade em vários navegadores.

Para a entrega acadêmica, o participante deve assistir às aulas e verificar se a adaptação atende à avaliação. Caso o uso do SET seja obrigatório, é necessário realizar e documentar um laboratório separado dentro de um escopo autorizado. O [estudo complementar](ESTUDO-SET.md) fornece contexto e campos para esse registro, sem apresentar sua execução como concluída.

## Conclusão técnica

A demonstração evidencia que aparência, destino da requisição e tratamento dos dados são aspectos diferentes. A documentação torna o fluxo revisável e conecta o exercício a medidas de prevenção. O resultado observado limita-se ao simulador local descrito neste relatório.
