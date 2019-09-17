const hasTag = (accumulator, currentValue) => {
	return accumulator || currentValue.indexOf('tag') !== -1;
};

module.exports = {
	names: ['tag-yml'],
	description: 'Rule that reports an error if no tag present',
	tags: ['tag'],
	function: function rule(params, onError) {
		if (!params.frontMatterLines.reduce(hasTag, false)) {
			onError({
				// eslint-disable-next-line no-magic-numbers
				lineNumber: 1,
				detail: 'No tag found on metadata'
			});
		}
	}
};
