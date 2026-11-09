# Segurança e minimização de dados

A API da Convenia devolve e recebe dados de RH: identidade, contato, salário, benefício, falta, férias e folha. No Brasil, parte relevante disso é dado pessoal sob a LGPD, e salário e documento podem ser dado sensível ou de tratamento restrito conforme o contexto da empresa controladora.

## O que este pacote faz

- O token e o segredo de webhook são campos de senha.
- A URL base precisa ser HTTPS, sem usuário, senha, query ou fragmento.
- Erros de API passam por redação de e-mail, CPF, PIS, chaves de documento, salário, conta, Pix e segredo escrito depois de `token`, `bearer`, `authorization`, `signature` ou `password`.
- A busca de colaborador pede nome ou UUID e monta o rótulo com nome e sobrenome. O rótulo não inclui CPF.
- Listas de departamento, cargo, centro de custo, time, benefício, campo e folha mostram nome e ID.
- O webhook só segue quando o header `Signature` confere com HMAC-SHA256 hexadecimal do corpo cru, comparação em tempo constante. Esse algoritmo é o padrão da biblioteca citada pela Convenia e não foi confirmado com um payload real. Sem corpo cru ou sem assinatura, a entrega é recusada.
- Payload idêntico não é descartado. A documentação não traz ID de entrega.
- Escrita não é repetida em 429, 5xx nem falha de rede. A documentação do 429 não garante que a alteração deixou de ser aplicada.

## O que este pacote não faz

- Não anonimiza o item de sucesso. Quem configura o workflow decide para onde esses dados vão.
- Não impede que um AI Agent chame uma escrita. A descrição da ferramenta pede confirmação humana. Isso é aviso, não trava.
- Não garante o limite de 50 requisições por minuto entre processos diferentes.
- Não foi auditado com token real nem com payload real de colaborador.

## Relato

Não abra issue com token, CPF, salário, holerite ou corpo de webhook. Descreva status HTTP, operação e o trecho já redigido da mensagem.
