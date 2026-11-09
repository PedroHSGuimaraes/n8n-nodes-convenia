import type { ScalarField } from '../description/properties';

export interface ApiField extends ScalarField {
	api: string;
	section?: string;
}

export const admissionAdditional: ApiField[] = [
	{ name: 'registration', api: 'registration', displayName: 'Registration', description: 'Employee registration.', kind: 'string' },
	{ name: 'birthDate', api: 'birth_date', displayName: 'Birth Date', description: 'Birth date in YYYY-MM-DD.', kind: 'date', placeholder: 'AAAA-MM-DD' },
	{ name: 'gender', api: 'gender', displayName: 'Sex', description: 'The admission documentation accepts M or F in this field.', kind: 'string', placeholder: 'M ou F' },
	{ name: 'maritalStatusId', api: 'marital_status_id', displayName: 'Marital Status', description: 'Marital status ID.', kind: 'int', load: 'marital-status' },
	{ name: 'fatherName', api: 'father_name', displayName: 'Father Name', description: 'Father name.', kind: 'string' },
	{ name: 'motherName', api: 'mother_name', displayName: 'Mother Name', description: 'Mother name.', kind: 'string' },
	{ name: 'phone', api: 'phone', displayName: 'Phone', description: 'Phone number.', kind: 'string' },
	{ name: 'cell', api: 'cell', displayName: 'Cellphone', description: 'Cellphone. The admission field name is cell.', kind: 'string' },
	{ name: 'naturalFromStateUf', api: 'natural_from_state_uf', displayName: 'Birth State Abbreviation', description: 'Birth state abbreviation. Required by the API when a city is sent and natural_from_state_id is not.', kind: 'string', placeholder: 'SP' },
	{ name: 'naturalFromStateId', api: 'natural_from_state_id', displayName: 'Birth State', description: 'Birth state ID.', kind: 'int', load: 'states' },
	{ name: 'naturalFromCity', api: 'natural_from_city', displayName: 'Birth City', description: 'Birth city name.', kind: 'string' },
	{ name: 'naturalFromCityId', api: 'natural_from_city_id', displayName: 'Birth City ID', description: 'Birth city ID.', kind: 'int' },
	{ name: 'ethnicityId', api: 'ethnicity_id', displayName: 'Ethnicity', description: 'Ethnicity ID.', kind: 'int', load: 'ethnicities' },
	{ name: 'nationalityId', api: 'nationality_id', displayName: 'Nationality', description: 'Nationality ID.', kind: 'int', load: 'nationalities' },
	{ name: 'firstJob', api: 'first_job', displayName: 'First Job', description: 'Send this only when you want to set the indicator.', kind: 'tri' },
];

export const admissionDocuments: ApiField[] = [
	{ name: 'cpf', api: 'cpf', section: 'documents', displayName: 'CPF', description: 'documents.cpf. The value is sent as typed and is not printed in errors.', kind: 'string' },
	{ name: 'rg', api: 'rg', section: 'documents', displayName: 'RG', description: 'documents.rg.', kind: 'string' },
	{ name: 'rgExpedition', api: 'rg_expedition', section: 'documents', displayName: 'RG Expedition Date', description: 'documents.rg_expedition in YYYY-MM-DD.', kind: 'date' },
	{ name: 'rgEmission', api: 'rg_emission', section: 'documents', displayName: 'RG Issuing Agency', description: 'documents.rg_emission. The official table describes the format as a state abbreviation.', kind: 'string' },
	{ name: 'voterCard', api: 'voter_card', section: 'documents', displayName: 'Electoral Card', description: 'documents.voter_card.', kind: 'string' },
	{ name: 'voterCardSection', api: 'voter_card_section', section: 'documents', displayName: 'Electoral Section', description: 'documents.voter_card_section.', kind: 'string' },
	{ name: 'ctps', api: 'ctps', section: 'documents', displayName: 'CTPS', description: 'documents.ctps.', kind: 'string' },
	{ name: 'ctpsSerie', api: 'ctps_serie', section: 'documents', displayName: 'CTPS Series', description: 'documents.ctps_serie.', kind: 'string' },
	{ name: 'ctpsEmission', api: 'ctps_emission', section: 'documents', displayName: 'CTPS Emission Date', description: 'documents.ctps_emission in YYYY-MM-DD.', kind: 'date' },
	{ name: 'cnh', api: 'cnh', section: 'documents', displayName: 'CNH', description: 'documents.cnh.', kind: 'string' },
	{ name: 'pis', api: 'pis', section: 'documents', displayName: 'PIS', description: 'documents.pis.', kind: 'string' },
];

