# Cobertura da API Convenia v3

Fonte auditada em 8 de novembro de 2026: [documentação oficial](https://docs-api.convenia.com.br/). O HTML público tinha `Last-Modified: Thu, 29 Oct 2026`. Esta matriz liga cada caminho HTTP documentado ao recurso e à operação do node. Os testes em `test/routes.test.cjs` comparam a serialização com um oráculo escrito à mão. Nenhum teste chama a API da Convenia.

Base: `https://public-api.convenia.com.br/api/v3`. Autenticação: header `token`.

## Operações

| Método | Caminho | Operação | Âncora |
| --- | --- | --- | --- |
| GET | `/ethnicities` | `catalog.get` | [obter-dados-de-etnias](https://docs-api.convenia.com.br/#obter-dados-de-etnias) |
| GET | `/nationalities` | `catalog.get` | [obter-dados-de-nacionalidades](https://docs-api.convenia.com.br/#obter-dados-de-nacionalidades) |
| GET | `/relationships` | `catalog.get` | [obter-dados-de-vinculos-empregaticios](https://docs-api.convenia.com.br/#obter-dados-de-vinculos-empregaticios) |
| GET | `/marital-status` | `catalog.get` | [obter-dados-de-estado-civil](https://docs-api.convenia.com.br/#obter-dados-de-estado-civil) |
| GET | `/educations` | `catalog.get` | [obter-dados-de-tipo-de-escolaridade](https://docs-api.convenia.com.br/#obter-dados-de-tipo-de-escolaridade) |
| GET | `/bank-accounts` | `catalog.get` | [obter-dados-de-tipo-da-conta-bancaria](https://docs-api.convenia.com.br/#obter-dados-de-tipo-da-conta-bancaria) |
| GET | `/banks` | `catalog.get` | [obter-listagem-de-bancos](https://docs-api.convenia.com.br/#obter-listagem-de-bancos) |
| GET | `/states` | `catalog.get` | [obter-dados-de-estados](https://docs-api.convenia.com.br/#obter-dados-de-estados) |
| GET | `/cities` | `catalog.get` | [obter-dados-de-cidades](https://docs-api.convenia.com.br/#obter-dados-de-cidades) |
| GET | `/dismissal-types` | `catalog.get` | [obter-listagem-de-tipos-de-desligamento](https://docs-api.convenia.com.br/#obter-listagem-de-tipos-de-desligamento) |
| GET | `/termination-types` | `catalog.get` | [obter-listagem-de-tipos-de-aviso-previo](https://docs-api.convenia.com.br/#obter-listagem-de-tipos-de-aviso-previo) |
| GET | `/gender-identities` | `catalog.get` | [obter-listagem-de-identidade-de-genero](https://docs-api.convenia.com.br/#obter-listagem-de-identidade-de-genero) |
| GET | `/relation-emergency-contacts` | `catalog.get` | [obter-listagem-dos-relacionamentos-de-contatos-de-emergencia](https://docs-api.convenia.com.br/#obter-listagem-dos-relacionamentos-de-contatos-de-emergencia) |
| GET | `/admission-types` | `catalog.get` | [obter-listagem-dos-tipos-de-admissao](https://docs-api.convenia.com.br/#obter-listagem-dos-tipos-de-admissao) |
| GET | `/disabilities` | `catalog.get` | [obter-listagem-dos-tipos-de-deficiencia](https://docs-api.convenia.com.br/#obter-listagem-dos-tipos-de-deficiencia) |
| GET | `/payment-methods` | `catalog.get` | [obter-listagem-dos-tipos-de-pagamento](https://docs-api.convenia.com.br/#obter-listagem-dos-tipos-de-pagamento) |
| GET | `/salary-types` | `catalog.get` | [obter-listagem-dos-tipos-de-salario](https://docs-api.convenia.com.br/#obter-listagem-dos-tipos-de-salario) |
| GET | `/stability-types` | `catalog.get` | [obter-tipos-de-estabilidade](https://docs-api.convenia.com.br/#obter-tipos-de-estabilidade) |
| GET | `/dependent-relations` | `catalog.get` | [obter-listagem-dos-relacionamentos-de-dependentes](https://docs-api.convenia.com.br/#obter-listagem-dos-relacionamentos-de-dependentes) |
| GET | `/genders` | `catalog.get` | [obter-listagem-de-genero-no-documento](https://docs-api.convenia.com.br/#obter-listagem-de-genero-no-documento) |
| GET | `/visa` | `catalog.get` | [obter-listagem-dos-tipos-de-visto-estrangeiro](https://docs-api.convenia.com.br/#obter-listagem-dos-tipos-de-visto-estrangeiro) |
| GET | `/entry-conditions` | `catalog.get` | [obter-listagem-das-condicoes-de-ingresso-estrangeiro](https://docs-api.convenia.com.br/#obter-listagem-das-condicoes-de-ingresso-estrangeiro) |
| GET | `/residence-time` | `catalog.get` | [obter-listagem-das-opcoes-de-tempo-de-residencia-no-brasil-estrangeiro](https://docs-api.convenia.com.br/#obter-listagem-das-opcoes-de-tempo-de-residencia-no-brasil-estrangeiro) |
| GET | `/address-description` | `catalog.get` | [obter-listagem-das-opcoes-de-descricao-do-logradouro-estrangeiro](https://docs-api.convenia.com.br/#obter-listagem-das-opcoes-de-descricao-do-logradouro-estrangeiro) |
| GET | `/countries` | `catalog.get` | [obter-listagem-das-opcoes-de-paises-estrangeiro](https://docs-api.convenia.com.br/#obter-listagem-das-opcoes-de-paises-estrangeiro) |
| GET | `/worker-categories` | `catalog.get` | [obter-listagem-de-categoria-de-trabalhadores](https://docs-api.convenia.com.br/#obter-listagem-de-categoria-de-trabalhadores) |
| GET | `/tokens/permissions` | `token.getPermissions` | [detalhe-de-um-token](https://docs-api.convenia.com.br/#detalhe-de-um-token) |
| GET | `/employees` | `employee.getAll` | [obter-todos-os-colaboradores](https://docs-api.convenia.com.br/#obter-todos-os-colaboradores) |
| GET | `/employees/dismissed` | `employee.getDismissed` | [obter-todos-os-colaboradores-desligados](https://docs-api.convenia.com.br/#obter-todos-os-colaboradores-desligados) |
| GET | `/employees/{id}` | `employee.get` | [obter-um-colaborador-especifico](https://docs-api.convenia.com.br/#obter-um-colaborador-especifico) |
| GET | `/employees/{id}/salaries-historic` | `employee.getSalaryHistoric` | [obter-o-historico-salarial-de-um-colaborador](https://docs-api.convenia.com.br/#obter-o-historico-salarial-de-um-colaborador) |
| GET | `/employees/{id}/dependents` | `employee.getDependents` | [obter-dependentes-relacionados-a-um-colaborador](https://docs-api.convenia.com.br/#obter-dependentes-relacionados-a-um-colaborador) |
| GET | `/employees/{id}/vacations/solicitations` | `vacation.getSolicitations` | [obter-solicitacoes-de-ferias-relacionadas-a-um-colaborador](https://docs-api.convenia.com.br/#obter-solicitacoes-de-ferias-relacionadas-a-um-colaborador) |
| GET | `/employees/{id}/vacations/solicitations/{solicitationId}` | `vacation.getSolicitation` | [obter-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador](https://docs-api.convenia.com.br/#obter-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador) |
| GET | `/employees/{id}/vacations/solicitations/{solicitationId}/files/{fileId}` | `vacation.downloadSolicitationFile` | [obter-arquivo-de-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador](https://docs-api.convenia.com.br/#obter-arquivo-de-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador) |
| GET | `/employees/{id}/vacations/periods` | `vacation.getPeriods` | [obter-periodos-aquisitivos-de-ferias-relacionados-a-um-colaborador](https://docs-api.convenia.com.br/#obter-periodos-aquisitivos-de-ferias-relacionados-a-um-colaborador) |
| GET | `/employees/{id}/vacations/periods/{periodId}` | `vacation.getPeriod` | [obter-periodo-aquisitivo-de-ferias-especifico-relacionado-a-um-colaborador](https://docs-api.convenia.com.br/#obter-periodo-aquisitivo-de-ferias-especifico-relacionado-a-um-colaborador) |
| GET | `/employees/{id}/change-histories` | `employee.getChangeHistories` | [obter-alteracoes-relacionadas-a-um-colaborador](https://docs-api.convenia.com.br/#obter-alteracoes-relacionadas-a-um-colaborador) |
| GET | `/employees/{id}/change-histories/{changeId}` | `employee.getChangeHistory` | [obter-alteracao-especifica-relacionadas-a-um-colaborador](https://docs-api.convenia.com.br/#obter-alteracao-especifica-relacionadas-a-um-colaborador) |
| POST | `/employees/admission` | `employee.startAdmission` | [iniciar-a-admissao-de-um-colaborador](https://docs-api.convenia.com.br/#iniciar-a-admissao-de-um-colaborador) |
| POST | `/employees/{id}/dismissal` | `employee.startDismissal` | [iniciar-o-desligamento-de-um-colaborador](https://docs-api.convenia.com.br/#iniciar-o-desligamento-de-um-colaborador) |
| POST | `/employees/{id}/custom-field-value` | `employee.setCustomFieldValues` | [atribuir-valor-a-campos-customizados](https://docs-api.convenia.com.br/#atribuir-valor-a-campos-customizados) |
| PUT | `/employees/{id}` | `employee.update` | [atualizar-dados-do-colaborador](https://docs-api.convenia.com.br/#atualizar-dados-do-colaborador) |
| GET | `/employees/{id}/benefits` | `employee.getBenefits` | [obter-beneficios-v2-de-um-colaborador-especifico](https://docs-api.convenia.com.br/#obter-beneficios-v2-de-um-colaborador-especifico) |
| POST | `/employees/{id}/{documentType}/{documentId}/document-files` | `employee.uploadDocument` | [upload-de-anexos-de-documentos-pessoais](https://docs-api.convenia.com.br/#upload-de-anexos-de-documentos-pessoais) |
| PUT | `/employees/{id}/dependents/{dependentId}` | `dependent.update` | [atualizar-dados-de-dependente](https://docs-api.convenia.com.br/#atualizar-dados-de-dependente) |
| PUT | `/employees/{id}/emergency-contacts/{contactId}` | `emergencyContact.update` | [atualizar-dados-de-contatos-de-emergencia](https://docs-api.convenia.com.br/#atualizar-dados-de-contatos-de-emergencia) |
| PUT | `/employees/{id}/bank-accounts/{accountId}` | `bankAccount.update` | [atualizar-dados-bancarios](https://docs-api.convenia.com.br/#atualizar-dados-bancarios) |
| POST | `/employees/{id}/educations` | `education.create` | [criar-informacao-academica](https://docs-api.convenia.com.br/#criar-informacao-academica) |
| PUT | `/employees/{id}/educations/{educationId}` | `education.update` | [atualizar-informacao-academica](https://docs-api.convenia.com.br/#atualizar-informacao-academica) |
| DELETE | `/employees/{id}/educations/{educationId}` | `education.delete` | [exclusao-de-informacao-academica](https://docs-api.convenia.com.br/#exclusao-de-informacao-academica) |
| POST | `/employees/{id}/stabilities` | `stability.create` | [criar-estabilidade](https://docs-api.convenia.com.br/#criar-estabilidade) |
| PUT | `/employees/{id}/stabilities/{stabilityId}` | `stability.update` | [atualizar-estabilidade](https://docs-api.convenia.com.br/#atualizar-estabilidade) |
| DELETE | `/employees/{id}/stabilities/{stabilityId}` | `stability.delete` | [exclusao-de-estabilidade](https://docs-api.convenia.com.br/#exclusao-de-estabilidade) |
| POST | `/employees/{id}/salaries-history` | `salaryRecord.create` | [criar-registro-de-vinculo-e-salario](https://docs-api.convenia.com.br/#criar-registro-de-vinculo-e-salario) |
| PUT | `/employees/{id}/salaries-history/{salaryRecordId}` | `salaryRecord.update` | [atualizar-registro-de-vinculo-e-salario](https://docs-api.convenia.com.br/#atualizar-registro-de-vinculo-e-salario) |
| GET | `/employees/absences/motives` | `absence.getMotives` | [obter-todos-os-motivos-de-faltas-e-afastamentos-para-um-colaborador](https://docs-api.convenia.com.br/#obter-todos-os-motivos-de-faltas-e-afastamentos-para-um-colaborador) |
| GET | `/employees/{id}/absences` | `absence.getAll` | [obter-todas-as-faltas-e-afastamentos-de-um-colaborador](https://docs-api.convenia.com.br/#obter-todas-as-faltas-e-afastamentos-de-um-colaborador) |
| GET | `/employees/{id}/absences/{absenceId}` | `absence.get` | [obter-uma-falta-afastamento-de-um-colaborador](https://docs-api.convenia.com.br/#obter-uma-falta-afastamento-de-um-colaborador) |
| POST | `/employees/{id}/absences` | `absence.create` | [criar-uma-falta-afastamento-para-um-colaborador](https://docs-api.convenia.com.br/#criar-uma-falta-afastamento-para-um-colaborador) |
| PUT | `/employees/{id}/absences/{absenceId}` | `absence.update` | [atualizar-uma-falta-afastamento-para-um-colaborador](https://docs-api.convenia.com.br/#atualizar-uma-falta-afastamento-para-um-colaborador) |
| DELETE | `/employees/{id}/absences/{absenceId}` | `absence.delete` | [deletar-uma-falta-afastamento-de-um-colaborador](https://docs-api.convenia.com.br/#deletar-uma-falta-afastamento-de-um-colaborador) |
| GET | `/companies/custom-fields` | `customField.getAll` | [obter-todos-os-campos-customizados](https://docs-api.convenia.com.br/#obter-todos-os-campos-customizados) |
| GET | `/companies/collective-vacations` | `vacation.getCollectiveVacations` | [obter-solicitacoes-de-ferias-coletivas-da-empresa](https://docs-api.convenia.com.br/#obter-solicitacoes-de-ferias-coletivas-da-empresa) |
| GET | `/companies/collective-vacations/{collectiveId}` | `vacation.getCollectiveVacation` | [obter-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador-2](https://docs-api.convenia.com.br/#obter-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador-2) |
| GET | `/companies/benefits` | `benefit.getAll` | [obter-beneficios-de-uma-empresa](https://docs-api.convenia.com.br/#obter-beneficios-de-uma-empresa) |
| GET | `/benefits/{id}` | `benefit.get` | [obter-beneficio-especifico-de-uma-empresa](https://docs-api.convenia.com.br/#obter-beneficio-especifico-de-uma-empresa) |
| GET | `/benefits/{id}/employees` | `benefit.getEmployees` | [obter-colaboradores-vinculados-a-um-beneficio-de-uma-empresa](https://docs-api.convenia.com.br/#obter-colaboradores-vinculados-a-um-beneficio-de-uma-empresa) |
| PUT | `/companies/benefits/{id}/upsert-employees` | `benefit.upsertEmployees` | [vincular-desvincular-colaboradores-a-beneficios](https://docs-api.convenia.com.br/#vincular-desvincular-colaboradores-a-beneficios) |
| PUT | `/companies/benefits/{id}/upsert-dependents` | `benefit.upsertDependents` | [vincular-desvincular-dependentes-a-beneficios](https://docs-api.convenia.com.br/#vincular-desvincular-dependentes-a-beneficios) |
| GET | `/companies/teams` | `team.getAll` | [obter-todos-os-times](https://docs-api.convenia.com.br/#obter-todos-os-times) |
| GET | `/companies/departments` | `department.getAll` | [obter-todos-os-departamentos](https://docs-api.convenia.com.br/#obter-todos-os-departamentos) |
| POST | `/companies/departments` | `department.create` | [criar-um-departamento](https://docs-api.convenia.com.br/#criar-um-departamento) |
| PUT | `/companies/departments/{id}` | `department.update` | [atualizar-um-departamento](https://docs-api.convenia.com.br/#atualizar-um-departamento) |
| DELETE | `/companies/departments/{id}` | `department.delete` | [deletar-um-departamento](https://docs-api.convenia.com.br/#deletar-um-departamento) |
| GET | `/companies/cost-centers` | `costCenter.getAll` | [obter-todos-os-centros-de-custo](https://docs-api.convenia.com.br/#obter-todos-os-centros-de-custo) |
| POST | `/companies/cost-center` | `costCenter.create` | [criar-um-centro-de-custo](https://docs-api.convenia.com.br/#criar-um-centro-de-custo) |
| PUT | `/companies/cost-centers/{id}` | `costCenter.update` | [atualizar-um-centro-de-custo](https://docs-api.convenia.com.br/#atualizar-um-centro-de-custo) |
| DELETE | `/companies/cost-centers/{id}` | `costCenter.delete` | [deletar-um-centro-de-custo](https://docs-api.convenia.com.br/#deletar-um-centro-de-custo) |
| GET | `/companies/jobs` | `job.getAll` | [obter-todos-os-cargos](https://docs-api.convenia.com.br/#obter-todos-os-cargos) |
| POST | `/companies/jobs` | `job.create` | [criar-um-cargo](https://docs-api.convenia.com.br/#criar-um-cargo) |
| PUT | `/companies/jobs/{id}` | `job.update` | [atualizar-um-cargo](https://docs-api.convenia.com.br/#atualizar-um-cargo) |
| DELETE | `/companies/jobs/{id}` | `job.delete` | [deletar-um-cargo](https://docs-api.convenia.com.br/#deletar-um-cargo) |
| GET | `/payrolls` | `payroll.getAll` | [obter-todas-as-folhas-da-empresa](https://docs-api.convenia.com.br/#obter-todas-as-folhas-da-empresa) |
| GET | `/payrolls/{id}` | `payroll.get` | [obter-folha-especifica-de-uma-empresa](https://docs-api.convenia.com.br/#obter-folha-especifica-de-uma-empresa) |
| GET | `/payrolls/{id}/files/{fileId}` | `payroll.downloadFile` | [obter-arquivo-de-folha-especifica-da-empresa](https://docs-api.convenia.com.br/#obter-arquivo-de-folha-especifica-da-empresa) |
| GET | `/payrolls/{id}/participants` | `payroll.getParticipants` | [obter-participantes-de-folha-especifica-da-empresa](https://docs-api.convenia.com.br/#obter-participantes-de-folha-especifica-da-empresa) |
| GET | `/payrolls/{id}/events` | `payroll.getEvents` | [obter-eventos-de-folha-especifica-da-empresa](https://docs-api.convenia.com.br/#obter-eventos-de-folha-especifica-da-empresa) |
| GET | `/payrolls/{id}/entries` | `payroll.getEntries` | [obter-lancamentos-de-folha-especifica-da-empresa](https://docs-api.convenia.com.br/#obter-lancamentos-de-folha-especifica-da-empresa) |

Catálogos usam `catalog.get` e o seletor com o valor do caminho. Webhooks não têm endpoint de cadastro; os eventos estão abaixo e no node Convenia Trigger.

## Eventos de webhook

| Evento | Âncora |
| --- | --- |
| `admission.started` | [admissao-iniciada](https://docs-api.convenia.com.br/#admissao-iniciada) |
| `admission.finished` | [admissao-finalizada](https://docs-api.convenia.com.br/#admissao-finalizada) |
| `dismissal.finished` | [desligamento](https://docs-api.convenia.com.br/#desligamento) |
| `dismissal.awaiting.accounting` | [desligamento-aguardando-contabilidade](https://docs-api.convenia.com.br/#desligamento-aguardando-contabilidade) |
| `vacation.created` | [criacao-de-ferias](https://docs-api.convenia.com.br/#criacao-de-ferias) |
| `vacation.approved` | [aprovacao-de-ferias](https://docs-api.convenia.com.br/#aprovacao-de-ferias) |
| `vacation.solicitation.updated` | [atualizacao-de-ferias](https://docs-api.convenia.com.br/#atualizacao-de-ferias) |
| `employee.edited` | [alteracao-no-perfil-de-colaboradores](https://docs-api.convenia.com.br/#alteracao-no-perfil-de-colaboradores) |
| `salary.historic.changed` | [alteracao-de-dados-salariais](https://docs-api.convenia.com.br/#alteracao-de-dados-salariais) |
| `absence.created` | [criacao-de-faltas-e-afastamentos](https://docs-api.convenia.com.br/#criacao-de-faltas-e-afastamentos) |
| `absence.updated` | [atualizacao-de-faltas-e-afastamentos](https://docs-api.convenia.com.br/#atualizacao-de-faltas-e-afastamentos) |
| `absence.deleted` | [delecao-de-faltas-e-afastamentos](https://docs-api.convenia.com.br/#delecao-de-faltas-e-afastamentos) |
| `birthday` | [aniversariantes-do-dia](https://docs-api.convenia.com.br/#aniversariantes-do-dia) |

## Âncoras h2 da documentação

As 103 âncoras `h2` lidas no HTML oficial. A âncora de tipos de falta está na seção de lacunas e não vira operação.

- [obter-dados-de-etnias](https://docs-api.convenia.com.br/#obter-dados-de-etnias)
- [obter-dados-de-nacionalidades](https://docs-api.convenia.com.br/#obter-dados-de-nacionalidades)
- [obter-dados-de-vinculos-empregaticios](https://docs-api.convenia.com.br/#obter-dados-de-vinculos-empregaticios)
- [obter-dados-de-estado-civil](https://docs-api.convenia.com.br/#obter-dados-de-estado-civil)
- [obter-dados-de-tipo-de-escolaridade](https://docs-api.convenia.com.br/#obter-dados-de-tipo-de-escolaridade)
- [obter-dados-de-tipo-da-conta-bancaria](https://docs-api.convenia.com.br/#obter-dados-de-tipo-da-conta-bancaria)
- [obter-listagem-de-bancos](https://docs-api.convenia.com.br/#obter-listagem-de-bancos)
- [obter-dados-de-estados](https://docs-api.convenia.com.br/#obter-dados-de-estados)
- [obter-dados-de-cidades](https://docs-api.convenia.com.br/#obter-dados-de-cidades)
- [obter-listagem-de-tipos-de-desligamento](https://docs-api.convenia.com.br/#obter-listagem-de-tipos-de-desligamento)
- [obter-listagem-de-tipos-de-aviso-previo](https://docs-api.convenia.com.br/#obter-listagem-de-tipos-de-aviso-previo)
- [obter-listagem-de-identidade-de-genero](https://docs-api.convenia.com.br/#obter-listagem-de-identidade-de-genero)
- [obter-listagem-dos-relacionamentos-de-contatos-de-emergencia](https://docs-api.convenia.com.br/#obter-listagem-dos-relacionamentos-de-contatos-de-emergencia)
- [obter-listagem-dos-tipos-de-admissao](https://docs-api.convenia.com.br/#obter-listagem-dos-tipos-de-admissao)
- [obter-listagem-dos-tipos-de-deficiencia](https://docs-api.convenia.com.br/#obter-listagem-dos-tipos-de-deficiencia)
- [obter-listagem-dos-tipos-de-pagamento](https://docs-api.convenia.com.br/#obter-listagem-dos-tipos-de-pagamento)
- [obter-listagem-dos-tipos-de-salario](https://docs-api.convenia.com.br/#obter-listagem-dos-tipos-de-salario)
- [obter-tipos-de-estabilidade](https://docs-api.convenia.com.br/#obter-tipos-de-estabilidade)
- [obter-listagem-dos-relacionamentos-de-dependentes](https://docs-api.convenia.com.br/#obter-listagem-dos-relacionamentos-de-dependentes)
- [obter-listagem-de-genero-no-documento](https://docs-api.convenia.com.br/#obter-listagem-de-genero-no-documento)
- [obter-listagem-dos-tipos-de-visto-estrangeiro](https://docs-api.convenia.com.br/#obter-listagem-dos-tipos-de-visto-estrangeiro)
- [obter-listagem-das-condicoes-de-ingresso-estrangeiro](https://docs-api.convenia.com.br/#obter-listagem-das-condicoes-de-ingresso-estrangeiro)
- [obter-listagem-das-opcoes-de-tempo-de-residencia-no-brasil-estrangeiro](https://docs-api.convenia.com.br/#obter-listagem-das-opcoes-de-tempo-de-residencia-no-brasil-estrangeiro)
- [obter-listagem-das-opcoes-de-descricao-do-logradouro-estrangeiro](https://docs-api.convenia.com.br/#obter-listagem-das-opcoes-de-descricao-do-logradouro-estrangeiro)
- [obter-listagem-das-opcoes-de-paises-estrangeiro](https://docs-api.convenia.com.br/#obter-listagem-das-opcoes-de-paises-estrangeiro)
- [obter-listagem-de-categoria-de-trabalhadores](https://docs-api.convenia.com.br/#obter-listagem-de-categoria-de-trabalhadores)
- [detalhe-de-um-token](https://docs-api.convenia.com.br/#detalhe-de-um-token)
- [obter-todos-os-colaboradores](https://docs-api.convenia.com.br/#obter-todos-os-colaboradores)
- [obter-todos-os-colaboradores-desligados](https://docs-api.convenia.com.br/#obter-todos-os-colaboradores-desligados)
- [obter-um-colaborador-especifico](https://docs-api.convenia.com.br/#obter-um-colaborador-especifico)
- [obter-o-historico-salarial-de-um-colaborador](https://docs-api.convenia.com.br/#obter-o-historico-salarial-de-um-colaborador)
- [obter-dependentes-relacionados-a-um-colaborador](https://docs-api.convenia.com.br/#obter-dependentes-relacionados-a-um-colaborador)
- [obter-solicitacoes-de-ferias-relacionadas-a-um-colaborador](https://docs-api.convenia.com.br/#obter-solicitacoes-de-ferias-relacionadas-a-um-colaborador)
- [obter-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador](https://docs-api.convenia.com.br/#obter-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador)
- [obter-arquivo-de-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador](https://docs-api.convenia.com.br/#obter-arquivo-de-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador)
- [obter-periodos-aquisitivos-de-ferias-relacionados-a-um-colaborador](https://docs-api.convenia.com.br/#obter-periodos-aquisitivos-de-ferias-relacionados-a-um-colaborador)
- [obter-periodo-aquisitivo-de-ferias-especifico-relacionado-a-um-colaborador](https://docs-api.convenia.com.br/#obter-periodo-aquisitivo-de-ferias-especifico-relacionado-a-um-colaborador)
- [obter-alteracoes-relacionadas-a-um-colaborador](https://docs-api.convenia.com.br/#obter-alteracoes-relacionadas-a-um-colaborador)
- [obter-alteracao-especifica-relacionadas-a-um-colaborador](https://docs-api.convenia.com.br/#obter-alteracao-especifica-relacionadas-a-um-colaborador)
- [iniciar-a-admissao-de-um-colaborador](https://docs-api.convenia.com.br/#iniciar-a-admissao-de-um-colaborador)
- [iniciar-o-desligamento-de-um-colaborador](https://docs-api.convenia.com.br/#iniciar-o-desligamento-de-um-colaborador)
- [atribuir-valor-a-campos-customizados](https://docs-api.convenia.com.br/#atribuir-valor-a-campos-customizados)
- [atualizar-dados-do-colaborador](https://docs-api.convenia.com.br/#atualizar-dados-do-colaborador)
- [obter-beneficios-v2-de-um-colaborador-especifico](https://docs-api.convenia.com.br/#obter-beneficios-v2-de-um-colaborador-especifico)
- [upload-de-anexos-de-documentos-pessoais](https://docs-api.convenia.com.br/#upload-de-anexos-de-documentos-pessoais)
- [atualizar-dados-de-dependente](https://docs-api.convenia.com.br/#atualizar-dados-de-dependente)
- [atualizar-dados-de-contatos-de-emergencia](https://docs-api.convenia.com.br/#atualizar-dados-de-contatos-de-emergencia)
- [atualizar-dados-bancarios](https://docs-api.convenia.com.br/#atualizar-dados-bancarios)
- [criar-informacao-academica](https://docs-api.convenia.com.br/#criar-informacao-academica)
- [atualizar-informacao-academica](https://docs-api.convenia.com.br/#atualizar-informacao-academica)
- [exclusao-de-informacao-academica](https://docs-api.convenia.com.br/#exclusao-de-informacao-academica)
- [criar-estabilidade](https://docs-api.convenia.com.br/#criar-estabilidade)
- [atualizar-estabilidade](https://docs-api.convenia.com.br/#atualizar-estabilidade)
- [exclusao-de-estabilidade](https://docs-api.convenia.com.br/#exclusao-de-estabilidade)
- [criar-registro-de-vinculo-e-salario](https://docs-api.convenia.com.br/#criar-registro-de-vinculo-e-salario)
- [atualizar-registro-de-vinculo-e-salario](https://docs-api.convenia.com.br/#atualizar-registro-de-vinculo-e-salario)
- [obter-todos-os-motivos-de-faltas-e-afastamentos-para-um-colaborador](https://docs-api.convenia.com.br/#obter-todos-os-motivos-de-faltas-e-afastamentos-para-um-colaborador)
- [obter-todos-os-tipos-de-faltas-e-afastamentos-para-um-colaborador](https://docs-api.convenia.com.br/#obter-todos-os-tipos-de-faltas-e-afastamentos-para-um-colaborador)
- [obter-todas-as-faltas-e-afastamentos-de-um-colaborador](https://docs-api.convenia.com.br/#obter-todas-as-faltas-e-afastamentos-de-um-colaborador)
- [obter-uma-falta-afastamento-de-um-colaborador](https://docs-api.convenia.com.br/#obter-uma-falta-afastamento-de-um-colaborador)
- [criar-uma-falta-afastamento-para-um-colaborador](https://docs-api.convenia.com.br/#criar-uma-falta-afastamento-para-um-colaborador)
- [atualizar-uma-falta-afastamento-para-um-colaborador](https://docs-api.convenia.com.br/#atualizar-uma-falta-afastamento-para-um-colaborador)
- [deletar-uma-falta-afastamento-de-um-colaborador](https://docs-api.convenia.com.br/#deletar-uma-falta-afastamento-de-um-colaborador)
- [obter-todos-os-campos-customizados](https://docs-api.convenia.com.br/#obter-todos-os-campos-customizados)
- [obter-solicitacoes-de-ferias-coletivas-da-empresa](https://docs-api.convenia.com.br/#obter-solicitacoes-de-ferias-coletivas-da-empresa)
- [obter-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador-2](https://docs-api.convenia.com.br/#obter-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador-2)
- [obter-beneficios-de-uma-empresa](https://docs-api.convenia.com.br/#obter-beneficios-de-uma-empresa)
- [obter-beneficio-especifico-de-uma-empresa](https://docs-api.convenia.com.br/#obter-beneficio-especifico-de-uma-empresa)
- [obter-colaboradores-vinculados-a-um-beneficio-de-uma-empresa](https://docs-api.convenia.com.br/#obter-colaboradores-vinculados-a-um-beneficio-de-uma-empresa)
- [vincular-desvincular-colaboradores-a-beneficios](https://docs-api.convenia.com.br/#vincular-desvincular-colaboradores-a-beneficios)
- [vincular-desvincular-dependentes-a-beneficios](https://docs-api.convenia.com.br/#vincular-desvincular-dependentes-a-beneficios)
- [obter-todos-os-times](https://docs-api.convenia.com.br/#obter-todos-os-times)
- [obter-todos-os-departamentos](https://docs-api.convenia.com.br/#obter-todos-os-departamentos)
- [criar-um-departamento](https://docs-api.convenia.com.br/#criar-um-departamento)
- [atualizar-um-departamento](https://docs-api.convenia.com.br/#atualizar-um-departamento)
- [deletar-um-departamento](https://docs-api.convenia.com.br/#deletar-um-departamento)
- [obter-todos-os-centros-de-custo](https://docs-api.convenia.com.br/#obter-todos-os-centros-de-custo)
- [criar-um-centro-de-custo](https://docs-api.convenia.com.br/#criar-um-centro-de-custo)
- [atualizar-um-centro-de-custo](https://docs-api.convenia.com.br/#atualizar-um-centro-de-custo)
- [deletar-um-centro-de-custo](https://docs-api.convenia.com.br/#deletar-um-centro-de-custo)
- [obter-todos-os-cargos](https://docs-api.convenia.com.br/#obter-todos-os-cargos)
- [criar-um-cargo](https://docs-api.convenia.com.br/#criar-um-cargo)
- [atualizar-um-cargo](https://docs-api.convenia.com.br/#atualizar-um-cargo)
- [deletar-um-cargo](https://docs-api.convenia.com.br/#deletar-um-cargo)
- [obter-todas-as-folhas-da-empresa](https://docs-api.convenia.com.br/#obter-todas-as-folhas-da-empresa)
- [obter-folha-especifica-de-uma-empresa](https://docs-api.convenia.com.br/#obter-folha-especifica-de-uma-empresa)
- [obter-arquivo-de-folha-especifica-da-empresa](https://docs-api.convenia.com.br/#obter-arquivo-de-folha-especifica-da-empresa)
- [obter-participantes-de-folha-especifica-da-empresa](https://docs-api.convenia.com.br/#obter-participantes-de-folha-especifica-da-empresa)
- [obter-eventos-de-folha-especifica-da-empresa](https://docs-api.convenia.com.br/#obter-eventos-de-folha-especifica-da-empresa)
- [obter-lancamentos-de-folha-especifica-da-empresa](https://docs-api.convenia.com.br/#obter-lancamentos-de-folha-especifica-da-empresa)
- [admissao-iniciada](https://docs-api.convenia.com.br/#admissao-iniciada)
- [admissao-finalizada](https://docs-api.convenia.com.br/#admissao-finalizada)
- [desligamento](https://docs-api.convenia.com.br/#desligamento)
- [desligamento-aguardando-contabilidade](https://docs-api.convenia.com.br/#desligamento-aguardando-contabilidade)
- [criacao-de-ferias](https://docs-api.convenia.com.br/#criacao-de-ferias)
- [aprovacao-de-ferias](https://docs-api.convenia.com.br/#aprovacao-de-ferias)
- [atualizacao-de-ferias](https://docs-api.convenia.com.br/#atualizacao-de-ferias)
- [alteracao-no-perfil-de-colaboradores](https://docs-api.convenia.com.br/#alteracao-no-perfil-de-colaboradores)
- [alteracao-de-dados-salariais](https://docs-api.convenia.com.br/#alteracao-de-dados-salariais)
- [criacao-de-faltas-e-afastamentos](https://docs-api.convenia.com.br/#criacao-de-faltas-e-afastamentos)
- [atualizacao-de-faltas-e-afastamentos](https://docs-api.convenia.com.br/#atualizacao-de-faltas-e-afastamentos)
- [delecao-de-faltas-e-afastamentos](https://docs-api.convenia.com.br/#delecao-de-faltas-e-afastamentos)
- [aniversariantes-do-dia](https://docs-api.convenia.com.br/#aniversariantes-do-dia)

## Operações do node

- `employee.getAll` — Listar ativos. Lista colaboradores ativos. A resposta de exemplo inclui documentos e salário; trate o resultado como dado pessoal.
- `employee.getDismissed` — Listar desligados. Lista colaboradores desligados. from_date e to_date são opcionais.
- `employee.get` — Obter. Detalhe de um colaborador. A URL oficial renderiza o ID em branco; o caminho usado é /employees/{id}. Benefícios deste retorno são da v1.
- `employee.getSalaryHistoric` — Histórico salarial. Consulta o histórico salarial. Não cria registro; a criação fica em Vínculo e salário.
- `employee.getDependents` — Listar dependentes. Dependentes do colaborador. Benefícios deste retorno são da v1.
- `employee.getChangeHistories` — Listar alterações. Histórico de alterações do perfil.
- `employee.getChangeHistory` — Obter alteração. Uma alteração do histórico do perfil.
- `employee.startAdmission` — Iniciar admissão. Cria o colaborador e inicia a admissão. Operação de escrita de dado pessoal.
- `employee.startDismissal` — Iniciar desligamento. Inicia o desligamento do colaborador. Operação de escrita trabalhista.
- `employee.setCustomFieldValues` — Definir campos customizados. Atribui valores de campos da seção Outras Informações.
- `employee.update` — Atualizar. Atualiza somente os campos adicionados. A resposta documentada é 204, sem corpo.
- `employee.getBenefits` — Benefícios v2. Benefícios v2 do colaborador e dos dependentes. A URL oficial mostra o ID entre barras; o caminho é /employees/{id}/benefits.
- `employee.uploadDocument` — Enviar anexo. Upload multipart do campo file para cpf, ctps, rg, driver-license, reservist ou electoral-card.
- `vacation.getSolicitations` — Listar solicitações. Solicitações de férias do colaborador, canceladas ou não.
- `vacation.getSolicitation` — Obter solicitação. Detalhe de uma solicitação de férias.
- `vacation.downloadSolicitationFile` — Baixar arquivo da solicitação. A documentação descreve a resposta como stream e mostra um exemplo vazio. O arquivo volta no campo binário.
- `vacation.getPeriods` — Listar períodos. Períodos aquisitivos do colaborador.
- `vacation.getPeriod` — Obter período. Detalhe de um período aquisitivo.
- `vacation.getCollectiveVacations` — Listar férias coletivas. Férias coletivas da empresa.
- `vacation.getCollectiveVacation` — Obter férias coletivas. Detalhe de férias coletivas. O título da página oficial repete o texto de solicitação individual; o caminho é /companies/collective-vacations/{id}.
- `absence.getMotives` — Listar motivos. GET /employees/absences/motives. A seção de tipos usa a mesma URL; ela não vira outra operação.
- `absence.getAll` — Listar. Faltas e afastamentos do colaborador.
- `absence.get` — Obter. Uma falta ou afastamento.
- `absence.create` — Criar. Cria falta ou afastamento. A tabela oficial chama date_to de início e date_from de término; os nomes enviados são os da tabela.
- `absence.update` — Atualizar. Atualiza uma falta. Se uma das datas for enviada, a documentação exige a outra.
- `absence.delete` — Excluir. Exclui uma falta. A resposta documentada é 204.
- `dependent.update` — Atualizar. Atualiza um dependente. Resposta documentada 204.
- `emergencyContact.update` — Atualizar. Atualiza um contato de emergência. Resposta documentada 204.
- `bankAccount.update` — Atualizar. Atualiza uma conta bancária. Resposta documentada 204.
- `education.create` — Criar. Cria formação. As quatro chaves documentadas são sempre enviadas; vazio vira null.
- `education.update` — Atualizar. Atualiza formação. Diferente da criação, campo vazio é omitido. Resposta 204.
- `education.delete` — Excluir. Exclui formação. Resposta 204.
- `stability.create` — Criar. Cria estabilidade. stability_type_id é obrigatório.
- `stability.update` — Atualizar. Atualiza estabilidade. Resposta 204.
- `stability.delete` — Excluir. Exclui estabilidade. Resposta 204.
- `salaryRecord.create` — Criar. Cria registro de vínculo e salário. O motivo não tem endpoint de lista.
- `salaryRecord.update` — Atualizar. Atualiza vínculo e salário. Resposta 204. Datas não podem sobrepor outros registros.
- `benefit.getAll` — Listar. Benefícios da empresa.
- `benefit.get` — Obter. Detalhe de um benefício. O caminho documentado é /benefits/{id}, sem o prefixo companies.
- `benefit.getEmployees` — Listar vínculos. Colaboradores e dependentes vinculados. A resposta pagina, mas a documentação não lista query params. O retorno de todas as páginas só segue next_page_url.
- `benefit.upsertEmployees` — Vincular colaboradores. PUT upsert-employees. is_active verdadeiro vincula e falso desvincula.
- `benefit.upsertDependents` — Vincular dependentes. A tabela diz dependentes e o exemplo JSON usa dependents. O node envia dependents.
- `department.getAll` — Listar. Departamentos da empresa.
- `department.create` — Criar. Cria um departamento.
- `department.update` — Atualizar. Atualiza o nome. A tabela de headers da documentação troca token por name; o node envia o token no header e o nome no corpo. Resposta 204.
- `department.delete` — Excluir. Exclui o departamento e transfere pessoas para outro. Corpo transfer_to. Resposta 204.
- `costCenter.getAll` — Listar. GET /companies/cost-centers.
- `costCenter.create` — Criar. POST /companies/cost-center, no singular, como documentado.
- `costCenter.update` — Atualizar. Atualiza o nome. A tabela de headers repete o erro de name no lugar de token. Resposta 204.
- `costCenter.delete` — Excluir. A tabela chama o campo de name e descreve o UUID de destino. O node envia { name: uuid }. Resposta 204.
- `job.getAll` — Listar. Cargos da empresa.
- `job.create` — Criar. Cria cargo. name e cbo_code são obrigatórios.
- `job.update` — Atualizar. A documentação marca name e cbo_code como obrigatórios também na atualização. Resposta 204.
- `job.delete` — Excluir. Exclui o cargo e transfere pessoas. Corpo transfer_to. Resposta 204.
- `team.getAll` — Listar. Times da empresa. A documentação não traz criação ou edição.
- `payroll.getAll` — Listar. Folhas ativas. Folhas inativas não são listadas. is_accounting e due_date foram marcados como depreciados em 31/03/2025 e, se ainda vierem, são repassados.
- `payroll.get` — Obter. Detalhe da folha. Folha inativa responde 404.
- `payroll.downloadFile` — Baixar arquivo. Stream do arquivo da folha. O exemplo oficial é um objeto vazio; o binário é anexado ao item.
- `payroll.getParticipants` — Participantes. Participantes da folha. value e identificadores são dados de folha.
- `payroll.getEvents` — Eventos. Eventos ou rubricas da folha.
- `payroll.getEntries` — Lançamentos. Lançamentos. Para Valor, a documentação diz que value está em centavos; para Horas, em milissegundos. O node não converte.
- `customField.getAll` — Listar. Campos customizados da empresa.
- `catalog.get` — Obter. Uma lista de sistema. Cidades aceitam um filtro de estado.
- `token.getPermissions` — Ver permissões. Detalhe e permissões do token. Também é o endpoint somente leitura usado no teste da credencial.

## Lacunas

Estas diferenças estão documentadas e não são tratadas como se a API oferecesse outro contrato.

- `obter-todos-os-tipos-de-faltas-e-afastamentos-para-um-colaborador` repete `GET /employees/absences/motives`. Não existe operação separada de tipos. `absence.getMotives` cobre o caminho que a documentação realmente publica.
- O exemplo oficial de aniversariantes não é JSON válido: `employee_ids` aparece como objeto com strings soltas. Payload inválido responde 400. JSON com `employee_ids` e sem `type` também responde 400. O node não classifica isso como `birthday`.
- A tabela de benefícios cita a chave `dependentes`. O exemplo JSON usa `dependents`. O node envia `dependents`.
- Criar centro de custo é `POST /companies/cost-center`, no singular. Listar, atualizar e apagar usam `/companies/cost-centers`.
- Apagar centro de custo envia o destino no corpo com a chave `name`. Departamento e cargo usam `transfer_to`.
- As tabelas de header de atualização de departamento e centro de custo listam `name` como se fosse o token. O node continua enviando o token no header `token` e o nome no corpo.
- A admissão documenta campos aninhados em notação de colchetes (`documents[cpf]`, `address[zip_code]`). Os exemplos REST são JSON aninhado. O node envia JSON aninhado. Isso precisa de confirmação em sandbox.
- Colaboradores de um benefício devolvem `current_page`, `total_pages`, `next_page_url` e um exemplo de `per_page` 200, sem query documentada. Retornar tudo segue somente `next_page_url`. O node não inventa `paginate`.
- `motive_id` de vínculo e salário não tem catálogo publicado.
- Criar formação envia as quatro chaves mesmo quando o valor é nulo, como a documentação pede.
- Na falta, o rótulo de `date_to` fala em início e o de `date_from` fala em fim. O node envia os nomes dos campos como estão escritos.
- `cid` é descrito como matrícula, mas o nome e o exemplo sugerem CID. O node envia a chave `cid` sem reinterpretar.
- Tipos de desligamento e de aviso dizem que o header token é opcional, enquanto a introdução diz que toda requisição precisa de token. O node sempre envia o token.
- Folha: `is_accounting` e `due_date` constam como remoção em 31/03/2025. O node não os converte. `value` é inteiro na unidade menor documentada e não é dividido.
- Não há cadastro de webhook, criação ou aprovação de férias, exclusão de colaborador, CRUD de time nem catálogo de motivo salarial.
- A documentação cita `spatie/laravel-webhook-client` e o header `Signature` (“segredo + payload criptografados”) e não publica algoritmo nem vetor. O node compara HMAC-SHA256 hexadecimal do corpo cru, que é o validador padrão da biblioteca. Isso é interpretação não verificada em sandbox, não um contrato confirmado.
- Não houve chamada a sandbox. Fixtures de teste são exemplos rotulados, não respostas ao vivo.
- Return All não corta a lista em silêncio. O campo Max Pages, padrão 100, faz o node falhar se ainda houver página. URL repetida ou `next_page_url` fora da origem também falha sem devolver parcial. O teto de 48 requisições por minuto vale só para o processo atual e o ID da credencial. Não coordena outros processos que usam o mesmo token. Escritas não são repetidas em 429.
- Download é tratado como binário. A documentação diz stream e não fixa o content-type.
- Upload aceita as extensões listadas: pdf, doc, docx, xlsx, xls, ppt, pptx, txt, gif, jpeg, jpg, png, zip, rar, gz. Tipos: cpf, ctps, rg, driver-license, reservist, electoral-card.
- Busca de departamento, cargo, centro de custo, time, benefício e campo customizado filtra no cliente a lista simples, porque a documentação não descreve `like` nem `paginate` nesses caminhos. Folha pagina com `paginate` e filtra nome ou `type.name` na página atual.
- O HTTP Request node usa a URL base oficial fixa. A URL alternativa da credencial vale para o node Convenia.
- `n8n.strict` está ligado, com o ESLint padrão do node-cli. Os rótulos do editor estão em inglês por causa dessas regras. O `findPackageJson` do plugin não lê `package.json` quando o pai do pacote é a raiz do sistema de arquivos; `npm run lint` executa `n8n-node lint` numa cópia aninhada para essas regras rodarem. A credencial de API testa `GET /tokens/permissions`. A de webhook usa `testedBy` e não chama HTTP.
