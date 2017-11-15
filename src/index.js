// load from each of the submodules
[
  require('./validate'),
  require('./sets'),
  require('./satisfaction'),
].forEach(submodule => {
  for (const key in submodule) {
    if (submodule.hasOwnProperty(key)) {
      exports[key] = submodule[key];
    }
  }
});
