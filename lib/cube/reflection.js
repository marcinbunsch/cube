function Reflection(db) {
  this.db = db;
}

Reflection.prototype.getCollectionNames = function(callback) {
  this.db.collectionNames(function(err, names) { 
    callback(names);
  });
};

Reflection.prototype.getEventCollectionNames = function(callback) {
  this.getCollectionNames(function(names) {
    var filtered = names.map(function(name) { 
      return name.name.split('.').pop();
    }).filter(function(name) { 
      return /_events/.test(name); 
    });
    callback(filtered);
  });
};

Reflection.prototype.getCollectionKeys = function(callback) {
  var self = this;
  this.getEventCollectionNames(function(names) {
    var collections = {};
    var left = names.length;
    if (left == 0) callback(collections);
    names.forEach(function(name) {
      self.getCollectionSchema(name, function(keys) { 
        collections[name] = keys;
        left = left - 1;
        if (left == 0) callback(collections);
      });
    });
  })
};

Reflection.prototype.getCollectionSchema = function(collectionName, callback) {
  var processResult = function(err, resources) {
    var resource = resources[0];
    var collection = [];
    if (resource) {
      for (key in resource.d) {
         collection.push(key);
      };
    };
    callback(collection)
  };

  this.db.collection(collectionName).find({}, { 
    sort: { 't': -1 }, 
    limit: 1
  }).toArray(processResult)
}

exports.getter = function(db) {

  function getter(request, callback) {
    var start = new Date(request.start),
        stop = new Date(request.stop),
        id = request.id;

    var reflection = new Reflection(db);

    reflection.getCollectionKeys(callback);

  }

  return getter;

}

