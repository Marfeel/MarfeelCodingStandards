const hasKeywords = (accumulator, currentValue) => {
	return accumulator || currentValue.indexOf('keywords') !== -1;
};

module.exports = {
	names: ['keywords-yml'],
	description: 'Rule that reports an error if no keywords tag present',
	tags: ['keywords'],
	function: function rule(params, onError) {
		if (!params.frontMatterLines.reduce(hasKeywords, false)) {
			onError({
				// eslint-disable-next-line no-magic-numbers
				lineNumber: 1,
				detail: 'No keywords found on metadata'
			});
		}
	}
};