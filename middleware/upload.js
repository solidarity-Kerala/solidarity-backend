const multer = require("multer");
const fs = require("fs");

const getUploadMiddleware = (folderPath, fields = []) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.substring(
        file.originalname.lastIndexOf(".")
      );
      const newFile = file.fieldname + "-" + Date.now() + ext;
      req.body = { ...req.body, [file.fieldname]: folderPath + "/" + newFile };
      cb(null, newFile);
    },
  });

  const upload = multer({ storage: storage });

  // Create an array of field objects based on the 'fields' parameter
  const uploadFields = fields.map((fieldName) => ({
    name: fieldName,
    maxCount: 1,
  }));

  return upload.fields(uploadFields);
};

module.exports = getUploadMiddleware;
