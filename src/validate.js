const SCOPES_MSG = 'scopes must be an array of arrays of strings ' +
          '(disjunctive normal form)';
const VALID_SCOPE = /^[\x20-\x7e]*$/;

/**
 * Determine whether a scope is valid.  Scopes must be strings of ASCII
 * characters 0x20-0x7e (printable characters, including space but no other
 * whitespace)
 */
const validScope = exports.validScope = (scope) =>
  typeof scope == 'string' && VALID_SCOPE.test(scope);

/**
 * Validate scope-sets for well-formedness.  See scopeMatch for the description
 * of a scope-set.
 */
exports.validateScopeSets = (scopesets) => {
  if (!Array.isArray(scopesets)) {
    throw new Error(SCOPES_MSG);
  }
  if (!scopesets.every(function(conj) {
    return Array.isArray(conj) && conj.every(validScope);
  })) {
    throw new Error(SCOPES_MSG);
  }
};
