const reducer = (accumulator, currentValue) => {
	return accumulator || currentValue.indexOf('keywords') !== -1;
};

module.exports = {
	names: ['keywords-yml'],
	description: 'Rule that reports an error if no keywords tag present',
	tags: ['keywords'],
	function: function rule(params, onError) {
		if (!params.frontMatterLines.reduce(reducer, false)) {
			onError({
				// eslint-disable-next-line no-magic-numbers
				lineNumber: 1,
				detail: 'No keyword found on metadata'
			});
		}
	}
};