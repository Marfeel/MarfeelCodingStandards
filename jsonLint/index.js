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
const util = require('./utils/schemaUtils');
const Validator = require('jsonschema').Validator;

function getSchemaNames() {
	const source = path.resolve(__dirname, 'schemas');

	return fs.readdirSync(source).filter(util.isNotPrivate);
}

function validate(jsonObject, schemaName) {
	const validator = new Validator();
	const absolutPath = `${util.getSchemaPath(schemaName)}/main.json`;
	const main = util.loadJson(absolutPath);

	validator.addSchema(main);
	util.importUnresolvedRefs(validator, schemaName);

	return validator.validate(jsonObject, main);
}

function validateFromPath(jsonPath, schemaName) {
	const obj = util.loadJson(jsonPath);

	return validate(obj, schemaName);
}


module.exports = {
	validate,
	validateFromPath,
	getSchemaNames,
	loadJson: util.loadJson
};
