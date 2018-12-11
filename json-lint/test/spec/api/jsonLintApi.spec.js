/*
 * Copyright (c) 2018 by Marfeel Solutions (http://www.marfeel.com)
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Marfeel Solutions S.L and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Marfeel Solutions S.L and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Marfeel Solutions SL.
 */

const path = require('path');
const jsonLint = require('../../../../json-lint/api');
const SCHEMA_NAME = 'example';

describe('API json schemas:', () => {
	const extenderPath = './test/resources/api/exampleExtends.json';
	const exampleJsonPath = path.resolve(__dirname, '../../resources/api/example.json');
	const invalidExampleJsonPath = path.resolve(__dirname, '../../resources/api/invalidExample.json');
	const notExistentPath = path.resolve(__dirname, '../../resources/api/notExistent.json');
	const malformedPath = path.resolve(__dirname, '../../resources/api/malformed.json');

	it('load json', () => {
		expect(
			jsonLint.loadJson(exampleJsonPath)
		).toEqual(
			{ requiredKey: 'allowed_value' }
		);

		expect(() => jsonLint.loadJson(notExistentPath)).toThrow();
		expect(() => jsonLint.loadJson(malformedPath)).toThrow();
	});



	it('get schema names available', () => {
		const expectedSchemas = ['inventory', 'comments', 'metrics', 'ui'];

		expect(jsonLint.getSchemaNames().every(schema => expectedSchemas.includes(schema))).toBeTruthy();
	});

	it('get schema names and MarfeelPath', ()=> {
		const schemaDefinitions = jsonLint.getSchemaNamesAndPath();
		const isInvalid = x => !(typeof x.MarfeelPath === 'string');

		expect(schemaDefinitions.some(isInvalid)
		).toBe(false,
			`MarfeelPath needs to be defined in schemaName/main.json.
			Schema MarfeelPath is undefined : 
			${JSON.stringify(schemaDefinitions.filter(isInvalid))}`);
	});

	describe(': extended JSON :', () => {
		it('valid extension', () => {
			const mockMrfJson = path.resolve('test/resources/api/mrf-json/valid')
			const validation = jsonLint.validateFromPath(extenderPath, SCHEMA_NAME, mockMrfJson);

			expect(validation.errors.length).toEqual(0);
		});

		it('throwing on extension', () => {
			const mockMrfJson = path.resolve('test/resources/api/mrf-json/throwing')
			const validation = jsonLint.validateFromPath(extenderPath, SCHEMA_NAME, mockMrfJson);

			expect(validation.errors.length).toEqual(1);
			expect(validation.errors[0].message.includes('Error merging extended JSON in schemaUtils')).toBe(true);
		});

		it('validation errors after extension', () => {
			const mockMrfJson = path.resolve('test/resources/api/mrf-json/wrong')
			const validation = jsonLint.validateFromPath(extenderPath, SCHEMA_NAME, mockMrfJson);
			
			expect(validation.errors.length).toEqual(1);
			expect(validation.errors[0].message.includes('additionalProperty "wrong_key" exists in instance when not allowed')).toBe(true);
		});
	});

	describe(': validate :', () => {

		it('Valid JSON', () => {
			const obj = jsonLint.loadJson(exampleJsonPath);
			const validation = jsonLint.validate(obj, SCHEMA_NAME);

			expect(validation.schema.$id).toEqual('#example');
			expect(validation.errors.length).toEqual(0);
		});

		it('Wrong JSON', () => {
			const obj = jsonLint.loadJson(invalidExampleJsonPath);
			const validation = jsonLint.validate(obj, SCHEMA_NAME);

			expect(validation.schema.$id).toEqual('#example');
			expect(validation.errors.length).toEqual(2);
			expect(validation.errors[0].name).toEqual('additionalProperties');
			expect(validation.errors[1].name).toEqual('required');
		});

		it('Malformed JSON in path', () => {
			const validation = jsonLint.validateFromPath(malformedPath, SCHEMA_NAME);

			expect(validation.schema).toEqual(undefined);
			expect(validation.errors.length).toEqual(1);
			expect(validation.errors[0].message.startsWith('JSON parse error:\tUnexpected token / in JSON at position 6')).toBe(true);
		});
	});

});
