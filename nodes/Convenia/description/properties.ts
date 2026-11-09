import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

import { CATALOGS } from '../api/catalogs';

export interface Choice {
	name: string;
	value: string;
	description?: string;
	action?: string;
}

export interface ScalarField {
	name: string;
	displayName: string;
	description: string;
	kind: 'string' | 'date' | 'int' | 'decimal' | 'boolean' | 'tri' | 'zip' | 'email';
	load?: string;
	placeholder?: string;
	required?: boolean;
}

export type ParameterSpec =
	| { kind: 'notice'; text: string }
	| { kind: 'returnAll' }
	| { kind: 'followPages' }
	| { kind: 'filters'; description: string }
	| { kind: 'options' }
	| { kind: 'binary' }
	| { kind: 'catalog' }
	| { kind: 'cityFilter' }
	| {
			kind: 'locator';
			name: string;
			displayName: string;
			description: string;
			search: string;
			required?: boolean;
	  }
	| { kind: 'choice'; name: string; displayName: string; description: string; options: Choice[]; defaultValue?: string; required?: boolean }
	| { kind: 'string'; name: string; displayName: string; description: string; required?: boolean; placeholder?: string }
	| { kind: 'scalar'; field: ScalarField }
	| { kind: 'collection'; name: string; displayName: string; placeholder: string; fields: ScalarField[] }
	| { kind: 'customFields' }
	| { kind: 'benefitEmployees' }
	| { kind: 'benefitDependents' }
	| { kind: 'activeRecord' }
	| { kind: 'dateToMode' };

export interface OperationSpec {
	resource: string;
	operation: string;
	name: string;
	description: string;
	action: string;
	parameters: ParameterSpec[];
}

export interface ResourceSpec {
	value: string;
	name: string;
	description: string;
}

const LOAD_METHOD: Record<string, string> = {
	ethnicities: 'loadEthnicities',
	nationalities: 'loadNationalities',
	relationships: 'loadRelationships',
	'marital-status': 'loadMaritalStatus',
	educations: 'loadEducations',
	'bank-accounts': 'loadBankAccountTypes',
	banks: 'loadBanks',
	states: 'loadStates',
	'dismissal-types': 'loadDismissalTypes',
	'termination-types': 'loadTerminationTypes',
	'gender-identities': 'loadGenderIdentities',
	'relation-emergency-contacts': 'loadEmergencyRelations',
	'admission-types': 'loadAdmissionTypes',
	disabilities: 'loadDisabilities',
	'payment-methods': 'loadPaymentMethods',
	'salary-types': 'loadSalaryTypes',
	'stability-types': 'loadStabilityTypes',
	'dependent-relations': 'loadDependentRelations',
	genders: 'loadGenders',
	visa: 'loadVisa',
	'entry-conditions': 'loadEntryConditions',
	'residence-time': 'loadResidenceTime',
	'address-description': 'loadAddressDescriptions',
	countries: 'loadCountries',
	'worker-categories': 'loadWorkerCategories',
};

function show(resource: string, operation: string | string[]): INodeProperties['displayOptions'] {
	return {
		show: {
			resource: [resource],
			operation: Array.isArray(operation) ? operation : [operation],
		},
	};
}

function scalarProperty(field: ScalarField): INodeProperties {
	const loadMethod = field.load ? LOAD_METHOD[field.load] : undefined;
	if (field.kind === 'tri') {
		return {
			displayName: field.displayName,
			name: field.name,
			type: 'options',
			default: 'omit',
			description: field.description,
			options: [
				{ name: 'Do Not Send', value: 'omit' },
				{ name: 'No', value: 'false' },
				{ name: 'Yes', value: 'true' },
			],
		};
	}
	if (field.kind === 'boolean') {
		return {
			displayName: field.displayName,
			name: field.name,
			type: 'boolean',
			default: false,
			description: field.description.startsWith('Whether') ? field.description : `Whether ${field.description}`,
		};
	}
	if (loadMethod) {
		return {
			displayName: field.displayName.endsWith('Name or ID') ? field.displayName : `${field.displayName} Name or ID`,
			name: field.name,
			type: 'options',
			default: '',
			required: field.required === true,
			description: `${field.description} Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>`,
			typeOptions: { loadOptionsMethod: loadMethod },
		};
	}
	const type = field.kind === 'int' || field.kind === 'decimal' ? 'string' : 'string';
	return {
		displayName: field.displayName,
		name: field.name,
		type,
		default: '',
		required: field.required === true,
		placeholder: field.kind === 'email' ? 'name@email.com' : field.placeholder,
		description: field.description,
	};
}