export const admissionAddress: ApiField[] = [
	{ name: 'zipCode', api: 'zip_code', section: 'address', displayName: 'CEP', description: 'Eight digits, without a hyphen.', kind: 'zip' },
	{ name: 'address', api: 'address', section: 'address', displayName: 'Street', description: 'address.address.', kind: 'string' },
	{ name: 'complement', api: 'complement', section: 'address', displayName: 'Complement', description: 'Address complement.', kind: 'string' },
	{ name: 'number', api: 'number', section: 'address', displayName: 'Number', description: 'Address number.', kind: 'string' },
	{ name: 'district', api: 'district', section: 'address', displayName: 'District', description: 'District name.', kind: 'string' },
	{ name: 'city', api: 'city', section: 'address', displayName: 'City', description: 'City name.', kind: 'string' },
	{ name: 'cityId', api: 'city_id', section: 'address', displayName: 'City ID', description: 'address.city_id.', kind: 'int' },
	{ name: 'state', api: 'state', section: 'address', displayName: 'State Abbreviation', description: 'State abbreviation. Required by the API when a city is sent and state_id is not.', kind: 'string', placeholder: 'SP' },
	{ name: 'stateId', api: 'state_id', section: 'address', displayName: 'State', description: 'address.state_id.', kind: 'int', load: 'states' },
];

export const admissionEducation: ApiField[] = [
	{ name: 'course', api: 'course', section: 'education', displayName: 'Course', description: 'education.course.', kind: 'string' },
	{ name: 'institution', api: 'institution', section: 'education', displayName: 'Institution', description: 'education.institution.', kind: 'string' },
	{ name: 'graduationYear', api: 'graduation_year', section: 'education', displayName: 'Graduation Year', description: 'education.graduation_year. Admission documents this year as text.', kind: 'string', placeholder: '2021' },
	{ name: 'educationTypeId', api: 'education_type_id', section: 'education', displayName: 'Education Type', description: 'education.education_type_id.', kind: 'int', load: 'educations' },
];

export const admissionBank: ApiField[] = [
	{ name: 'account', api: 'account', section: 'bankAccount', displayName: 'Account', description: 'bankAccount.account.', kind: 'string' },
	{ name: 'agency', api: 'agency', section: 'bankAccount', displayName: 'Agency', description: 'bankAccount.agency.', kind: 'string' },
	{ name: 'digit', api: 'digit', section: 'bankAccount', displayName: 'Digit', description: 'bankAccount.digit.', kind: 'string' },
	{ name: 'accountantTypeId', api: 'accountant_type_id', section: 'bankAccount', displayName: 'Account Type', description: 'bankAccount.accountant_type_id, the name used on admission.', kind: 'int', load: 'bank-accounts' },
	{ name: 'bankId', api: 'bank_id', section: 'bankAccount', displayName: 'Bank', description: 'bankAccount.bank_id.', kind: 'int', load: 'banks' },
];

