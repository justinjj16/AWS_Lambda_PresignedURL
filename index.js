const aws = require('aws-sdk');

exports.handler = async (event) => {
  // TODO implement
  console.log(event.body)
  const imageNames = JSON.parse(event.body).imageNames;
  const folderName = JSON.parse(event.body).folderName;
  try {
    const s3 = new aws.S3({ signatureVersion: 'v4' });
    s3.config.update({
      signatureVersion: 'v4',
      region: REGION,
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY
    })

    const S3_BUCKET = S3_BUCKET_NAME;
    const presignedUrls = {}

    for (const fileName of imageNames) {
      const fileType = fileName.split('.')[1];
      let contentType = ''
      if (fileType === "svg") {
        contentType = 'image/svg+xml'
      } else {
        contentType = `image/${fileType}`
      }
      var presignedPUTURL = await s3.getSignedUrl('putObject', {
        Bucket: S3_BUCKET,
        Key: IMAGE_PATH,
        Expires: 1000,
        ContentType: contentType
      });
      presignedUrls[fileName] = presignedPUTURL;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(presignedUrls),
    };
    return response;

  } catch (e) {
    console.log(e);
    const response = {
      statusCode: 400,
      body: JSON.stringify(e),
    };
    return response;
  }


};
