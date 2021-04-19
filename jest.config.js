
const path = require('path');
// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
process.env.TZ = 'America/Los_Angeles';

const roots = ['<rootDir>/src', __dirname];

try {
    require('fs').accessSync(path.resolve(process.cwd(), 'test'));
    roots.push('<rootDir>/test');
} catch (e) {
    // no-op ... test dir doesn't exist
}

module.exports = {
    rootDir: process.cwd(),
    roots: roots,
    transform: {
        '\\.(j|t)sx?$': ['babel-jest', { configFile: path.resolve(__dirname, './.babelrc.es5.json') }]
    },
    setupFilesAfterEnv: [path.resolve(__dirname, './test-setup')],
    clearMocks: true,
    testEnvironment: 'jest-environment-jsdom-global',
    testPathIgnorePatterns : ['/node_modules/','/template/', 'commands/test', '/lib/'],
    transformIgnorePatterns: ['/node_modules/','/template/', '/lib/']
};