export const employeeUpdateFields: ApiField[] = [
	{ name: 'name', api: 'name', section: 'employee', displayName: 'Name', description: 'employee.name.', kind: 'string' },
	{ name: 'lastName', api: 'last_name', section: 'employee', displayName: 'Last Name', description: 'employee.last_name.', kind: 'string' },
	{ name: 'supervisorId', api: 'supervisor_id', section: 'professional_information', displayName: 'Supervisor', description: 'Supervisor UUID. The documentation warns about hierarchy overlap.', kind: 'string' },
	{ name: 'registration', api: 'registration', section: 'professional_information', displayName: 'Registration', description: 'professional_information.registration.', kind: 'string' },
	{ name: 'hiringDate', api: 'hiring_date', section: 'professional_information', displayName: 'Hiring Date', description: 'professional_information.hiring_date.', kind: 'date' },
	{ name: 'admissionExamDate', api: 'admission_exam_date', section: 'professional_information', displayName: 'Admission Exam Date', description: 'professional_information.admission_exam_date.', kind: 'date' },
	{ name: 'firstJob', api: 'first_job', section: 'professional_information', displayName: 'First Job', description: 'Whether this is the employee first job.', kind: 'boolean' },
	{ name: 'positionOfTrust', api: 'position_of_trust', section: 'professional_information', displayName: 'Position of Trust', description: 'Whether this is a position of trust.', kind: 'boolean' },
	{ name: 'hasUnemploymentAssistance', api: 'has_unemployment_assistance', section: 'professional_information', displayName: 'Unemployment Assistance', description: 'Whether the employee has unemployment assistance.', kind: 'boolean' },
	{ name: 'cipa', api: 'cipa', section: 'professional_information', displayName: 'CIPA', description: 'Whether the employee is on CIPA.', kind: 'boolean' },
	{ name: 'retired', api: 'retired', section: 'professional_information', displayName: 'Retired', description: 'Whether the employee is retired.', kind: 'boolean' },
	{ name: 'corporateEmail', api: 'corporate_email', section: 'professional_information', displayName: 'Corporate Email', description: 'professional_information.corporate_email.', kind: 'email' },
	{ name: 'classOrganInscription', api: 'class_organ_inscription', section: 'professional_information', displayName: 'Class Organ Inscription', description: 'professional_information.class_organ_inscription.', kind: 'string' },
	{ name: 'professionalCouncil', api: 'professional_council', section: 'professional_information', displayName: 'Professional Council', description: 'professional_information.professional_council.', kind: 'string' },
	{ name: 'stabilityId', api: 'stability_id', section: 'professional_information', displayName: 'Stability Type', description: 'professional_information.stability_id.', kind: 'int', load: 'stability-types' },
	{ name: 'admissionTypeId', api: 'admission_type_id', section: 'professional_information', displayName: 'Admission Type', description: 'professional_information.admission_type_id.', kind: 'int', load: 'admission-types' },
	{ name: 'paymentMethodId', api: 'payment_method_id', section: 'professional_information', displayName: 'Payment Method', description: 'professional_information.payment_method_id.', kind: 'int', load: 'payment-methods' },
	{ name: 'salaryTypeId', api: 'salary_type_id', section: 'professional_information', displayName: 'Salary Type', description: 'professional_information.salary_type_id.', kind: 'int', load: 'salary-types' },
	{ name: 'birthDate', api: 'birth_date', section: 'personal_information', displayName: 'Birth Date', description: 'personal_information.birth_date.', kind: 'date' },
	{ name: 'genderId', api: 'gender_id', section: 'personal_information', displayName: 'Document Gender', description: 'personal_information.gender_id.', kind: 'int', load: 'genders' },
	{ name: 'maritalStatusId', api: 'marital_status_id', section: 'personal_information', displayName: 'Marital Status', description: 'personal_information.marital_status_id.', kind: 'int', load: 'marital-status' },
	{ name: 'fatherName', api: 'father_name', section: 'personal_information', displayName: 'Father Name', description: 'personal_information.father_name.', kind: 'string' },
	{ name: 'motherName', api: 'mother_name', section: 'personal_information', displayName: 'Mother Name', description: 'personal_information.mother_name.', kind: 'string' },
	{ name: 'socialName', api: 'social_name', section: 'personal_information', displayName: 'Social Name', description: 'personal_information.social_name.', kind: 'string' },
	{ name: 'birthStateId', api: 'birth_state_id', section: 'personal_information', displayName: 'Birth State', description: 'Required by the API when the birth city is sent.', kind: 'int', load: 'states' },
	{ name: 'birthCityId', api: 'birth_city_id', section: 'personal_information', displayName: 'Birth City ID', description: 'personal_information.birth_city_id.', kind: 'int' },
	{ name: 'ethnicityId', api: 'ethnicity_id', section: 'personal_information', displayName: 'Ethnicity', description: 'personal_information.ethnicity_id.', kind: 'int', load: 'ethnicities' },
	{ name: 'genderIdentityId', api: 'gender_identity_id', section: 'personal_information', displayName: 'Gender Identity', description: 'personal_information.gender_identity_id.', kind: 'int', load: 'gender-identities' },
	{ name: 'disabilityId', api: 'disability_id', section: 'disability', displayName: 'Disability Type', description: 'disability.disability_id.', kind: 'int', load: 'disabilities' },
	{ name: 'disabilityObservations', api: 'observations', section: 'disability', displayName: 'Disability Notes', description: 'disability.observations.', kind: 'string' },
	{ name: 'personalEmail', api: 'personal_email', section: 'contact_information', displayName: 'Personal Email', description: 'contact_information.personal_email.', kind: 'email' },
	{ name: 'residentialPhone', api: 'residential_phone', section: 'contact_information', displayName: 'Residential Phone', description: 'contact_information.residential_phone.', kind: 'string' },
	{ name: 'cellphone', api: 'cellphone', section: 'contact_information', displayName: 'Cellphone', description: 'contact_information.cellphone.', kind: 'string' },
	{ name: 'zipCode', api: 'zip_code', section: 'address', displayName: 'CEP', description: 'Eight digits, without a hyphen.', kind: 'zip' },
	{ name: 'addressLine', api: 'address', section: 'address', displayName: 'Street', description: 'address.address.', kind: 'string' },
	{ name: 'complement', api: 'complement', section: 'address', displayName: 'Complement', description: 'address.complement.', kind: 'string' },
	{ name: 'addressNumber', api: 'number', section: 'address', displayName: 'Number', description: 'address.number.', kind: 'string' },
	{ name: 'district', api: 'district', section: 'address', displayName: 'District', description: 'address.district.', kind: 'string' },
	{ name: 'cityId', api: 'city_id', section: 'address', displayName: 'City ID', description: 'The documentation requires state_id together with the city.', kind: 'int' },
	{ name: 'stateId', api: 'state_id', section: 'address', displayName: 'State', description: 'address.state_id.', kind: 'int', load: 'states' },
	{ name: 'cpf', api: 'cpf', section: 'cpf', displayName: 'CPF', description: 'cpf.cpf.', kind: 'string' },
	{ name: 'ctpsNumber', api: 'number', section: 'ctps', displayName: 'CTPS Number', description: 'ctps.number.', kind: 'string' },
	{ name: 'ctpsSerialNumber', api: 'serial_number', section: 'ctps', displayName: 'CTPS Series', description: 'ctps.serial_number.', kind: 'string' },
	{ name: 'ctpsEmissionDate', api: 'emission_date', section: 'ctps', displayName: 'CTPS Emission Date', description: 'ctps.emission_date.', kind: 'date' },
	{ name: 'ctpsIssuingStateId', api: 'issuing_state_id', section: 'ctps', displayName: 'CTPS Issuing State', description: 'ctps.issuing_state_id.', kind: 'int', load: 'states' },
	{ name: 'ctpsPis', api: 'pis', section: 'ctps', displayName: 'PIS', description: 'ctps.pis.', kind: 'string' },
	{ name: 'driverLicenseNumber', api: 'number', section: 'driver_license', displayName: 'Driver License Number', description: 'driver_license.number.', kind: 'string' },
	{ name: 'driverLicenseEmissionDate', api: 'emission_date', section: 'driver_license', displayName: 'Driver License Emission Date', description: 'driver_license.emission_date.', kind: 'date' },
	{ name: 'driverLicenseValidateDate', api: 'validate_date', section: 'driver_license', displayName: 'Driver License Expiration', description: 'driver_license.validate_date.', kind: 'date' },
	{ name: 'driverLicenseCategory', api: 'category', section: 'driver_license', displayName: 'Driver License Category', description: 'driver_license.category.', kind: 'string', placeholder: 'AB' },
	{ name: 'electoralNumber', api: 'number', section: 'electoral_card', displayName: 'Electoral Card', description: 'electoral_card.number.', kind: 'string' },
	{ name: 'electoralSection', api: 'section', section: 'electoral_card', displayName: 'Electoral Section', description: 'electoral_card.section.', kind: 'string' },
	{ name: 'electoralWard', api: 'electoral_ward', section: 'electoral_card', displayName: 'Electoral Ward', description: 'electoral_card.electoral_ward.', kind: 'string' },
	{ name: 'electoralStateId', api: 'state_id', section: 'electoral_card', displayName: 'Electoral State', description: 'Required by the API when the electoral city is sent.', kind: 'int', load: 'states' },
	{ name: 'electoralCityId', api: 'city_id', section: 'electoral_card', displayName: 'Electoral City ID', description: 'electoral_card.city_id.', kind: 'int' },
	{ name: 'reservist', api: 'reservist', section: 'reservist', displayName: 'Reservist', description: 'reservist.reservist.', kind: 'string' },
	{ name: 'reservistRaNumber', api: 'ra_number', section: 'reservist', displayName: 'Reservist RA Number', description: 'reservist.ra_number.', kind: 'string' },
	{ name: 'reservistSeries', api: 'series', section: 'reservist', displayName: 'Reservist Series', description: 'reservist.series.', kind: 'string' },
	{ name: 'generalRegisterNumber', api: 'number', section: 'general_register', displayName: 'RG Number', description: 'general_register.number.', kind: 'string' },
	{ name: 'generalRegisterEmissionDate', api: 'emission_date', section: 'general_register', displayName: 'RG Emission Date', description: 'general_register.emission_date.', kind: 'date' },
	{ name: 'generalRegisterIssuingAgency', api: 'issuing_agency', section: 'general_register', displayName: 'RG Issuing Agency', description: 'general_register.issuing_agency.', kind: 'string' },
	{ name: 'generalRegisterIssuingStateId', api: 'issuing_state_id', section: 'general_register', displayName: 'RG Issuing State', description: 'general_register.issuing_state_id.', kind: 'int', load: 'states' },
	{ name: 'livesInBrazil', api: 'lives_in_brazil', section: 'foreign', displayName: 'Lives in Brazil', description: 'Whether the person lives in Brazil. Required by the API when any other foreigner field is sent.', kind: 'boolean' },
	{ name: 'visaId', api: 'visa_id', section: 'foreign', displayName: 'Visa', description: 'foreign.visa_id.', kind: 'int', load: 'visa' },
	{ name: 'arrivalDate', api: 'arrival_date', section: 'foreign', displayName: 'Arrival Date', description: 'foreign.arrival_date.', kind: 'date' },
	{ name: 'naturalizationDate', api: 'naturalization_date', section: 'foreign', displayName: 'Naturalization Date', description: 'foreign.naturalization_date.', kind: 'date' },
	{ name: 'countryId', api: 'country_id', section: 'foreign', displayName: 'Country', description: 'foreign.country_id.', kind: 'int', load: 'countries' },
	{ name: 'marriedToBrazilian', api: 'married_to_brazilian', section: 'foreign', displayName: 'Married to Brazilian', description: 'Whether the person is married to a Brazilian.', kind: 'boolean' },
	{ name: 'hasBrazilianOffspring', api: 'has_brazilian_offspring', section: 'foreign', displayName: 'Brazilian Offspring', description: 'Whether the person has a Brazilian child.', kind: 'boolean' },
	{ name: 'residenceTimeId', api: 'residence_time_id', section: 'foreign', displayName: 'Residence Time', description: 'foreign.residence_time_id.', kind: 'int', load: 'residence-time' },
	{ name: 'entryConditionId', api: 'entry_condition_id', section: 'foreign', displayName: 'Entry Condition', description: 'foreign.entry_condition_id.', kind: 'int', load: 'entry-conditions' },
	{ name: 'addressDescriptionId', api: 'address_description_id', section: 'foreign', displayName: 'Address Description', description: 'foreign.address_description_id.', kind: 'int', load: 'address-description' },
	{ name: 'zipCodeForeign', api: 'zip_code_foreign', section: 'foreign', displayName: 'Foreign ZIP Code', description: 'The documentation allows at most 8 characters, without a hyphen.', kind: 'zip' },
	{ name: 'foreignAddress', api: 'foreign_address', section: 'foreign', displayName: 'Foreign Address', description: 'foreign.foreign_address.', kind: 'string' },
	{ name: 'foreignNumber', api: 'number', section: 'foreign', displayName: 'Foreign Number', description: 'foreign.number.', kind: 'string' },
	{ name: 'foreignComplement', api: 'complement', section: 'foreign', displayName: 'Foreign Complement', description: 'foreign.complement.', kind: 'string' },
	{ name: 'foreignDistrict', api: 'district', section: 'foreign', displayName: 'Foreign District', description: 'foreign.district.', kind: 'string' },
	{ name: 'foreignCity', api: 'city', section: 'foreign', displayName: 'Foreign City', description: 'foreign.city.', kind: 'string' },
];

