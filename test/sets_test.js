const assert = require('assert');
const utils = require('../lib/index.js');

suite('scopeIntersection', () => {
  const testScopeIntersection = (scope1, scope2, expected, message) => {
    assert.deepEqual(utils.scopeIntersection(scope1, scope2).sort(), expected.sort(), message);
    assert.deepEqual(utils.scopeIntersection(scope2, scope1).sort(), expected.sort(), message);
  };

  test('single exact match, [string]', () => {
    const scope = ['foo:bar'];

    testScopeIntersection(scope, scope, scope, `expected ${scope}`);
  });

  test('empty [string] in scopesets', () => {
    const scope1 = ['foo:bar'];
    const scope2 = [''];

    testScopeIntersection(scope1, scope2, [], 'expected an empty set');
  });

  test('prefix', () => {
    const scope1 = ['foo:bar'];
    const scope2 = ['foo:*'];

    testScopeIntersection(scope1, scope2, scope1, `expected ${scope1}`);
  });

  test('star not at end', () => {
    const scope1 = ['foo:bar:bing'];
    const scope2 = ['foo:*:bing'];

    testScopeIntersection(scope1, scope2, [], 'expected an empty set');
  });

  test('star at beginning', () => {
    const scope1 = ['foo:bar'];
    const scope2 = ['*:bar'];

    testScopeIntersection(scope1, scope2, [], 'expected an empty set');
  });

  test('prefix with no star', () => {
    const scope1 = ['foo:bar'];
    const scope2 = ['foo:'];

    testScopeIntersection(scope1, scope2, [], 'expected empty set');
  });

  test('star but not prefix', () => {
    const scope1 = ['foo:bar:*'];
    const scope2 = ['bar:bing'];

    testScopeIntersection(scope1, scope2, [], 'expected empty set');
  });

  test('star but not prefix', () => {
    const scope1 = ['bar:*'];
    const scope2 = ['foo:bar:bing'];

    testScopeIntersection(scope1, scope2, [], 'expected empty set');
  });

  test('disjunction', () => {
    const scope1 = ['bar:*'];
    const scope2 = ['foo:x', 'bar:x'];

    testScopeIntersection(scope1, scope2, ['bar:x'], 'expected [\'bar:x\']');
  });

  test('conjuction', () => {
    const scope1 = ['bar:y', 'foo:x'];
    const scope2 = ['bar:*', 'foo:x'];

    testScopeIntersection(scope1, scope2, scope1, `expected ${scope1}`);
  });

  test('empty pattern', () => {
    const scope1 = [''];
    const scope2 = ['foo:bar'];

    testScopeIntersection(scope1, scope2, [], 'expected empty set');
  });

  test('empty patterns', () => {
    const scope1 = [];
    const scope2 = ['foo:bar'];

    testScopeIntersection(scope1, scope2, [], 'expected empty set');
  });

  test('bare star', () => {
    const scope1 = ['foo:bar', 'bar:bing'];
    const scope2 = ['*'];

    testScopeIntersection(scope1, scope2, scope1, `expected ${scope1}`);
  });

  test('empty conjunction in scopesets', () => {
    const scope1 = ['foo:bar'];
    const scope2 = [];

    testScopeIntersection(scope1, scope2, [], 'expected empty set');
  });
});
