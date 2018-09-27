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
const fs = require('fs');

const isJson = (filePath) => filePath.endsWith('.json');
const isNotPrivate = (fileName) => fileName[0] !== '.';

function loadJson(_path) {
	if (!isJson(_path)) {
		return false;
	}

	let textFile = '';

	try {
		textFile = fs.readFileSync(_path);
	} catch (e) {
		throw new Error(`Json file not found : ${_path}`);
	}

	try {
		return JSON.parse(textFile);
	} catch (e) {
		throw new Error(`Couldn\'t parse to json the file content : ${_path}`);
	}
}

function getSchemaPath(name) {
	const schemaPath = (process.env.JSONLINT_TEST && name === 'example') ?
		`./../test/resources/api/schema/${name}` : `./../schemas/${name||''}`;

	return path.resolve(__dirname, schemaPath);
}

function importUnresolvedRefs(validator, schemaPath) {
	const nextSchema = validator.unresolvedRefs.shift();

	if (!nextSchema) { return; }

	const nextJson = loadJson(getSchemaPath(`${schemaPath}${nextSchema}`));

	validator.addSchema(nextJson, nextSchema);
	importUnresolvedRefs(validator, schemaPath);
}

module.exports = {
	getSchemaPath,
	importUnresolvedRefs,
	isNotPrivate,
	isJson,
	loadJson
};