export const dependentUpdateFields: ApiField[] = [
	{ name: 'name', api: 'name', displayName: 'Name', description: 'Dependent first name.', kind: 'string' },
	{ name: 'lastName', api: 'last_name', displayName: 'Last Name', description: 'Dependent last name.', kind: 'string' },
	{ name: 'email', api: 'email', displayName: 'Email', description: 'Dependent email.', kind: 'email' },
	{ name: 'birthDate', api: 'birth_date', displayName: 'Birth Date', description: 'Date in YYYY-MM-DD.', kind: 'date' },
	{ name: 'cpf', api: 'cpf', displayName: 'CPF', description: 'Dependent CPF. It is not printed in errors.', kind: 'string' },
	{ name: 'motherName', api: 'mother_name', displayName: 'Mother Name', description: 'Mother name.', kind: 'string' },
	{ name: 'ir', api: 'ir', displayName: 'Income Tax', description: 'Whether the dependent is flagged for income tax.', kind: 'boolean' },
	{ name: 'familySalary', api: 'family_salary', displayName: 'Family Salary', description: 'Whether the dependent is flagged for family salary.', kind: 'boolean' },
	{ name: 'hasDisability', api: 'has_disability', displayName: 'Has Disability', description: 'Whether the dependent has a disability.', kind: 'boolean' },
	{ name: 'foreigner', api: 'foreigner', displayName: 'Foreigner', description: 'Whether the dependent is a foreigner.', kind: 'boolean' },
	{ name: 'description', api: 'description', displayName: 'Notes', description: 'Notes.', kind: 'string' },
	{ name: 'phone', api: 'phone', displayName: 'Phone', description: 'Phone or cellphone.', kind: 'string' },
	{ name: 'genderId', api: 'gender_id', displayName: 'Document Gender', description: 'gender_id.', kind: 'int', load: 'genders' },
	{ name: 'educationTypeId', api: 'education_type_id', displayName: 'Education Type', description: 'education_type_id.', kind: 'int', load: 'educations' },
];

