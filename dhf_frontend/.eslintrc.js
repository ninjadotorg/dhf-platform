// http://eslint.org/docs/user-guide/configuring
// http://eslint.org/docs/rules
// https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules

/*
  "off" or 0 - turn the rule off
  "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
  "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
*/
module.exports = {
	extends: ["airbnb"],
	parser: "babel-eslint",
	plugins: ["react"],
	env: {
		jest: true,
		browser: true
	},
	settings: {
		"import/resolver": {
			webpack: { config: "configs/webpack.config.js" },
		}
	},
	rules: {
		"max-len": [1, 120],
		"indent": [1, 2, { "SwitchCase": 1 }],
		"no-tabs": 0,
		"no-plusplus": 0,
		"no-underscore-dangle": 0,
		"no-console": [1, { "allow": ["info", "warn", "error"] }],
		"radix": [1, "as-needed"],
		"arrow-parens": 0,
		"arrow-body-style": 0,
		"global-require": 0,
		"import/no-dynamic-require": 0,
		"import/no-extraneous-dependencies": 0,
		"import/prefer-default-export": 0,
		"react/forbid-prop-types": [1, { "forbid": ["any"] }],
		"react/jsx-filename-extension": [1, { "extensions": [".js"] }],
		"react/no-unused-prop-types": 0,
		"react/jsx-first-prop-new-line": 0,
		"jsx-a11y/href-no-hash": 0,
		"jsx-a11y/no-static-element-interactions": 0,
		"jsx-a11y/no-noninteractive-element-interactions": 0,
    "object-curly-newline": 0,
		"react/sort-comp": [2, {
			"order": [
				"type-annotations",
				"static-methods",
				"lifecycle",
				"/^on.+$/",
				"/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/",
				"everything-else",
				"/^render.+$/",
				"render"
			]
		}]
 	}
}
