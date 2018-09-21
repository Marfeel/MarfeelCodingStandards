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

const fs = require('fs');
const jsonLint = require('../../..');

describe('Valid json schemas:', () => {
	const testFolder = './test/resources/schema';
	const tests = fs.readdirSync(testFolder);

	beforeEach(() => {

	});

	function schemaTest(schemaName) {
		it('required tests', () => {
			fs.readdir(`${testFolder}/${schemaName}`, (err, files)=>{
				['valid', 'wrong'].forEach(test=>{
					const ErrorMessage = `${schemaName} is missing ${test} tests`;

					expect(files.includes(test)).toBe(true, ErrorMessage);
				});
			});
		});

		it('valid JSON file has no validation errors', () => {
			fs.readdir(`${testFolder}/${schemaName}/valid`, (err, files)=>{
				const jsonFiles = files.filter(name => name.endsWith('.json'));

				jsonFiles.forEach(file=>{
					const _path = `${testFolder}/${schemaName}/valid/${file}`;
					const obj = jsonLint.loadJson(_path);

					const objectValidation = jsonLint.validate(obj, schemaName);
					const pathValidation = jsonLint.validateFromPath(_path, schemaName);
					const objErrorMessage = !!objectValidation.errors.length &&
					`Schema ${schemaName} should give no errors on ${file} but: ${objectValidation.errors[0]} `;
					const pathErrorMessage = !!pathValidation.errors.length &&
					`Schema ${schemaName} should give no errors on ${file} but: ${pathValidation.errors[0]} `;

					expect(objectValidation.errors.length).toBe(0, objErrorMessage);
					expect(pathValidation.errors.length).toBe(0, pathErrorMessage);

				});
			});

		});

		it('wrong JSON has validation errors', () => {
			fs.readdir(`${testFolder}/${schemaName}/wrong`, (err, files) => {
				const jsonFiles = files.filter(name => name.endsWith('.json'));

				jsonFiles.forEach(file=>{
					const _path = `${testFolder}/${schemaName}/wrong/${file}`;
					const obj = jsonLint.loadJson(_path);

					const validation = jsonLint.validate(obj, schemaName);
					const pathValidation = jsonLint.validateFromPath(_path, schemaName);
					const ErrorMessage = `Wrong json ${file} not giving errors in schema ${schemaName}`;

					expect(validation.errors.length).not.toBe(0, ErrorMessage);
					expect(pathValidation.errors.length).not.toBe(0, ErrorMessage);
				});
			});
		});
	}

	tests.forEach(file => { schemaTest(file); });
});
