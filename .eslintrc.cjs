module.exports = {
	env: {
		browser: true,
		node: true,
		es2021: true
	},
	extends: [
		"eslint:recommended",
		"plugin:vue/vue3-essential",
		"@bohecola"
	],
	overrides: [
	],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module"
	},
	plugins: [
		"vue"
	],
	rules: {
		// Vue
		"vue/multi-word-component-names": "off",
		"vue/require-default-prop": "off",
		"vue/require-prop-types": "off"
	}
};
