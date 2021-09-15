module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    env: {
        node: true,
        es6: true,
        jest: true,
        browser: true
    },
    settings: {
        'import/resolver': {
            'typescript': {}
        }
    },
    rules: {
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        '@typescript-eslint/ban-types': ['off'],
        '@typescript-eslint/no-inferrable-types': ['off'],
        '@typescript-eslint/no-empty-function': ['off']
    }
};
