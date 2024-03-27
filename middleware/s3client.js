const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const dotenv = require("dotenv");
const sharp = require("sharp");
dotenv.config({ path: ".env" });
// const { PDFThumbnailGenerator } = require("pdf-thumbnail-generator");
const mime = require("mime-types");
// const s3 = new S3Client({ˇ
//   endpoint: "https://syd1.digitaloceanspaces.com",

//   region: process.env.REGION,
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY_ID,
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
//   },
// });
const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY,
  },
});

exports.getS3Middleware = (fieldNames, doThumbnail = true, compress = true, maxWidth = 1000, deleteFile = true) => {
  return async (req, res, next) => {
    const processField = async (fieldName) => {
      const filePath = req.body[fieldName];
      const ogFilePath = req.body["old_" + fieldName] || "";

      if (typeof filePath === "undefined") {
        delete req.body[fieldName];
        delete req.body[fieldName + "Thumbnail"];
        return;
      }

      try {
        const isImage = filePath.endsWith(".jpg") || filePath.endsWith(".jpeg") || filePath.endsWith(".png");
        let thumbnail = "";
        compress = compress && isImage;
        let fileContent;
        let ContentType;
        try {
          if (compress) {
            // console.log("Compressing");
            fileContent = await sharp(filePath).resize({ width: maxWidth }).png({ quality: 100 }).toBuffer();
            ContentType = mime.lookup(filePath) || "application/octet-stream";
          } else {
            // console.log("Skipping compression");
            fileContent = fs.readFileSync(filePath);
            ContentType = mime.lookup(filePath) || "application/octet-stream";
          }
        } catch (ee) {
          console.log("error reading file", ee);
          fileContent = fs.readFileSync(filePath);
        }

        const mainObject = {
          Bucket: process.env.SPACES_BUCKET_NAME,
          Key: filePath,
          Body: fileContent,
          ACL: "public-read",
          ContentType: ContentType,
        };
        // console.log("upload started", ContentType);
        try {
          await s3.send(new PutObjectCommand(mainObject));
          // console.log("upload Done");
        } catch (error) {
          console.log("upload error", error);
        }

        if (doThumbnail && isImage) {
          const lastSlashIndex = filePath.lastIndexOf("/");
          if (lastSlashIndex !== -1) {
            thumbnail = filePath.slice(0, lastSlashIndex + 1) + "thumbnail" + "/" + filePath.slice(lastSlashIndex + 1);
          }
          const thumbnailfileContent = await sharp(filePath).resize({ width: 100 }).png({ quality: 100 }).toBuffer();
          const thumbObject = {
            Bucket: process.env.SPACES_BUCKET_NAME,
            Key: thumbnail,
            Body: thumbnailfileContent,
            ACL: "public-read",
          };
          await s3.send(new PutObjectCommand(thumbObject));
        } else if (doThumbnail && filePath.endsWith(".pdf")) {
          // const lastSlashIndex = filePath.lastIndexOf("/");
          // if (lastSlashIndex !== -1) {
          //   thumbnail = filePath.slice(0, lastSlashIndex + 1) + "thumbnail" + "/" + filePath.slice(lastSlashIndex + 1);
          // }
          // thumbnail = thumbnail + ".png";
          // const pdfThumbnailGenerator = new PDFThumbnailGenerator();
          // await pdfThumbnailGenerator.generateThumbnail(filePath, thumbnail);
          // const thumbnailfileContent = await sharp(thumbnail).resize({ width: 100 }).png({ quality: 100 }).toBuffer();
          // const thumbObject = {
          //   Bucket: process.env.SPACES_BUCKET_NAME,
          //   Key: thumbnail,
          //   Body: thumbnailfileContent,
          //   ACL: "public-read",
          // };
          // await s3.send(new PutObjectCommand(thumbObject));
        }

        if (deleteFile) {
          fs.unlinkSync(filePath);
          // console.log("File deleted");
        }

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

        if (doThumbnail) {
          req.body = { ...req.body, [fieldName]: filePath, [fieldName + "Thumbnail"]: thumbnail };
        } else {
          req.body = { ...req.body, [fieldName]: filePath };
        }
        // console.log("body", req.body);
      } catch (error) {
        console.log("upload error", error);
      }
    };

    try {
      await Promise.all(fieldNames.map(processField));
      next();
    } catch (error) {
      console.log("upload promise all error", error);
      next();
    }
  };
};