function maxPagesProperty(resource: string, operation: string): INodeProperties {
	return {
		displayName: 'Max Pages',
		name: 'maxPages',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 100,
		description:
			'Fails the node when another page still exists after this many requests. A partial list is not returned. The per-process rate limit still applies and is not a distributed lock.',
		displayOptions: { show: { resource: [resource], operation: [operation], returnAll: [true] } },
	};
}

function parameterProperties(resource: string, operation: string, parameter: ParameterSpec): INodeProperties[] {
	const displayOptions = show(resource, operation);
	switch (parameter.kind) {
		case 'notice':
			return [
				{
					displayName: parameter.text,
					name: `notice_${resource}_${operation}`,
					type: 'notice',
					default: '',
					displayOptions,
				},
			];
		case 'followPages':
			return [
				{
					displayName: 'Return All',
					name: 'returnAll',
					type: 'boolean',
					default: false,
					description: 'Whether to return all results or only up to a given limit',
					displayOptions,
				},
				maxPagesProperty(resource, operation),
			];
		case 'returnAll':
			return [
				{
					displayName: 'Return All',
					name: 'returnAll',
					type: 'boolean',
					default: false,
					description: 'Whether to return all results or only up to a given limit',
					displayOptions,
				},
				maxPagesProperty(resource, operation),
				{
					displayName: 'Paginate',
					name: 'paginate',
					type: 'number',
					typeOptions: { minValue: 1, maxValue: 1000 },
					default: 50,
					description: 'Page size sent as the documented paginate query parameter. The maximum per page is 1000.',
					displayOptions: { show: { resource: [resource], operation: [operation], returnAll: [false] } },
				},
				{
					displayName: 'Page',
					name: 'page',
					type: 'number',
					typeOptions: { minValue: 1 },
					default: 1,
					description: 'Documented page query parameter. Used together with paginate.',
					displayOptions: { show: { resource: [resource], operation: [operation], returnAll: [false] } },
				},
			];
		case 'filters':
			return [
				{
					displayName: 'Filters',
					name: 'filters',
					type: 'fixedCollection',
					placeholder: 'Add Filter',
					default: {},
					typeOptions: { multipleValues: true },
					description: parameter.description,
					displayOptions,
					options: [
						{
							displayName: 'Condition',
							name: 'condition',
							values: [
								{
									displayName: 'Operator',
									name: 'operator',
									type: 'options',
									default: 'match',
									options: [
										{ name: 'Contains', value: 'like' },
										{ name: 'Does Not Equal', value: 'different' },
										{ name: 'Equals', value: 'match' },
									],
								},
								{
									displayName: 'Field',
									name: 'field',
									type: 'string',
									default: '',
									placeholder: 'hiring_date',
									description:
										'Documented field name. Nested fields use a dot, so permissions.name becomes match[permissions][name].',
								},
								{
									displayName: 'Value',
									name: 'value',
									type: 'string',
									default: '',
									description: 'Several values for the same field can be separated by commas, as in the official example',
								},
								{
									displayName: 'Compare With Null',
									name: 'nullValue',
									type: 'boolean',
									default: false,
									description: 'Whether to send %00, the documented value used to match null',
								},
							],
						},
					],
				},
			];
		case 'options':
			return [
				{
					displayName: 'Options',
					name: 'options',
					type: 'collection',
					placeholder: 'Add Option',
					default: {},
					displayOptions,
					options: [
						{
							displayName: 'Include Envelope',
							name: 'includeEnvelope',
							type: 'boolean',
							default: false,
							description:
								'Whether to return the full JSON response, including message and page metadata. By default the node returns data, one item per record when it is a list.',
						},
					],
				},
			];
		case 'binary':
			return [
				{
					displayName: 'Binary Property',
					name: 'binaryProperty',
					type: 'string',
					default: 'data',
					required: true,
					description: 'Name of the input binary field for an upload, or the output binary field for a download',
					displayOptions,
				},
				{
					displayName: 'File Name',
					name: 'fileName',
					type: 'string',
					default: '',
					placeholder: 'attachment.pdf',
					description:
						'Optional. On upload, this replaces the binary file name. On download, this replaces the name suggested by Content-Disposition.',
					displayOptions,
				},
			];
		case 'catalog':
			return [
				{
					displayName: 'Catalog',
					name: 'catalog',
					type: 'options',
					default: 'states',
					required: true,
					description: 'Official system list. Each option is one documented endpoint.',
					displayOptions,
					options: CATALOGS.map((catalog) => ({ name: catalog.name, value: catalog.value })),
				},
			];
		case 'cityFilter':
			return [
				{
					displayName: 'Filter Cities By',
					name: 'cityFilter',
					type: 'options',
					default: 'none',
					description:
						'The documentation accepts only one of these parameters, in this order: state_id, state_abbreviation, then state_name',
					displayOptions: { show: { resource: [resource], operation: [operation], catalog: ['cities'] } },
					options: [
						{ name: 'None', value: 'none' },
						{ name: 'State Abbreviation', value: 'state_abbreviation' },
						{ name: 'State ID', value: 'state_id' },
						{ name: 'State Name', value: 'state_name' },
					],
				},
				{
					displayName: 'State Name or ID',
					name: 'stateId',
					type: 'options',
					default: '',
					typeOptions: { loadOptionsMethod: 'loadStates' },
					description:
						'Query parameter state_id. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					displayOptions: {
						show: { resource: [resource], operation: [operation], catalog: ['cities'], cityFilter: ['state_id'] },
					},
				},
				{
					displayName: 'State Abbreviation',
					name: 'stateAbbreviation',
					type: 'string',
					default: '',
					placeholder: 'SP',
					description: 'Query parameter state_abbreviation',
					displayOptions: {
						show: {
							resource: [resource],
							operation: [operation],
							catalog: ['cities'],
							cityFilter: ['state_abbreviation'],
						},
					},
				},
				{
					displayName: 'State Name',
					name: 'stateName',
					type: 'string',
					default: '',
					placeholder: 'Sao Paulo',
					description: 'Query parameter state_name',
					displayOptions: {
						show: { resource: [resource], operation: [operation], catalog: ['cities'], cityFilter: ['state_name'] },
					},
				},
			];
		case 'locator':
			return [
				{
					displayName: parameter.displayName,
					name: parameter.name,
					type: 'resourceLocator',
					default: { mode: 'list', value: '' },
					required: parameter.required !== false,
					description: parameter.description,
					displayOptions,
					modes: [
						{
							displayName: 'From List',
							name: 'list',
							type: 'list',
							typeOptions: { searchListMethod: parameter.search, searchable: true },
						},
						{
							displayName: 'ID',
							name: 'id',
							type: 'string',
							placeholder: 'ID or expression',
							validation: [{ type: 'regex', properties: { regex: '.+', errorMessage: 'Enter an ID' } }],
						},
					],
				},
			];
		case 'choice': {
			const choice: INodeProperties = {
				displayName: parameter.displayName,
				name: parameter.name,
				type: 'options',
				default: '',
				required: parameter.required === true,
				description: parameter.description,
				displayOptions,
				options: parameter.options,
			};
			choice.default = parameter.defaultValue ?? parameter.options[0]?.value ?? '';
			return [choice];
		}
		case 'string':
			return [
				{
					displayName: parameter.displayName,
					name: parameter.name,
					type: 'string',
					default: '',
					required: parameter.required === true,
					placeholder: parameter.placeholder,
					description: parameter.description,
					displayOptions,
				},
			];
		case 'scalar':
			return [{ ...scalarProperty(parameter.field), displayOptions }];
		case 'collection':
			return [
				{
					displayName: parameter.displayName,
					name: parameter.name,
					type: 'collection',
					placeholder: parameter.placeholder,
					default: {},
					description: 'Only fields you add are sent. An empty field is omitted and is not sent as null.',
					displayOptions,
					options: parameter.fields.map((field) => scalarProperty(field)),
				},
			];
		case 'customFields':
			return [
				{
					displayName: 'Custom Fields',
					name: 'customFields',
					type: 'fixedCollection',
					placeholder: 'Add Field',
					default: {},
					typeOptions: { multipleValues: true },
					description:
						'Text, a date (DD/MM/YYYY), yes or no, and a single list item go in Value. Multiple choice uses the option list and is sent as an array.',
					displayOptions,
					options: [
						{
							displayName: 'Field',
							name: 'field',
							values: [
								{
									displayName: 'Custom Field Name or ID',
									name: 'customFieldId',
									type: 'resourceLocator',
									default: { mode: 'list', value: '' },
									required: true,
									description:
										'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
									modes: [
										{
											displayName: 'From List',
											name: 'list',
											type: 'list',
											typeOptions: { searchListMethod: 'searchCustomFields', searchable: true },
										},
										{ displayName: 'ID', name: 'id', type: 'string', placeholder: 'ID or expression' },
									],
								},
								{
									displayName: 'Value Mode',
									name: 'valueMode',
									type: 'options',
									default: 'text',
									options: [
										{ name: 'Multiple Choice', value: 'multiple' },
										{ name: 'Text', value: 'text' },
									],
								},
								{
									displayName: 'Value',
									name: 'textValue',
									type: 'string',
									default: '',
									description: 'Text, date, yes or no, or one list item, using the format stored on the field',
									displayOptions: { show: { valueMode: ['text'] } },
								},
								{
									displayName: 'Options',
									name: 'multipleValues',
									type: 'fixedCollection',
									placeholder: 'Add Option',
									typeOptions: { multipleValues: true },
									default: {},
									displayOptions: { show: { valueMode: ['multiple'] } },
									options: [
										{
											displayName: 'Option',
											name: 'option',
											values: [
												{
													displayName: 'Option Text',
													name: 'value',
													type: 'string',
													default: '',
													description: 'Text exactly as stored in the field list',
												},
											],
										},
									],
								},
							],
						},
					],
				},
			];
		case 'benefitEmployees':
			return [{ ...benefitRows('employees', 'Employees', 'employee', false), displayOptions }];
		case 'benefitDependents':
			return [{ ...benefitRows('dependents', 'Dependents', 'dependent', true), displayOptions }];
		case 'activeRecord':
			return [
				{
					displayName: 'Active Record',
					name: 'activeRecord',
					type: 'boolean',
					default: true,
					description:
						'Whether to send date_to as null. The documentation says a null date_to marks the active salary record.',
					displayOptions,
				},
				{
					displayName: 'End Date',
					name: 'dateTo',
					type: 'string',
					default: '',
					placeholder: 'YYYY-MM-DD',
					description: 'Required date_to when the record is not the active one',
					displayOptions: { show: { resource: [resource], operation: [operation], activeRecord: [false] } },
				},
			];
		case 'dateToMode':
			return [
				{
					displayName: 'End Date Mode',
					name: 'dateToMode',
					type: 'options',
					default: 'omit',
					description:
						'The documentation says the current salary record cannot have date_to edited. Omit does not send the field. Null marks the record as active.',
					displayOptions,
					options: [
						{ name: 'Date', value: 'date' },
						{ name: 'Null (Active Record)', value: 'null' },
						{ name: 'Omit', value: 'omit' },
					],
				},
				{
					displayName: 'End Date',
					name: 'dateTo',
					type: 'string',
					default: '',
					placeholder: 'YYYY-MM-DD',
					description: 'Required date_to in YYYY-MM-DD. Sent only when End Date Mode is Date.',
					displayOptions: { show: { resource: [resource], operation: [operation], dateToMode: ['date'] } },
				},
			];
		default:
			return assertParameter(parameter);
	}
}

