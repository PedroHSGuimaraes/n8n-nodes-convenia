# Campos tipados

Cada linha é um campo do formulário. O node só envia o que for preenchido, exceto onde a matriz de cobertura diz o contrário. Campo de texto vazio é omitido. Na criação de formação, vazio vira null. Um booleano incluído na coleção e marcado como não é enviado como `false`. Booleano de três estados só sai do formulário quando a escolha é Yes ou No. Do Not Send omite o campo. Os rótulos do editor estão em inglês.

## Admissão — outros dados

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `registration` | `registration` | string |
| `birthDate` | `birth_date` | date |
| `gender` | `gender` | string |
| `maritalStatusId` | `marital_status_id` | int |
| `fatherName` | `father_name` | string |
| `motherName` | `mother_name` | string |
| `phone` | `phone` | string |
| `cell` | `cell` | string |
| `naturalFromStateUf` | `natural_from_state_uf` | string |
| `naturalFromStateId` | `natural_from_state_id` | int |
| `naturalFromCity` | `natural_from_city` | string |
| `naturalFromCityId` | `natural_from_city_id` | int |
| `ethnicityId` | `ethnicity_id` | int |
| `nationalityId` | `nationality_id` | int |
| `firstJob` | `first_job` | tri |

## Admissão — documentos

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `cpf` | `cpf` | string |
| `rg` | `rg` | string |
| `rgExpedition` | `rg_expedition` | date |
| `rgEmission` | `rg_emission` | string |
| `voterCard` | `voter_card` | string |
| `voterCardSection` | `voter_card_section` | string |
| `ctps` | `ctps` | string |
| `ctpsSerie` | `ctps_serie` | string |
| `ctpsEmission` | `ctps_emission` | date |
| `cnh` | `cnh` | string |
| `pis` | `pis` | string |

## Admissão — endereço

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `zipCode` | `zip_code` | zip |
| `address` | `address` | string |
| `complement` | `complement` | string |
| `number` | `number` | string |
| `district` | `district` | string |
| `city` | `city` | string |
| `cityId` | `city_id` | int |
| `state` | `state` | string |
| `stateId` | `state_id` | int |

## Admissão — formação

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `course` | `course` | string |
| `institution` | `institution` | string |
| `graduationYear` | `graduation_year` | string |
| `educationTypeId` | `education_type_id` | int |

## Admissão — conta bancária

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `account` | `account` | string |
| `agency` | `agency` | string |
| `digit` | `digit` | string |
| `accountantTypeId` | `accountant_type_id` | int |
| `bankId` | `bank_id` | int |

