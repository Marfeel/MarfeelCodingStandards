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
const JSON_MERGE_COMMAND = 'mrf-json';

const path = require('path');
const fs = require('fs');
const { spawnSync }  = require('child_process');

const isJson = (filePath) => filePath.endsWith('.json');
const isNotPrivate = (fileName) => fileName[0] !== '.';
const getErrorMessage = (command, jsonPath, status, execPath) => `Error merging extended JSON in schemaUtils: 
	"${command} ${jsonPath}" >> return STATUS ${status}  
	${command} executable path >> ${execPath}`

function getMarfeelExtendedJson(jsonPath, command = JSON_MERGE_COMMAND ) {
	const mrfJson = spawnSync(command , [ jsonPath ]);
	
	if(!!mrfJson.status){
		const execPath = spawnSync('command', ['-v', command]).stdout;
		throw new Error(getErrorMessage(command, jsonPath, mrfJson.status, execPath))
	}

	try{
		return JSON.parse(mrfJson.stdout)
	} catch(e) {
		throw new Error(`Error merging extended JSON in schemaUtils: ${e}`)
	}
}

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

function loadExtensibleJson(jsonPath, command = undefined) {
	let obj = loadJson(jsonPath);

	if(Object.keys(obj).includes('extends')){
		obj = getMarfeelExtendedJson(jsonPath, command);
	}	
	return obj
}
module.exports = {
	loadExtensibleJson,
	getSchemaPath,
	importUnresolvedRefs,
	isNotPrivate,
	isJson,
	loadJson
};
