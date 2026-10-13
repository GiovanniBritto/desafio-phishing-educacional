# Estudo complementar: Social-Engineer Toolkit

## Papel no desafio

O enunciado original utiliza o SET para estudar engenharia social. Segundo a [TrustedSec](https://github.com/trustedsec/social-engineer-toolkit), o Social-Engineer Toolkit é um framework para avaliações autorizadas de engenharia social. A documentação do [Kali Linux](https://www.kali.org/tools/set/) descreve o pacote e seu console interativo.

Na técnica discutida pelo curso, a aparência de uma página pode ser reproduzida para induzir o envio de informações a outro destino. O risco central é o fornecimento de credenciais a uma origem diferente daquela pretendida pelo usuário.

**Situação deste repositório:** o SET não é dependência, não foi instalado nem executado durante a criação da demonstração. Não há evidência de um laboratório SET concluído.

## Preparação de um estudo separado

Se a avaliação exigir uso prático da ferramenta, delimite um laboratório próprio ou expressamente autorizado, com páginas fictícias, contas de teste e rede isolada. Defina objetivo, escopo e dados de demonstração antes da execução. Mantenha esse registro separado dos resultados do simulador.

Para consultar a disponibilidade da ferramenta em um Kali já preparado:

```bash
command -v setoolkit
dpkg-query -W set
```

Esses comandos apenas verificam o executável e a versão do pacote instalado. Se ele estiver ausente, consulte as instruções oficiais do Kali e as aulas para preparar seu ambiente.

## Registro complementar a preencher após a execução

| Campo | Registro do participante |
| --- | --- |
| Data da execução | A preencher |
| Versão do Kali e do SET | A preencher |
| Objetivo e ambiente autorizado | A preencher |
| Página fictícia e dados de teste | A preencher |
| Procedimento efetivamente realizado | A preencher |
| Resultado observado | A preencher |
| Evidências com dados apenas fictícios | A preencher |
| Dificuldades e limitações | A preencher |
| Encerramento e limpeza do laboratório | A preencher |

Atualize o README e o relatório somente depois de obter resultados reais do laboratório. Não reutilize imagens de terceiros como evidência de execução própria.
