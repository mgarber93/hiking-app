const records = [
  {
    id: 0,
    username: 'user',
    password: 'password',
    displayName: 'John',
    physicalLevel: 3,
  },
  {
    id: 1,
    username: 'test',
    password: 'testing',
    displayName: 'Tester',
    physicalLevel: 1,
  },
];

module.exports.findById = function (id, cb) {
  process.nextTick(function () {
    if (records.hasOwnProperty(id)) {
      cb(null, records[id]);
    } else {
      cb(new Error(`User ${id} does not exist`));
    }
  });
};

module.exports.findByUsername = function (username, cb) {
  process.nextTick(function () {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
};
