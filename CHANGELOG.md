# Changelog

## 0.1.0

Primeira versão do node comunitário Convenia.

- 64 operações sobre os caminhos HTTP publicados na API v3 em 29 de outubro de 2026.
- Credencial com teste em `GET /tokens/permissions`.
- Trigger de webhook com conferência de assinatura, sem cadastro automático.
- Node de ação utilizável como ferramenta de AI Agent.
- Sem chamada a sandbox da Convenia e sem publicação no npm.
- `n8n.strict` ligado, rótulos do editor em inglês e lint oficial exercitado fora da raiz do sistema de arquivos.
- Return All falha ao atingir Max Pages, ao repetir URL ou ao receber próxima página fora da origem.
- Escrita não é repetida em 429. A verificação de webhook segue o padrão Spatie citado pela documentação e permanece não confirmada em sandbox. Evento sem `type`, inclusive aniversariantes, é recusado. Payloads iguais não são descartados.
