// Arquivo com as padronizações de código
// Estamos usando o ESLint padrão Airbnb
// Usamos também o prettier
module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        'airbnb-base',
        'prettier'
    ],
    plugins: ['prettier'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    rules: {
        "prettier/prettier": "error",
        "class-methods-use-this": "off",
        "no-param-reassign": "off",
        "camelcase": "off",
        "no-unused-vars": ["error", {"argsIgnorePattern": "next"}]
      },
}