function assertParameter(parameter: never): never {
	throw new Error(`Parâmetro de UI desconhecido: ${JSON.stringify(parameter)}`);
}

function benefitRows(
	name: string,
	displayName: string,
	rowName: string,
	dependent: boolean,
): INodeProperties {
	const values: INodeProperties[] = [
		{
			displayName: 'Employee ID',
			name: 'employeeId',
			type: 'string',
			default: '',
			required: true,
			description: 'Employee UUID. An expression is allowed.',
		},
	];
	if (dependent) {
		values.push({
			displayName: 'Dependent ID',
			name: 'dependentId',
			type: 'string',
			default: '',
			required: true,
			description: 'Dependent UUID',
		});
	}
	values.push(
		{
			displayName: 'Is Active',
			name: 'isActive',
			type: 'boolean',
			default: true,
			description: 'Whether the person stays linked. False unlinks them. The documentation marks this field as required.',
		},
		{
			displayName: 'Company Cost Value',
			name: 'companyCostValue',
			type: 'string',
			default: '',
			description: dependent
				? 'Required by the API when the plan price is per employee. An empty value is not sent.'
				: 'Required by the API except for health or dental benefits, and for plans priced per employee. An empty value is not sent.',
		},
	);
	if (dependent) {
		values.push({
			displayName: 'Dependent Cost Value',
			name: 'dependentCostValue',
			type: 'string',
			default: '',
			description: 'The dependent_cost_value field. An empty value is not sent.',
		});
	} else {
		values.push(
			{
				displayName: 'Employee Cost Value',
				name: 'employeeCostValue',
				type: 'string',
				default: '',
				description: 'The employee_cost_value field. An empty value is not sent.',
			},
			{
				displayName: 'Plan ID',
				name: 'planId',
				type: 'string',
				default: '',
				description: 'The plan_id field. The documentation requires the plan when linking health or dental benefits. An empty value is not sent.',
			},
			{
				displayName: 'Coparticipation',
				name: 'coparticipation',
				type: 'options',
				default: 'omit',
				description: 'Whether to send coparticipation. Omit leaves the field out of the request.',
				options: [
					{ name: 'Do Not Send', value: 'omit' },
					{ name: 'No', value: 'false' },
					{ name: 'Yes', value: 'true' },
				],
			},
		);
	}
	values.push({
		displayName: 'Card Number',
		name: 'cardNumber',
		type: 'string',
		default: '',
		description: 'Optional for health or dental benefits. An empty value is not sent.',
	});
	return {
		displayName,
		name,
		type: 'fixedCollection',
		placeholder: 'Add Item',
		default: {},
		typeOptions: { multipleValues: true },
		options: [{ displayName: 'Item', name: rowName, values }],
	};
}

