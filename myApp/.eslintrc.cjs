module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential",
        "plugin:@typescript-eslint/recommended",
        'plugin:prettier/recommended'
    ],
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "paths": {
        "@/*": ["src/*"]
    },
    "rules": {
        'max-len': [1, {
            code: 120
        }],
        'no-console': 0,
        'curly': 0,
        'array-callback-return': 0,
        'no-use-before-define': 0,
        'no-restricted-syntax': 0,
        'import/export': 0,
        "import/first": 0, // 保持所有導出優先
        'import/no-duplicates': 1,
        'symbol-description': 0,
        'no-unused-vars': 0,
        'space-before-function-paren': 0,
        'eslint-comments/no-unlimited-disable': 0,
        'no-unused-expressions': 0,
        'prefer-promise-reject-errors': 0,
        'no-new': 0,
        'vue/require-explicit-emits': 0,
        'vue/singleline-html-element-content-newline': 0,
        "vue/component-tags-order": ["error", {
            "order": ["template", "script", "style"]
        }],
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                "argsIgnorePattern": "^_"
            }
        ]
    }
}