'use strict';

var path = require('path');
var _ = require('lodash');

const fs = require('fs');

// All configurations will extend these options
// ============================================
var
rootDir             = path.normalize(__dirname + '/'),
// baseUrl             = process.env.HOST_URL || 'http://127.0.0.1:9000',
// environment         = process.env.NODE_ENV || 'development',
// isDevelopmentMode   = (environment === 'development'),
// stage               = process.env.COORDINATE_STAGE || 'dev',

appConfig = {
//   env: environment,

//   baseUrl: baseUrl,

  // Root path of server
  root: rootDir,

  awsConfig: {
    accessKeyId: 'AKIAYSQL6A3HCUJE5LUT',
    secretAccessKey: "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",
    bucketName: 'tymlee-uploads'
  },
  uploads: {
    dest: path.join(rootDir,'tmp'),
    path: path.join(rootDir,'uploads'),
    maxSize: 1e+7,
    maxCount: 10
  },
  gKey: 'AIzaSyCcAOiS3MRf4QRE9og2pGSPgT8bJOmuTm8', //for prod config https://developers.google.com/maps/documentation/geocoding/get-api-key#restrict_key
  rule: {
    checkFrequency: 3600000
  },
  serverSideEncryption: 'AES256',
};

// Export the config object based on the NODE_ENV
// ==============================================

// var envMerge = _.merge(
//   all,
//   require('./' + environment + '.js') || {}
// );

// var stageMerge = _.merge(
//   envMerge, 
//   require('./stage/' + stage + '.js') || {} 
// );

// console.log('Final Config', stageMerge);

module.exports = {appConfig};
