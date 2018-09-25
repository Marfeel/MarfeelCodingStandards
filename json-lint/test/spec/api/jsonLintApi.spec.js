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
const jsonLint = require('../../../../jsonLint/api');

describe('API json schemas:', () => {
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
		expect(jsonLint.getSchemaNames()).toEqual(
			['inventory']
		);
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

	describe(': validate :', () => {

		it('Valid JSON', () => {
			const obj = jsonLint.loadJson(exampleJsonPath);
			const validation = jsonLint.validate(obj, 'example');

			expect(validation.schema.$id).toEqual('#example');
			expect(validation.errors.length).toEqual(0);
		});

		it('Wrong JSON', () => {
			const obj = jsonLint.loadJson(invalidExampleJsonPath);
			const validation = jsonLint.validate(obj, 'example');

			expect(validation.schema.$id).toEqual('#example');
			expect(validation.errors.length).toEqual(2);
			expect(validation.errors[0].name).toEqual('additionalProperties');
			expect(validation.errors[1].name).toEqual('required');
		});
	});

});
