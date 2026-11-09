# n8n-nodes-convenia

Node comunitário do n8n para a API pública v3 da Convenia. Cobre colaboradores, admissão, desligamento, férias, faltas, benefícios, estrutura organizacional, folha, catálogos e os webhooks documentados. O node Convenia também pode ser ligado como ferramenta de AI Agent por `usableAsTool`.

A documentação da API está em [https://docs-api.convenia.com.br/](https://docs-api.convenia.com.br/). A matriz que liga cada caminho ao node está em [docs/COBERTURA.md](docs/COBERTURA.md). Os campos do formulário estão em [docs/CAMPOS.md](docs/CAMPOS.md).

Este pacote não foi publicado no npm. O nome `n8n-nodes-convenia` estava livre no registro em 8 de novembro de 2026.

## Instalação

No n8n self-hosted, em **Settings > Community nodes**, instale `n8n-nodes-convenia` depois que o pacote existir no npm. Até lá, a instalação local é:

```bash
npm install
npm run build
```

Aponte `N8N_CUSTOM_EXTENSIONS` para o diretório deste repositório, ou copie o pacote empacotado para a pasta de nodes comunitários da instância. Reinicie o n8n.

### n8n Cloud

Nodes comunitários não verificados não aparecem no n8n Cloud. Este pacote não passou por verificação da n8n. A instalação no Cloud depende dessa verificação e não foi testada aqui.

## Versões

| Peça | Versão usada para desenvolver e testar |
| --- | --- |
| n8n | 2.47.2 (`engines.node` `>=24`) |
| n8n-workflow | 2.47.0, peer `*` |
| Node.js da ferramenta e do CI | Node.js 24 |
| @n8n/node-cli | 0.55.5 |
| API Convenia | v3, HTML com `Last-Modified: Thu, 29 Oct 2026` |

O `package.json` declara `engines.node` `>=24.0.0`, o mesmo piso do n8n 2.47.2. O peer continua `n8n-workflow: *`, exigido pelo pacote comunitário. O typecheck usou `n8n-workflow` 2.47.0, que é a dependência exata do n8n 2.47.2.

O node é programático, não declarativo. Paginação com retorno de todas as páginas, retentativa seletiva, binário, webhook e a diferença entre campo omitido e valor nulo não cabem no estilo declarativo simples que a documentação de nodes comunitários recomenda para REST direto.

## Credencial e permissões

Crie uma credencial **Convenia API**:

1. Na Convenia, gere um token de integração com permissão para as áreas que o workflow vai ler ou alterar. O plano da conta precisa liberar a API pública.
2. Cole o token no campo **Token**. Ele é senha e sai no header `token`, não em `Authorization`.
3. Deixe a URL base em `https://public-api.convenia.com.br/api/v3`, salvo um ambiente HTTPS próprio.
4. O botão de teste chama `GET /tokens/permissions`, que é somente leitura.

A credencial **Convenia Webhook API** guarda só o segredo de assinatura. O teste confere se o segredo foi preenchido e não chama a Convenia.

O HTTP Request node, quando usa esta credencial, aponta para a URL oficial fixa. Uma URL alternativa vale para o node Convenia.

## Como usar o formulário

Os rótulos do formulário estão em inglês. Essa é a cópia exigida pelas regras oficiais de node comunitário (`n8n.strict`). Este README continua em português e diz o nome do campo como ele aparece no editor.

Escolha **Resource** e **Operation**. Os campos mudam com essa escolha. IDs que a API lista aparecem como localizador: busque pelo nome ou cole o ID / uma expressão. Listas de colaborador mostram nome e sobrenome, nunca documento.

Coleções e coleções fixas montam objetos e listas, inclusive admissão, dependentes e campos customizados. Não há área de JSON obrigatória nas operações suportadas. O node serializa esses campos em JSON internamente. Expressões funcionam nos campos de valor. Resource e Operation não aceitam expressão, para o formulário continuar coerente.

Campo de texto vazio não é enviado. Um booleano que você adicionou e marcou como não sai como `false`. Atualizar sem nenhum valor preenchido falha antes da requisição. Na criação de formação, as quatro chaves saem mesmo como `null`. No salário ativo, `date_to` sai `null`.

Listas paginadas têm **Return All**, **Paginate** e **Page**. Paginate vira o query `paginate`, de 1 a 1000. Return All pede 1000 por página e segue `next_page_url` da mesma origem. **Max Pages** vale só com Return All: o padrão é 100. Se a API ainda indicar outra página ao atingir esse número, ou se a próxima URL repetir ou sair da origem, o node falha e não devolve uma lista parcial. Colaboradores de um benefício só seguem `next_page_url`; a documentação não descreve `paginate` nesse caminho.

Cada registro de uma lista vira um item do n8n. **Incluir envelope** devolve o JSON inteiro da página. Resposta 204 vira `{ "success": true, "statusCode": 204 }`.

## Recursos e operações

São 64 operações. O nome técnico `recurso.operacao` está na [matriz](docs/COBERTURA.md).

| Recurso | Operações |
| --- | --- |
| Colaborador | listar ativos, listar desligados, obter, histórico salarial, dependentes, alterações, obter alteração, iniciar admissão, iniciar desligamento, campos customizados, atualizar, benefícios v2, enviar anexo |
| Férias | solicitações, solicitação, arquivo, períodos, período, coletivas, coletiva |
| Falta e afastamento | motivos, listar, obter, criar, atualizar, apagar |
| Dependente, contato de emergência, conta bancária | atualizar |
| Formação e estabilidade | criar, atualizar, apagar |
| Vínculo e salário | criar, atualizar |
| Benefício | listar, obter, colaboradores, vincular colaboradores, vincular dependentes |
| Departamento, centro de custo, cargo | listar, criar, atualizar, apagar |
| Time | listar |
| Folha | listar, obter, arquivo, participantes, eventos, lançamentos |
| Campo customizado | listar |
| Catálogo | 26 listas de sistema |
| Token | permissões |

Férias não têm criação nem aprovação na API. Colaborador não tem exclusão. Time não tem escrita. Motivo salarial não tem lista.

### Admissão

Preencha nome, sobrenome e vínculo. Cargo e departamento são nomes, não IDs. Se informar time, informe também o departamento. Se o colaborador preenche o formulário, informe o e-mail pessoal. Sexo da admissão aceita M ou F. Cidade natal e cidade do endereço pedem UF ou ID do estado. CEP com hífen é normalizado para 8 dígitos. O corpo sai como JSON aninhado (`documents`, `address`, `education`, `bankAccount`). A tabela oficial também mostra colchetes; a escolha do JSON está marcada na matriz e precisa de sandbox.

### Desligamento

Informe colaborador, data final, tipo de desligamento, data de remoção de acesso e tipo de aviso. O corpo usa `remove_access_date`. A amostra de listagem desligada escreve `remove_acess_date`; esse nome não é enviado.

### Férias

Consulta solicitações, períodos, arquivos e férias coletivas. O arquivo volta como binário no campo escolhido. Não existe operação para criar ou aprovar férias.

### AI Agent

No node Convenia, ligue a saída **Tool** ao AI Agent. O mecanismo é `usableAsTool`, com uma descrição que pede preferência por leitura, confirmação humana antes de escrita de RH e uso das listas em vez de ID inventado. Não há um segundo node de ferramenta nem um modelo embutido.

Expressões, inclusive `$fromAI`, cabem nos campos de valor. Downloads e uploads são um encaixe ruim para agente: o binário não vira um argumento confortável.

Exemplo de pedido somente leitura: listar solicitações de férias de um colaborador já identificado. Escritas de admissão, desligamento, salário, documento, benefício e exclusão mudam dado pessoal e trabalhista. Não deixe um agente executá-las sem um passo humano no workflow.

O workflow `workflows/agente-leitura.json` mostra a ligação `ai_tool`. Conecte o seu próprio modelo de chat. O exemplo não traz chave de modelo.

## Webhooks

O node **Convenia Trigger** recebe `POST` no caminho `convenia`. Eventos documentados:

`admission.started`, `admission.finished`, `dismissal.finished`, `dismissal.awaiting.accounting`, `vacation.created`, `vacation.approved`, `vacation.solicitation.updated`, `employee.edited`, `salary.historic.changed`, `absence.created`, `absence.updated` e `absence.deleted`.

A lista vazia aceita todo payload que tenha `type` em texto. Um evento fora da lista responde 200 e não inicia o workflow, para a Convenia não reenviar sem parar. Dois payloads iguais são os dois aceitos: a documentação não publica um ID de entrega, e descartar o corpo repetido apagaria eventos distintos.

A Convenia não documenta endpoint para cadastrar a URL. A ativação do workflow não chama a API: `checkExists`, `create` e `delete` respondem sem HTTP. Copie a URL de produção e cadastre-a na plataforma com o mesmo segredo. O tutorial de produto está em [Como configurar um webhook na plataforma](https://ajuda.convenia.com.br/knowledge/como-configurar-um-webhook-na-plataforma).

A documentação diz que a implementação usa `spatie/laravel-webhook-client` e o header `Signature`, descrito como “segredo + payload criptografados”. Ela não publica o algoritmo, o encoding nem um vetor de teste. O node aplica o validador padrão dessa biblioteca: HMAC-SHA256 hexadecimal do corpo cru, comparado em tempo constante com o header. Isso **não está verificado em sandbox** e não deve ser tratado como contrato confirmado de produção. Payload sem assinatura recebe 401. Sem o corpo cru, a entrega é recusada. Content-type precisa conter `application/json`.

O exemplo oficial de aniversariantes não é JSON válido e não tem `type`. Ele é recusado. Um JSON válido com `employee_ids` e sem `type` também é recusado. O node não inventa o evento `birthday`.

Não há polling de eventos. Para acompanhar mudanças sem webhook, use as operações de listagem e histórico no seu próprio agendamento.

## Paginação e limite

A documentação limita a API a 50 requisições por minuto e manda ler o header `Retry-After` no 429. Esse texto não diz que a requisição rejeitada deixou de ser aplicada.

O cliente segura 48 requisições por janela de 60 segundos **dentro de um único processo Node**, na chave do ID da credencial do n8n. Não é um limite distribuído. Outro worker, outra instância, outro workflow em outro processo ou qualquer outro sistema com o mesmo token não entra nessa conta e pode, junto com este processo, passar de 50. Duas execuções no mesmo processo compartilham a janela.

Leitura repete 429, 502, 504 e falha de rede, no máximo 4 tentativas, com espera exponencial até 8 segundos ou `Retry-After` até 60 segundos. POST, PUT e DELETE não são repetidos, inclusive em 429: a documentação não garante que a escrita deixou de alterar dados.

O tempo limite de cada chamada neste cliente é 60 segundos. Esse número não está na documentação da Convenia.

## Solução de problemas

| Sintoma | O que fazer |
| --- | --- |
| Teste da credencial falha com 401 | Gere outro token e atualize a credencial. A mensagem não mostra o token. |
| 403 | A documentação associa este código a empresa bloqueada. |
| 404 | Confira o UUID. A busca é uma ajuda, não uma garantia de que o ID ainda existe. |
| 429 | Reduza Return All ou Max Pages, aumente o intervalo entre execuções e evite vários processos no mesmo token. O limite deste pacote não é distribuído. |
| Return All para com erro de páginas | A API ainda tinha página, repetiu URL ou mandou `next_page_url` de outra origem. O node não devolve lista parcial. Aumente Max Pages só se a lista for realmente maior. |
| Atualização não altera nada | O campo precisa ser adicionado à coleção e preenchido. Vazio é omitido. |
| Webhook 401 | O segredo precisa ser o mesmo e o corpo precisa ser o cru. O algoritmo HMAC-SHA256 é o padrão Spatie citado na documentação e ainda não foi confirmado em sandbox. |
| Webhook não dispara o workflow | O payload precisa ser JSON com `type` em texto. Evento fora do filtro responde 200 e não inicia o workflow. Aniversariante sem `type`, inclusive o exemplo oficial, é recusado. |
| Anexo recusado antes da API | A extensão precisa estar na lista documentada e o tipo precisa ser cpf, ctps, rg, driver-license, reservist ou electoral-card. |

## Segurança e LGPD

Colaborador, dependente, salário, documento e folha são dados pessoais e, em vários casos, trabalhistas. Use o menor token possível, evite logar a saída do node e não cole esses payloads em issues. Detalhes em [SECURITY.md](SECURITY.md).

Mensagens de erro removem e-mail, CPF, PIS, chaves sensíveis do JSON e um segredo que apareça depois das palavras token, bearer, authorization, signature ou password. Isso não torna a saída do node anônima: o item de sucesso ainda traz o que a API devolveu.

## Exemplos importáveis

Os arquivos em `workflows/` não contêm token. Importe e selecione a sua credencial.

- `workflows/admissao.json`
- `workflows/desligamento.json`
- `workflows/ferias-consulta.json`
- `workflows/agente-leitura.json`
- `workflows/webhook-admissao.json`

## Desenvolvimento

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm pack --dry-run
```

`npm test` compila e roda `node --test test/*.test.cjs`. Os testes usam fixtures rotuladas. Não houve sandbox da Convenia. A matriz separa o que o teste de fixture cobre do que só um sandbox pode confirmar.

O editor n8n 2.47.2 carregou o artefato `npm pack` em `~/.n8n/nodes` e importou os cinco workflows de exemplo. Um servidor HTTPS local, rotulado como mock, respondeu o teste da credencial, a lista de vínculos, a busca de colaborador e a leitura de um colaborador. Essa execução não é a API da Convenia.

`n8n.strict` está ligado e `eslint.config.mjs` é o arquivo padrão do `@n8n/node-cli` 0.55.5. `npm run lint` executa `n8n-node lint`. O `findPackageJson` do plugin comunitário não inspeciona um `package.json` cujo diretório pai é a raiz do sistema de arquivos, então, nesse layout, as regras de credencial não enxergariam o pacote. O script copia o projeto para um diretório aninhado comum e roda o mesmo comando oficial lá. Fora desse caso, o lint roda no próprio diretório. Não há regra desligada para esconder texto em português: os rótulos do node estão em inglês.

Não rode `npm run release` nem crie tag: o workflow de publicação enviaria o pacote ao npm.

## Contribuição e versão

Mudanças de comportamento entram em [CHANGELOG.md](CHANGELOG.md). A versão segue SemVer. Campo ou caminho novo só entra com a âncora oficial correspondente na matriz. Não invente endpoint para completar um fluxo de RH que a API não publica.

Licença MIT. Autor do pacote, o mesmo informado no pacote público `n8n-nodes-clinicorp`: Pedro Henrique Santos Guimarães.
