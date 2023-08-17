const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");
const dotenv = require("dotenv");
const sharp = require("sharp");
dotenv.config({ path: ".env" });
// const s3 = new S3Client({
//   endpoint: "https://syd1.digitaloceanspaces.com",
//   region: process.env.REGION,
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY_ID,
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
//   },
// });
const s3 = new S3Client({
  endpoint: "https://syd1.digitaloceanspaces.com",
  region: "syd1",
  credentials: {
    accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY,
  },
});

exports.getS3Middleware = (fieldNames) => {
  return (req, res, next) => {
    console.log("fieldNames", fieldNames);
    const processField = async (fieldName) => {
      const filePath = req.body[fieldName];
      const ogFilePath = req.body["old_" + fieldName]
        ? req.body["old_" + fieldName]
        : "";
      if (filePath === "undefined") {
        delete req.body[fieldName];
        return;
      } else {
        try {
          const fileContent = await sharp(filePath)
            .resize({ width: 2000 }) // set the maximum width of the image
            .jpeg({ quality: 80 }) // set the JPEG quality to 80%
            .toBuffer();

          const params = {
            Bucket: process.env.SPACES_BUCKET_NAME,
            Key: filePath,
            Body: fileContent,
            ACL: "public-read",
          };
          await s3.send(new PutObjectCommand(params));

          // Delete the local file after upload
          fs.unlinkSync(filePath);

          // Delete the original file if it exists
          if (ogFilePath.length > 0) {
            const deleteObjectCommand = new DeleteObjectCommand({
              Bucket: process.env.SPACES_BUCKET_NAME,
              Key: ogFilePath,
            });

            try {
              await s3.send(deleteObjectCommand);
              console.log("Object deleted successfully");
            } catch (error) {
              if (error.statusCode === 404) {
                console.log("File doesn't exist");
              } else {
                console.log("Error deleting object", error);
              }
            }
          }

          req.body = { ...req.body, [fieldName]: filePath };
          // next();
        } catch (error) {
          console.log("upload", error);
          // next();
        }
      }
    };

    const fieldPromises = fieldNames.map(processField);
    console.log("fieldNames", fieldNames);
    Promise.all(fieldPromises)
      .then(() => {
        next();
      })
      .catch((error) => {
        console.log("upload", error);
        next();
      });
  };
};
