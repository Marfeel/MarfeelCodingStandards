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

function isJson(filePath) {
	return filePath.endsWith('.json');
}

function loadJson(_path) {
	if (! isJson(_path)) {
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
	if (!!process.env.JSONLINT_TEST && name==='example') {
		return path.resolve(__dirname, `./../test/resources/api/schema/${name}`);
	}

	return path.resolve(__dirname, `./../schemas/${name}`);
}

function importUnresolvedRefs(validator, schemaPath) {
	const nextSchema = validator.unresolvedRefs.shift();

	if (!nextSchema) { return; }

	const nextJson = loadJson(
		getSchemaPath(`${schemaPath}${nextSchema}`)
	);

	validator.addSchema(nextJson, nextSchema);
	importUnresolvedRefs(validator, schemaPath);
}

function isNotPrivate(fileName) {
	return fileName[0] !== '.';
}

module.exports = {
	getSchemaPath,
	importUnresolvedRefs,
	isNotPrivate,
	isJson,
	loadJson
};