## Atualização de colaborador

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `name` | `name` | string |
| `lastName` | `last_name` | string |
| `supervisorId` | `supervisor_id` | string |
| `registration` | `registration` | string |
| `hiringDate` | `hiring_date` | date |
| `admissionExamDate` | `admission_exam_date` | date |
| `firstJob` | `first_job` | boolean |
| `positionOfTrust` | `position_of_trust` | boolean |
| `hasUnemploymentAssistance` | `has_unemployment_assistance` | boolean |
| `cipa` | `cipa` | boolean |
| `retired` | `retired` | boolean |
| `corporateEmail` | `corporate_email` | email |
| `classOrganInscription` | `class_organ_inscription` | string |
| `professionalCouncil` | `professional_council` | string |
| `stabilityId` | `stability_id` | int |
| `admissionTypeId` | `admission_type_id` | int |
| `paymentMethodId` | `payment_method_id` | int |
| `salaryTypeId` | `salary_type_id` | int |
| `birthDate` | `birth_date` | date |
| `genderId` | `gender_id` | int |
| `maritalStatusId` | `marital_status_id` | int |
| `fatherName` | `father_name` | string |
| `motherName` | `mother_name` | string |
| `socialName` | `social_name` | string |
| `birthStateId` | `birth_state_id` | int |
| `birthCityId` | `birth_city_id` | int |
| `ethnicityId` | `ethnicity_id` | int |
| `genderIdentityId` | `gender_identity_id` | int |
| `disabilityId` | `disability_id` | int |
| `disabilityObservations` | `observations` | string |
| `personalEmail` | `personal_email` | email |
| `residentialPhone` | `residential_phone` | string |
| `cellphone` | `cellphone` | string |
| `zipCode` | `zip_code` | zip |
| `addressLine` | `address` | string |
| `complement` | `complement` | string |
| `addressNumber` | `number` | string |
| `district` | `district` | string |
| `cityId` | `city_id` | int |
| `stateId` | `state_id` | int |
| `cpf` | `cpf` | string |
| `ctpsNumber` | `number` | string |
| `ctpsSerialNumber` | `serial_number` | string |
| `ctpsEmissionDate` | `emission_date` | date |
| `ctpsIssuingStateId` | `issuing_state_id` | int |
| `ctpsPis` | `pis` | string |
| `driverLicenseNumber` | `number` | string |
| `driverLicenseEmissionDate` | `emission_date` | date |
| `driverLicenseValidateDate` | `validate_date` | date |
| `driverLicenseCategory` | `category` | string |
| `electoralNumber` | `number` | string |
| `electoralSection` | `section` | string |
| `electoralWard` | `electoral_ward` | string |
| `electoralStateId` | `state_id` | int |
| `electoralCityId` | `city_id` | int |
| `reservist` | `reservist` | string |
| `reservistRaNumber` | `ra_number` | string |
| `reservistSeries` | `series` | string |
| `generalRegisterNumber` | `number` | string |
| `generalRegisterEmissionDate` | `emission_date` | date |
| `generalRegisterIssuingAgency` | `issuing_agency` | string |
| `generalRegisterIssuingStateId` | `issuing_state_id` | int |
| `livesInBrazil` | `lives_in_brazil` | boolean |
| `visaId` | `visa_id` | int |
| `arrivalDate` | `arrival_date` | date |
| `naturalizationDate` | `naturalization_date` | date |
| `countryId` | `country_id` | int |
| `marriedToBrazilian` | `married_to_brazilian` | boolean |
| `hasBrazilianOffspring` | `has_brazilian_offspring` | boolean |
| `residenceTimeId` | `residence_time_id` | int |
| `entryConditionId` | `entry_condition_id` | int |
| `addressDescriptionId` | `address_description_id` | int |
| `zipCodeForeign` | `zip_code_foreign` | zip |
| `foreignAddress` | `foreign_address` | string |
| `foreignNumber` | `number` | string |
| `foreignComplement` | `complement` | string |
| `foreignDistrict` | `district` | string |
| `foreignCity` | `city` | string |

## Dependente

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `name` | `name` | string |
| `lastName` | `last_name` | string |
| `email` | `email` | email |
| `birthDate` | `birth_date` | date |
| `cpf` | `cpf` | string |
| `motherName` | `mother_name` | string |
| `ir` | `ir` | boolean |
| `familySalary` | `family_salary` | boolean |
| `hasDisability` | `has_disability` | boolean |
| `foreigner` | `foreigner` | boolean |
| `description` | `description` | string |
| `phone` | `phone` | string |
| `genderId` | `gender_id` | int |
| `educationTypeId` | `education_type_id` | int |

## Contato de emergência

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `name` | `name` | string |
| `emergencyContactRelationId` | `emergency_contact_relation_id` | int |
| `email` | `email` | email |
| `phone` | `phone` | string |
| `cellphone` | `cellphone` | string |
| `workPhone` | `work_phone` | string |

## Conta bancária

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `account` | `account` | string |
| `agency` | `agency` | string |
| `digit` | `digit` | string |
| `accountTypeId` | `account_type_id` | int |
| `bankId` | `bank_id` | int |
| `pix` | `pix` | string |
| `modality` | `modality` | string |

## Formação acadêmica

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `educationTypeId` | `education_type_id` | int |
| `course` | `course` | string |
| `institution` | `institution` | string |
| `graduationYear` | `graduation_year` | int |

## Estabilidade

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `stabilityTypeId` | `stability_type_id` | int |
| `dateFrom` | `date_from` | date |
| `dateTo` | `date_to` | date |
| `observation` | `observation` | string |

## Vínculo e salário — obrigatórios na criação

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `salary` | `salary` | decimal |
| `relationshipId` | `relationship_id` | int |
| `motiveId` | `motive_id` | int |
| `dateFrom` | `date_from` | date |

## Vínculo e salário — opcionais

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `workerCategoryId` | `worker_category_id` | int |

## Falta e afastamento

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `justification` | `justification` | string |
| `absenceMotiveId` | `absence_motive_id` | int |
| `absenceTypeId` | `absence_type_id` | int |
| `cid` | `cid` | string |

## Desligamento — opcionais

| Campo no node | Chave na API | Tipo |
| --- | --- | --- |
| `motive` | `motive` | string |
| `comments` | `comments` | string |
| `removeBenefit` | `remove_benefit` | tri |
| `breakingContract` | `breaking_contract` | tri |
| `terminationNoticeDate` | `termination_notice_date` | date |

