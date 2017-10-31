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

function validateScopePatterns(scopePatterns) {
  assert(scopePatterns instanceof Array && scopePatterns.every((scope) => {
    return typeof scope === 'string';
  }), 'scopes must be an array of strings');
}

/**
 * Auxiliary function to check if scopePatterns satisfies a scope-set
 *
 * Note that scopesets is an array of arrays of strings. For example:
 *  [['a', 'b'], ['c']]
 *
 * Is satisfied if either,
 *  i)  'a' and 'b' is satisfied, or
 *  ii) 'c' is satisfied.
 *
 * Also expressed as ('a' and 'b') or 'c'.
 */
exports.scopeMatch = function(scopePatterns, scopesets) {
  exports.validateScopeSets(scopesets);
  validateScopePatterns(scopePatterns);

  return scopesets.some(function(scopeset) {
    return scopeset.every(function(scope) {
      return scopePatterns.some(function(pattern) {
        if (scope === pattern) {
          return true;
        }
        if (/\*$/.test(pattern)) {
          return scope.indexOf(pattern.slice(0, -1)) === 0;
        }
        return false;
      });
    });
  });
};

/**
 * Finds scope intersections between two scope sets.
 */
exports.scopeIntersection = (scopeset1, scopeset2) => {
  validateScopePatterns(scopeset2);
  validateScopePatterns(scopeset1);

  const junctions = [];
  const scope1 = scopeset2.filter(s => s);
  const scope2 = scopeset1.filter(s => s);

  scope2.forEach((s2) => {
    scope1.forEach((s1) => {
      const star = '*';
      const s1IndexOfStar = s1.indexOf(star);
      const s2IndexOfStar = s2.indexOf(star);

      if (s1 === s2) {
        junctions.push(s1);
      } else if (s1.slice(-1) === star && s1.slice(0, s1IndexOfStar) === s2.slice(0, s1IndexOfStar)) {
        // s1 ends with * and s1 and s2 are equal up to the position of that *
        junctions.push(s2);
      } else if (s2.slice(-1) === star && s2.slice(0, s2IndexOfStar) === s1.slice(0, s2IndexOfStar)) {
        // s2 ends with * and s2 and s1 are equal up to the position of that *
        junctions.push(s1);
      }
    });
  });

  return junctions;
};