export const emergencyUpdateFields: ApiField[] = [
	{ name: 'name', api: 'name', displayName: 'Name', description: 'Full name of the contact.', kind: 'string' },
	{ name: 'emergencyContactRelationId', api: 'emergency_contact_relation_id', displayName: 'Relation', description: 'Relation type ID.', kind: 'int', load: 'relation-emergency-contacts' },
	{ name: 'email', api: 'email', displayName: 'Email', description: 'Email address.', kind: 'email' },
	{ name: 'phone', api: 'phone', displayName: 'Phone', description: 'Phone number.', kind: 'string' },
	{ name: 'cellphone', api: 'cellphone', displayName: 'Cellphone', description: 'Cellphone number.', kind: 'string' },
	{ name: 'workPhone', api: 'work_phone', displayName: 'Work Phone', description: 'Work phone number.', kind: 'string' },
];

export const bankUpdateFields: ApiField[] = [
	{ name: 'account', api: 'account', displayName: 'Account', description: 'Account number.', kind: 'string' },
	{ name: 'agency', api: 'agency', displayName: 'Agency', description: 'Branch number.', kind: 'string' },
	{ name: 'digit', api: 'digit', displayName: 'Digit', description: 'Account digit.', kind: 'string' },
	{ name: 'accountTypeId', api: 'account_type_id', displayName: 'Account Type', description: 'account_type_id on the bank account update.', kind: 'int', load: 'bank-accounts' },
	{ name: 'bankId', api: 'bank_id', displayName: 'Bank', description: 'bank_id.', kind: 'int', load: 'banks' },
	{ name: 'pix', api: 'pix', displayName: 'PIX', description: 'PIX key. It is not printed in errors.', kind: 'string' },
	{ name: 'modality', api: 'modality', displayName: 'Modality', description: 'The documentation accepts PF or PJ.', kind: 'string', placeholder: 'PF or PJ' },
];

