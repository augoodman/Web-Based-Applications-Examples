require('enzyme-adapter-react-register');
require('log-reject-error/register');
require('require-noop-register');
require('@testing-library/jest-dom');

window.requestAnimationFrame = global.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 0);
};

window.cancelAnimationFrame = global.cancelAnimationFrame = function (id) {
    clearTimeout(id);
};

window.scroll = global.scroll = function() {
    return null;
};

window.scrollTo = global.scrollTo = function() {
    return null;
};