export function buildNodeProperties(resources: ResourceSpec[], operations: OperationSpec[]): INodeProperties[] {
	const resourceOptions: INodePropertyOptions[] = resources.map((resource) => ({
		name: resource.name,
		value: resource.value,
		description: resource.description,
	}));
	const properties: INodeProperties[] = [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: resourceOptions,
			default: 'employee',
		},
	];
	for (const resource of resources) {
		const ops = operations.filter((operation) => operation.resource === resource.value);
		const operationProperty: INodeProperties = {
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			default: '',
			displayOptions: { show: { resource: [resource.value] } },
			options: ops.map((operation) => ({
				name: operation.name,
				value: operation.operation,
				description: operation.description,
				action: operation.action,
			})),
		};
		operationProperty.default = ops[0]?.operation ?? '';
		properties.push(operationProperty);
	}
	for (const operation of operations) {
		for (const parameter of operation.parameters) {
			properties.push(...parameterProperties(operation.resource, operation.operation, parameter));
		}
	}
	return properties;
}

export function parameterNames(operation: OperationSpec): string[] {
	const names: string[] = [];
	for (const parameter of operation.parameters) {
		switch (parameter.kind) {
			case 'notice':
				break;
			case 'returnAll':
				names.push('returnAll', 'maxPages', 'paginate', 'page');
				break;
			case 'followPages':
				names.push('returnAll', 'maxPages');
				break;
			case 'filters':
				names.push('filters');
				break;
			case 'options':
				names.push('options');
				break;
			case 'binary':
				names.push('binaryProperty', 'fileName');
				break;
			case 'catalog':
				names.push('catalog');
				break;
			case 'cityFilter':
				names.push('cityFilter', 'stateId', 'stateAbbreviation', 'stateName');
				break;
			case 'locator':
			case 'choice':
			case 'string':
				names.push(parameter.name);
				break;
			case 'scalar':
				names.push(parameter.field.name);
				break;
			case 'collection':
				names.push(parameter.name);
				break;
			case 'customFields':
				names.push('customFields');
				break;
			case 'benefitEmployees':
				names.push('employees');
				break;
			case 'benefitDependents':
				names.push('dependents');
				break;
			case 'activeRecord':
				names.push('activeRecord', 'dateTo');
				break;
			case 'dateToMode':
				names.push('dateToMode', 'dateTo');
				break;
			default:
				assertParameter(parameter);
		}
	}
	return names;
}

export function locatorNames(operation: OperationSpec): string[] {
	const names: string[] = [];
	for (const parameter of operation.parameters) {
		if (parameter.kind === 'locator') names.push(parameter.name);
	}
	return names;
}