export const educationFields: ApiField[] = [
	{ name: 'educationTypeId', api: 'education_type_id', displayName: 'Education Type', description: 'On create, the documentation requires the key even when the value is null.', kind: 'int', load: 'educations' },
	{ name: 'course', api: 'course', displayName: 'Course', description: 'Course. On create, an empty value is sent as null.', kind: 'string' },
	{ name: 'institution', api: 'institution', displayName: 'Institution', description: 'Institution. On create, an empty value is sent as null.', kind: 'string' },
	{ name: 'graduationYear', api: 'graduation_year', displayName: 'Graduation Year', description: 'Year. On create, an empty value is sent as null.', kind: 'int', placeholder: '2021' },
];

export const stabilityFields: ApiField[] = [
	{ name: 'stabilityTypeId', api: 'stability_type_id', displayName: 'Stability Type', description: 'stability_type_id. Required on create.', kind: 'int', load: 'stability-types' },
	{ name: 'dateFrom', api: 'date_from', displayName: 'Start Date', description: 'date_from in YYYY-MM-DD.', kind: 'date' },
	{ name: 'dateTo', api: 'date_to', displayName: 'End Date', description: 'date_to must be on or after date_from.', kind: 'date' },
	{ name: 'observation', api: 'observation', displayName: 'Observation', description: 'At most 220 characters, as documented.', kind: 'string' },
];

