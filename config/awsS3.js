const { S3 } = require("@aws-sdk/client-s3");
const bcrypt = require('bcrypt');
const BUCKET = process.env.AWS_BUCKET_NAME;
class AwsS3 {

  static __self = null;
  static getInstance() {
    if (this.__self == null) {
      this.__self = new AwsS3();
    }
    return this.__self;
  }
  constructor() {
    this.s3 = new S3({
      region: 'us-east-2',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
  }

  async uploadFile(prefix, file) {
    const hash = bcrypt.hashSync(file.buffer.toString(), 10);
    file.originalname = hash
    const params = {
      Bucket: BUCKET,
      Key: `${prefix}/${file.originalname}`,
      Body: file.buffer,
    };
    return this.s3.upload(params).promise();
  }

  async getFile(prefix, Key) {
    const params = {
      Bucket: BUCKET,
      Key: `${prefix}/${Key}`,
    };
    return this.s3.getObject(params);
  }

  async deleteFile(fileKey) {
    const params = {
      Bucket: BUCKET,
      Key: fileKey,
    };
    return this.s3.deleteObject(params).promise();
    }
}
module.exports = AwsS3;