module.exports = {
    extends: 'airbnb',
    parser: 'babel-eslint',
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
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                'js': 'never',
                'jsx': 'never',
                'ts': 'never',
                'tsx': 'never'
            }
        ],
        'react/jsx-filename-extension': [
            1,
            {
                extensions: [
                    '.js',
                    '.jsx'
                ]
            }
        ],
        'max-len': 0,
        'no-multiple-empty-lines': 0,
        'implicit-arrow-linebreak': 0,
        'comma-dangle': 0,
        'no-tabs': 0,
        'indent': 0,
        'react/jsx-indent': 0,
        'react/jsx-indent-props': 0,
        'no-underscore-dangle': 0,
        'no-trailing-spaces': 0,
        'linebreak-style': 0,
        'import/no-cycle': 0,
        'import/no-named-as-default': 0,
        'import/prefer-default-export': 0,
        'react/jsx-props-no-spreading': 0,
        'class-methods-use-this': 0,
        'global-require': 0,
        'react/forbid-prop-types': 0,
        'jsx-a11y/label-has-associated-control': [
            2,
            {
                labelComponents: [
                    'CustomInputLabel'
                ],
                labelAttributes: [
                    'label'
                ],
                controlComponent: [
                    'CustomInput'
                ],
                depth: 3
            }
        ]
    }
};
