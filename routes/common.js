const
  fs = require('fs'),
  path = require('path'),
  Q = require('q'),
  rootDir = path.normalize(__dirname + '../../../'),
  mkdirp = require('mkdirp'),
  { appConfig } = require('../app_config'),
  request = require('request'),
  Customer = require('../model/customermaster'),
  ClientUpload = require('../model/upload.model'),
  CompanyMaster = require('../model/companymaster');

const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });

const { promisify } = require('util');
const { async } = require('q');
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
    res.status(200).json({status: true, data: results});
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
async function findAndUpdateCustomerOTP(mobileNo, otp) {
  try {
    let customer = await Customer.findOne({ $or: [{ mobileNo: mobileNo }, { mobileNo: '91' + mobileNo }] });
    if (customer) {
      customer.oTP = otp.toString();
      customer.oTPSentOn = new Date()
      let updatedCustomer = await customer.save()
      return updatedCustomer;
    } else {
      throw new Error('No Data found with pass mobile number')
    }
    //.update([{$set: {oTP: otp.toString(), oTPSentOn: new Date()}}])
  } catch(err) {
    throw new Error(err)
  }
}

async function findAndUpdateVendorOTP(mobileNo, otp) {
  try {
    let vendor = await CompanyMaster.findOne({ $or: [{ adminMobile: mobileNo }, { adminMobile: '91' + mobileNo }] });
    if (vendor) {
      vendor.otp = otp.toString();
      vendor.oTPSentOn = new Date()
      let updatedVendor = await vendor.save()
      return updatedVendor;
    } else {
      throw new Error('No Data found with pass mobile number')
    }
    //.update([{$set: {otp: otp.toString(), oTPSentOn: new Date()}}])
  } catch(err) {
    throw new Error(err)
  }
}

exports.sendOTP = async function (req, res, next) {
  try {
    const { mobileNumber, type } = req.body;
    if (!mobileNumber || !type) throw new Error('Invalid Number or Type!')
    const otp = Math.floor(100000 + Math.random() * 900000);
    let isFound = false;
    let data = null;
    if (type == 'customer') {
      data = await findAndUpdateCustomerOTP(mobileNumber, otp);    
      isFound = data && data.id ? true : false;
    } else if(type == 'vendor') {
      data = await findAndUpdateVendorOTP(mobileNumber, otp);
      isFound = data && data.id ? true : false;
    } else {
      res.status(500).json({
        status: false,
        message:'Invalid Type',
        otp: -1
      })
    }
    if (isFound) {

      request({
        method: 'POST',
        url: `http://promosms.itfuturz.com/vendorsms/pushsms.aspx?user=svvpmm&password=dns@123&msisdn=${mobileNumber}&sid=GLOBAL&msg=${otp}&fl=0&gwid=2`,
        headers: {},
        body: {},
        json: true
      }, function (err, result, body) {
        if (err) {
          res.status(500).json({
            status: false,
            message: err.message || err,
            otp: '-1'
          })
        }
        if(body){         
          res.status(200)
          .json({
            status: true,
            Data: {
              _id: data._id,
            firstName:data.firstName,
            lastName:data.lastName,
            mobileNo:data.mobileNo,
            emailID:data.emailID,
            },
            otp: body.MessageData[0].MessageParts[0].Text,
          })
        }
      });
    } else {
      res.status(200)
          .json({
            status: false,
            otp: '-1',
            message: 'Number not found!'
          })
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message || err,
      otp: '-1'
    })
  }
}

async function verifyOTP(req, res, next) {
  try {
    let { type, otp, newPassword, confirmPassword, mobileNo } = req.body;
    if (!type || !otp || !newPassword || !confirmPassword || !mobileNo) throw new Error('Invalid request data!');

    if (type == 'customer') {
      let condition = JSON.stringify({oTP: otp, $or: [{ mobileNo: mobileNo }, { mobileNo: `91${ mobileNo}` }] });
      console.log(condition)
      let customer =  await Customer.findOne({ oTP: otp, $or: [{ mobileNo: mobileNo }, { mobileNo: `91${ mobileNo}` }] });
      if (customer) {
        customer.isVerified = true;
        customer.oTP = '';
        customer.oTPVerifiedOn =  new Date();
        customer.password =  newPassword;
       await customer.save();
       delete customer.adminPassword;
        res.status(200).json({
          status: true,
          data: customer,
          message: 'Customer OTP verified '
        })
      } else {
        throw new Error('Invlid OTP or Mobile Number')
      }
    } else if (type == 'vendor'){
      let company =  await CompanyMaster.findOne({otp: otp, $or: [{ phone: mobileNo }, { phone: '91' + mobileNo }] });
      if (company) {
        company.oTP = null;
        company.adminPassword =  newPassword;
        await company.save();
        delete company.adminPassword;
        res.status(200).json({
          status: true,
          data: company,
          message: 'Vendor OTP verified '
        })
      } else {
        throw new Error('Invlid OTP or Mobile Number')
      }
    } else {
      throw new Error('Invalid Type supplied!')
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message || err
    })
  }
}
exports.verifyOTP = verifyOTP;


async function uploadDocuments(files, fileKeys) {
  try {
    var
      finalResult = [],
      uploadPath = appConfig.uploads.path,
      clientUploadPath = path.join(uploadPath, String(`${appConfig.awsConfig.bucketName}`));
    return new Promise((resolve, reject) => {
      let chain = files.reduce(function (promise, file) {
       
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
              console.log( path.relative(uploadPath, finalPath), params)
              return awsS3Client.putObject(params).promise();
            })
            .then(function () {
              return Q.nfcall(ClientUpload.create.bind(ClientUpload), {
                // createdBy: req.user,
                // createdByEmail: req.email,
                name: originalName,
                mimeType: mimeType,
                path: path.relative(uploadPath, finalPath),
                size: fileSize
              });
            })
            .then(function (doc) {
              // console.log('=======', doc.id)
              finalResult.push({
                name: originalName,
                mimeType: mimeType,
                filename: file.filename,
                fileSize: file.size,
                ...doc.resultProperties
              });
              return finalResult;
            });
        })
        
      },
      Q.nfcall(mkdirp, clientUploadPath).then(function () {
        return [];
      })); 
      chain.then(function (results) {
        resolve(results);
      }).catch((err) => {
        throw new Error(err)
      });
    });


  } catch (err) {
    console.log(err)
    throw new Error(err)
  }
}

exports.uploadDocuments = uploadDocuments;