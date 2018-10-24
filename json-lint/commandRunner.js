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

const jsonLintApi = require('./api');

const VALIDATE = 'validate';
const LIST_SCHEMAS = 'listSchemas';
const ERROR_EXIT = 1;
const SUCCESS_EXIT = 0;

function _shortErrorPrint(args, errors) {
	console.log(`-- json validation error : ${args.schema || args.file} ---`);
	errors.forEach(e => {
		!!e.property && console.log(`   ${e.property}`)
		!!e.message && console.log(`   ${e.message}`)
		console.log(`-----`)
	});
};

function _successPrint(args) {
	console.log(`JSON validation -> ${args.schema || args.file}`)
	console.log('   Success');
}

function _validateArguments(args) {
	if (args.args.length !== 1) {
		return `Action is necessary: ${VALIDATE} | ${LIST_SCHEMAS}`;
	}

	const action = args.args[0];

	if (action === VALIDATE) {
		if (!args.file) {
			return `\n missing -file path to ${VALIDATE} \n`;
		}
	}

	return null;
}

function run(args) {
	const error = _validateArguments(args);

	if (!!error) {
		console.log(error);
		process.exit(ERROR_EXIT);
	}

	const action = args.args[0];

	switch (action) {
		case VALIDATE:
			const errors = jsonLintApi.validateFromPath(args.file, args.schema).errors;

			if (!errors.length) {
				_successPrint(args);
				process.exit(SUCCESS_EXIT);
			} else {
				if(args.verbose) {
					console.log(errors);
				} else {
					_shortErrorPrint(args, errors)
				}
				process.exit(ERROR_EXIT);
			}
			break;
		case LIST_SCHEMAS:
			const list = jsonLintApi.getSchemaNamesAndPath();

			if (!!args.schema) {
				list.filter(obj => obj.name === args.schema)
					.map(obj => obj.MarfeelPath)
					.forEach(path => console.log(path));
			} else {
				list.map(obj => obj.MarfeelPath)
					.forEach(path => console.log(path));
			}
			break;
		default:
			console.log('Error: no action run defined');
			process.exit(ERROR_EXIT);
	}

}



module.exports = { run };
