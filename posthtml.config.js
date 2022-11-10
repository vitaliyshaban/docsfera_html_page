module.exports = ({ file, options, env }) => ({
	plugins: {
		"posthtml-include": { root: "./source/pages" },
		"posthtml-extend": { root: "./source" },
		"posthtml-expressions": {
			locals: { env: options.url },
			removeScriptLocals: true,
		},
	},
});
