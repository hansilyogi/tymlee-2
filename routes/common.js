const
  fs = require('fs'),
  path = require('path'),
  Q = require('q'),
  rootDir = path.normalize(__dirname + '../../../'),
  mkdirp = require('mkdirp'),
  { appConfig } = require('../app_config'),
  ClientUpload = require('../model/upload.model');

const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });

const { promisify } = require('util');
const asyncFsRead = promisify(fs.readFile);

const awsS3Client = new AWS.S3({
  accessKeyId: appConfig.awsConfig.accessKeyId,
  secretAccessKey: appConfig.awsConfig.secretAccessKey
});


exports.download = function (req, res, next) {
  var
    uploadId = req.params.uploadId;
  // previewThumb = (parseInt(req.query.preview) === 1);


  ClientUpload.findOne({
    _id: uploadId
  }, function (err, doc) {
    if (err) return next(err);
    if (!doc) return res.send(404);

    const params = {
      Bucket: appConfig.awsConfig.bucketName,
      Key: doc.path,
    }

    const data = awsS3Client.getObject(params).createReadStream();
    res.setHeader('Content-disposition', 'attachment; filename=' + doc.name);
    res.setHeader('Content-Type', doc.mimeType);
    res.setHeader('Transfer-Encoding', 'chunked');
    data.pipe(res);
    // res.download(doc.filePath, doc.name, function (err) {
    //   if (err) { return next(err); }
    // });
  });
};

exports.s3Create = function (req, res, next) {

  if (!req.files || !req.files.length) {
    return next('No files were uploaded');
  }

  var
    uploadPath = appConfig.uploads.path,
    clientUploadPath = path.join(uploadPath, String(`${appConfig.awsConfig.bucketName}`)),
    chain = req.files.reduce(function (promise, file) {
      var
        originalName = file.originalname,
        tempPath = file.path,
        mimeType = file.mimetype,
        fileSize = file.size,
        finalPath = path.join(clientUploadPath, file.filename);

      return promise.then(function (results) {
        return Q.nfcall(fs.rename, tempPath, finalPath)
          .then(function () {
            return asyncFsRead(finalPath);
          })
          .then(function (data) {
            const params = {
              Body: data,
              Bucket: appConfig.awsConfig.bucketName, //process.env.BUCKET_NAME, 
              Key: `${appConfig.awsConfig.bucketName}/${file.filename}`,
              ContentType: file.mimetype,
              ServerSideEncryption: 'AES256',

            }
            console.log(path.relative(uploadPath, finalPath), params)
            return awsS3Client.putObject(params).promise();
          })
          .then(function () {
            return Q.nfcall(ClientUpload.create.bind(ClientUpload), {
              createdBy: req.user,
              createdByEmail: req.email,
              name: originalName,
              mimeType: mimeType,
              path: path.relative(uploadPath, finalPath),
              size: fileSize
            });
          })
          .then(function (doc) {
            results.push(doc.resultProperties);
            return results;
          });

        return results;
      })
    }, Q.nfcall(mkdirp, clientUploadPath).then(function () {
      return [];
    }));

  chain = chain.then(function (results) {
    res.json(results);
  }).catch(next);
};

exports.s3getImage = function (req, res, next) {

  // if(err) return next(err);
  // if(!doc) return res.send(404);

  const params = {
    Bucket: 'testing-img',
    Key: '77a5b59385b69e6850a0886fe916c602',
  }

  const data = awsS3Client.getObject(params).createReadStream();


  res.setHeader('Content-disposition', 'attachment; filename=abc.jpg') //+ doc.name);
  res.setHeader('Content-Type', 'image/jpeg')//doc.mimeType);
  res.setHeader('Transfer-Encoding', 'chunked');
  data.pipe(res);

  // res.download(doc.filePath, doc.name, function (err) {
  //   if (err) { return next(err); }
  // });

};

