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
const jsonLint = require('../../../api');
const util = require('../../../utils/schemaUtils');

describe('Valid json schemas:', () => {
	const testFolder = './test/resources/schema';
	const tests = fs.readdirSync(testFolder).filter(util.isNotPrivate);

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
					const objErrorMessage = !!objectValidation.errors.length &&
						`Error validating "${file}" with schema "${schemaName}" :\n${objectValidation.errors.join('\n')}`;

					expect(objectValidation.errors.length).toBe(0, objErrorMessage);
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
					const ErrorMessage = `Error detecting problems while validating wrong "${file}" with schema "${schemaName}"`;

					expect(validation.errors.length).not.toBe(0, ErrorMessage);
				});
			});
		});
	}

	it('malformed JSON file has validation errors', () => {
		const path = `./test/resources/malformed.json`;
		const { errors } = jsonLint.validateFromPath(path);

		expect(errors.length).toBe(1);
		expect(errors[0].message).toBe('JSON parse error:\tUnexpected token m in JSON at position 6\n\tin file: ./test/resources/malformed.json');
	});

	it('wrong json file path has validation errors', () => {
		const path = `./does/not/exists.json`;
		const { errors } = jsonLint.validateFromPath(path);

		expect(errors.length).toBe(1);
		expect(errors[0].message).toBe('Json file not found : ./does/not/exists.json');
	});

	tests.forEach(file => { schemaTest(file); });
});
