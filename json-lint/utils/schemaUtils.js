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
const MERGE_ERROR = 'Error merging extended JSON in schemaUtils: ';

const path = require('path');
const fs = require('fs');
const { spawnSync }  = require('child_process');

const isNotPrivate = (fileName) => fileName[0] !== '.';
const getErrorMessage = (jsonPath, status, execPath) => `${MERGE_ERROR}
	"${JSON_MERGE_COMMAND} ${jsonPath}" >> return STATUS ${status}  
	${JSON_MERGE_COMMAND} executable path >> ${execPath}`

function getMarfeelExtendedJson(jsonPath) {
	const mrfJson = spawnSync(JSON_MERGE_COMMAND , [ jsonPath ]);

	if(!mrfJson.status){
		try{
			const execPath = spawnSync('command', ['-v', JSON_MERGE_COMMAND]).stdout;
			throw new Error(getErrorMessage(jsonPath, mrfJson.status, execPath))
		}catch(e){
			throw new Error(`${MERGE_ERROR}command not found ${JSON_MERGE_COMMAND}`)
		}
	}

	try{
		return JSON.parse(mrfJson.stdout)
	} catch(e) {
		throw new Error(`${MERGE_ERROR}${e}`)
	}
}

function loadJson(_path) {
	let textFile = '';

	try {
		textFile = fs.readFileSync(_path);
	} catch (e) {
		throw new Error(`Json file not found : ${_path}`);
	}

	try {
		return JSON.parse(textFile);
	} catch (e) {
		throw new Error(`JSON parse error:\t${e.message}\n\tin file: ${_path}`);
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

function loadExtensibleJson(jsonPath) {
	let obj = loadJson(jsonPath);

	if(Object.keys(obj).includes('extends')){
		obj = getMarfeelExtendedJson(jsonPath);
	}	
	return obj
}
module.exports = {
	loadExtensibleJson,
	getSchemaPath,
	importUnresolvedRefs,
	isNotPrivate,
	loadJson
};
