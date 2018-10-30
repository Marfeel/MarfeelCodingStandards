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
const util = require('../utils/schemaUtils');
const Validator = require('jsonschema').Validator;

const getSchemaNames = () => fs.readdirSync(util.getSchemaPath()).filter(util.isNotPrivate);
const getSchemaNamesAndPath = () =>
	getSchemaNames().map(name => ({
		name,
		MarfeelPath: util.loadJson(`${util.getSchemaPath(name)}/main.json`).MarfeelPath
	}));


function validate(jsonObject, schemaName) {
	const validator = new Validator();
	const absolutPath = `${util.getSchemaPath(schemaName)}/main.json`;
	const main = util.loadJson(absolutPath);

	validator.addSchema(main);
	util.importUnresolvedRefs(validator, schemaName);
	if(!(jsonObject instanceof Object)){
		return {errors: [{message:`invalid instance sent to json validation >> ${jsonObject}`}]}
	}
	return validator.validate(jsonObject, main);
}

function validateFromPath(jsonPath, schemaName = path.basename(jsonPath, '.json'), command = undefined) {
	try {
		const obj = util.loadExtensibleJson(jsonPath, command);

		return validate(obj, schemaName);
	} catch (e) {
		return { errors: [{message: e.message}] };
	}
}


module.exports = {
	validate,
	validateFromPath,
	getSchemaNames,
	getSchemaNamesAndPath,
	loadJson: util.loadJson
};
