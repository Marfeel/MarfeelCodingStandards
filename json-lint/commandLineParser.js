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

const program = require('commander');

function parseArguments() {
	return program
		.option('<action>', '[validate, listSchemas]', 'validate')

		.option('-f, --file <filePath>', 'Path to the JSON that needs to be validated')
		.option('-s, --schema <schemaName>', 'Name of the schema used for validation')
		.option('-v, --verbose', 'Verbose message')

		.parse(process.argv);
}

module.exports = { parseArguments };
