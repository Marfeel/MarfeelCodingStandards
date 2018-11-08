const path = require('path');
const fs = require('fs');

// ---------------------------------   PATHS ---------------------------------
const MIXINS_PATH = `${process.env.MARFEELXP_HOME}/Pixie/scss/mixins`;
const SCSS_DIRECOTRY = './code-snippets/snippets/scss';


// ---------------------------------   UTILS   ---------------------------------
//remove all files contained in a dir
function cleanDirectory(dir) {
	fs.existsSync(dir) && fs.readdir(dir, (err, files) => {
		if (err) { throw err; }
		  files.forEach(file =>{
			  fs.unlink(path.join(dir, file), err => {
				  if (err) { throw err; }
			});
		  });
	  });
}

//scss =to=> mixin+name
function mixinBodyAndPrefix(fileContent) {
	const mixinRegex = new RegExp(/\@mixin(.*?)\(.*?\)/g);
	const prepareMixin = (original) =>
		original.replace('mixin', 'include')
			.split(',')
			.map(Function.prototype.call, String.prototype.trim)
			.join(',\n\t\t');
	const results = {};

	while (match = mixinRegex.exec(fileContent)) {
		const mixinName = match[1].trim();

		if (!mixinName.startsWith('_')) {
			const prefix = `mrf-mix-${mixinName}`;
			const mixinBody = `${prepareMixin(match[0])};`;

			results[prefix] = mixinBody;
		}
	}

	return results;
}

//return array of scss paths
function treeWalkOfScss(dir) {
	const names = fs.readdirSync(dir);
	const scssPaths = [];

	names.forEach(name => {
		const fullPath =`${dir}/${name}`;

		if (path.extname(name) === '.scss') {
			scssPaths.push(fullPath);
		} else {
			scssPaths.push(...treeWalkOfScss(fullPath));
		}
	});

	return scssPaths;
}



// ---------------------------------   IMPLEMENTATION ---------------------------------
const allResults = {};

// Read all scss to collect mixins
treeWalkOfScss(MIXINS_PATH).forEach(scssDir => {
	const fileContent = fs.readFileSync(scssDir, 'utf8');
	const mixin = mixinBodyAndPrefix(fileContent);

	Object.assign(allResults, mixin);
}
);

// Store new snippets
cleanDirectory(SCSS_DIRECOTRY);
Object.keys(allResults).forEach(name=>{
	fs.appendFile(`${SCSS_DIRECOTRY}/${name}.scss`, allResults[name], function(err) {
		if (err) { throw err; }
		console.log(`Saved!  ${name}.scss`);
	});
});

console.log(allResults);