export const salaryRequired: ApiField[] = [
	{ name: 'salary', api: 'salary', displayName: 'Salary', description: 'Salary with up to two decimal places. The documented format example is 1000.00.', kind: 'decimal', required: true },
	{ name: 'relationshipId', api: 'relationship_id', displayName: 'Relationship', description: 'relationship_id.', kind: 'int', load: 'relationships', required: true },
	{ name: 'motiveId', api: 'motive_id', displayName: 'Motive', description: 'motive_id. The documentation does not publish a list endpoint for this motive.', kind: 'int', required: true, placeholder: '1' },
	{ name: 'dateFrom', api: 'date_from', displayName: 'Start Date', description: 'date_from. Dates must not overlap existing records. The API checks that.', kind: 'date', required: true },
];

export const salaryOptional: ApiField[] = [
	{ name: 'workerCategoryId', api: 'worker_category_id', displayName: 'Worker Category', description: 'worker_category_id.', kind: 'int', load: 'worker-categories' },
];

export const absenceFields: ApiField[] = [
	{ name: 'justification', api: 'justification', displayName: 'Justification', description: 'justification.', kind: 'string' },
	{ name: 'absenceMotiveId', api: 'absence_motive_id', displayName: 'Motive', description: 'absence_motive_id. There is no separate types URL. The types section repeats /absences/motives.', kind: 'int' },
	{ name: 'absenceTypeId', api: 'absence_type_id', displayName: 'Type', description: 'absence_type_id. Enter a known ID. A distinct types URL is not documented.', kind: 'int' },
	{ name: 'CID', api: 'CID', displayName: 'CID', description: 'The official table describes this field as a registration number and the example shows the text cid. The node sends the key cid without reinterpreting it.', kind: 'string' },
];

export const dismissalOptional: ApiField[] = [
	{ name: 'motive', api: 'motive', displayName: 'Motive', description: 'Dismissal motive.', kind: 'string' },
	{ name: 'comments', api: 'comments', displayName: 'Comments', description: 'Comments.', kind: 'string' },
	{ name: 'removeBenefit', api: 'remove_benefit', displayName: 'Remove Benefits', description: 'remove_benefit.', kind: 'tri' },
	{ name: 'breakingContract', api: 'breaking_contract', displayName: 'Breaking Contract', description: 'breaking_contract.', kind: 'tri' },
	{ name: 'terminationNoticeDate', api: 'termination_notice_date', displayName: 'Termination Notice Date', description: 'termination_notice_date in YYYY-MM-DD.', kind: 'date' },
];
