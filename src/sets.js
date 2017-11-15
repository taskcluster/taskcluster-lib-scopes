import {scopeMatch} from './satisfaction';

/**
 * Finds scope intersections between two scope sets.
 */
exports.scopeIntersection = (scopeset1, scopeset2) => [
  ...scopeset1.filter(s => scopeMatch(scopeset2, [[s]])),
  ...scopeset2.filter(s => scopeMatch(scopeset1, [[s]])),
].filter((v, i, a) => a.indexOf(v) === i);
