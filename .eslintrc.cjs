module.exports = {
	"env": {
		"browser": true,
		"node": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:vue/vue3-essential"
	],
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"vue"
	],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		// 未使用的变量检查
		"no-unused-vars": ["off"],
	}
};
