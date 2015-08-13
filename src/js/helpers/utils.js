/**
 * Example usage for globals
 * this global util returning currency number with comma
 * example: 1200 = 1,200
 */
globals.formatCurrency = function (number) {
    'use strict';

    return number.toLocaleString();
};
