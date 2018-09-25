#JSONLINT

JSONLINT defines Json Schemas used in Marfeel and probide an interface to validate our Json files against them.
We can access the tool via JavaScript API or via CLI tool.

## Getting Started

### Installing
Navigate in the console to the folder where package.json exist and run command:

```
npm install
```

## Using CLI tool

### Validation of JSON

Validate a json against the schema matching its path name.
```
node jsonLint validate -f <path>
```

Example:
```
node jsonLint validate -f ~/MarfeelCodingStandards/jsonLint/test/resources/schema/inventory/valid/inventory.json
```

Validate a json against the given schema
```
node jsonLint validate -f <path> -s <schemaName>
```

Example:
```
node index.js validate -f ~/MarfeelCodingStandards/jsonLint/test/resources/schema/inventory/valid/taboola.test.json -s inventory
```

### List schemas path

Each Json schema has a parameter in main.json ( MarfeelPath ) that defines the path where the file is found in the tenant. We can obtain the path of all the schemas defined.

```
node jsonLint listSchemas
```

We can obtain the path for a single schema 

```
node jsonLint listSchemas -s inventory
```

## Using JavaScript API

In a Js environment, we can import jsonlint/api and we will be able to access to the native methods:
```
	validate : validates javascript object
	validateFromPath : validates from a json file path
	getSchemaNames : get the names of the schemas available
	getSchemaNamesAndPath : get list of objects defining schema name and MarfeelPath [{name: <schemaName>, MarfeelPath: <pathInMarfeel>}]
	loadJson : try to load a json from a file path and return a JavaScript object
```

## Run tests

```
    npm test
```