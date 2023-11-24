module.exports = {
    root: true,

    env: {
        node: true
    },

    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ],

    parserOptions: {
        parser: 'babel-eslint'
    },

    rules: {
        'prefer-const': "off",
        'no-console': 'off',
        'no-debugger': 'off',
        'space-before-function-paren': 'off',
        'object-curly-spacing': 'off',
        indent: 'off',
        'quote-props': [
            0,
            'always'
        ],
        'eol-last': 0
    },

    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ]
}