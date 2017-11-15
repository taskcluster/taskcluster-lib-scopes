let assert = require('assert');

/**
 * Determine whether a scope is valid.  Scopes must be strings of ASCII
 * characters 0x20-0x7e (printable characters, including space but no other
 * whitespace)
 */

let _validScope = /^[\x20-\x7e]*$/;
exports.validScope = function(scope) {
  return typeof scope == 'string' && _validScope.test(scope);
};

/**
 * Validate scope-sets for well-formedness.  See scopeMatch for the description
 * of a scope-set.
 */
exports.validateScopeSets = function(scopesets) {
  let msg = 'scopes must be an array of arrays of strings ' +
            '(disjunctive normal form)';
  assert(Array.isArray(scopesets), msg);
  assert(scopesets.every(function(conj) {
    return Array.isArray(conj) && conj.every(exports.validScope);
  }), msg);
};
