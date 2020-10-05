'use strict';

var
Q = require('q'),
fs = require('fs'),
path = require('path'),
crypto = require('crypto'),
mongoose = require('mongoose'),
mimes = require('./upload.mimes'),
Promise = mongoose.Promise,
Schema = mongoose.Schema,
{config} = require('../app_config');

var
ClientUploadSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  createdByEmail : {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },

  // these are set in the pre(save), don't require
  checksum: String,
  size: Number,
  ////////

  updatedOn: Date,
  createdOn: {
    type: Date,
    default: Date.now
  },
  userFavorites: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: false
  }],
}, {
  usePushEach: true
});

ClientUploadSchema
  .virtual('mimeTypeClass')
  .get(function() {
    return mimes.typeOf(this.mimeType);
  });

ClientUploadSchema
  .virtual('resultProperties')
  .get(function() {
    return {
      _id: this._id,
      name: this.name,
      path: this.path
    };
  });

ClientUploadSchema
  .virtual('listProperties')
  .get(function() {
    return {
      _id: this._id,
      name: this.name,
      size: this.size,
      createdBy: this.createdBy,
      mimeType: this.mimeType,
      uploadType: this.mimeTypeClass,
      updatedOn: this.updatedOn,
      createdOn: this.createdOn
    };
  });

ClientUploadSchema
  .virtual('filePath')
  .get(function() {
    return path.join(config.uploads.path, this.path);
  });

/**
 * Pre-save hook updates checksum on save
 */
ClientUploadSchema
//   .pre('save', function (next) {
//     var
//     self = this;

//     self.updateChecksum()
//       .then(function (checksum, checksumChg) {
//         return self.updateSize()
//       })
//       .then(function (size, sizeChange) {
//         return next();
//       }, next);
//   });

ClientUploadSchema.statics = {
  createReadStream: function(file) {
    return fs.createReadStream(file);
  },
  fileStats: function(file, cb) {
    var
    promise = new Promise(cb);

    fs.stat(file, function (err, stats) {
      if(err) return promise.error(err);
      promise.complete(stats);
    });

    return promise;
  },
  openFile: function(file, flags, mode, cb) {
    var
    promise = new Promise(cb);

    fs.open(file, flags, mode, function (err, fd) {
      if(err) return promise.error(err);

      promise.complete(fd);
    });

    return promise;
  },
  readFile: function(file, cb) {
    var
    promise = new Promise(cb);

    fs.readFile(file, function (err, data) {
      if(err) return promise.error(err);

      promise.complete(data);
    });

    return promise;
  },
  deleteFile: function(file, cb) {
    var
    promise = new Promise(cb);

    fs.unlink(file, function (err) {
      if(err) return promise.error(err);

      promise.complete();
    });

    return promise;
  },
  checksum: function (file, cb) {
    var
    promise = new Promise(cb);

    if(!file) {
      promise.error(new Error('Path must be set before updating checksum.'));
      return promise;
    }

    var
    hash = crypto.createHash('sha1'),
    fd   = this.createReadStream(file);

    hash.setEncoding('hex');

    fd.on('end', (function() {
      hash.end();
      promise.complete(hash.read());
    }).bind(this));

    fd.on('error', promise.error.bind(promise));

    // read all file and pipe it (write it) to the hash object
    fd.pipe(hash);

    return promise;
  },
  assertChecksum: function (file, previousCheckSum, cb) {
    var
    promise = new Promise(cb);

    this.checksum(file, (function (err, checksum) {
      if(err) return promise.error(err);
      return promise.complete(checksum === previousCheckSum);
    }).bind(this))

    return promise;
  }
};

ClientUploadSchema.methods = {
  createReadStream: function() {
    return this.constructor.createReadStream(this.filePath);
  },
  fileStats: function(cb) {
    return this.constructor.fileStats(this.filePath, cb);
  },
  openFile: function(flags, mode, cb) {
    return this.constructor.createReadStream(this.filePath, flags, mode, cb);
  },
  readFile: function(cb) {
    return this.constructor.readFile(this.filePath, cb);
  },
  deleteFile: function(cb) {
    return this.constructor.deleteFile(this.filePath, cb);
  },
  getChecksum: function (cb) {
    return this.constructor.checksum(this.filePath, cb);
  },
  assertChecksum: function (cb) {
    return this.constructor.assertChecksum(this.filePath, this.checksum, cb);
  },
  updateChecksum: function (cb) {
    var
    promise = new Promise(cb);

    this.getChecksum((function (err, checksum) {
      if(err) return promise.error(err);

      var // check if has changed
      changed = (this.checksum !== checksum);

      if(changed) {
        this.checksum = checksum;
      }

      promise.complete(this.checksum, changed);
    }).bind(this));

    return promise;
  },
  updateSize: function (cb) {
    var
    promise = new Promise(cb);

    this.fileStats((function (err, stats) {
      if(err) return promise.error(err);

      var // check if has changed
      changed = (this.size !== stats.size);

      if(changed) {
        this.size = stats.size;
      }

      promise.complete(this.size, changed);
    }).bind(this));

    return promise;
  }
};

module.exports = mongoose.model('ClientUpload', ClientUploadSchema);
