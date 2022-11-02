require("dotenv/config");

const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");

const app = express();
const port = 4000;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const upload = multer({ storage }).single("image");

app.post("/upload", upload, (req, res) => {
  console.log(req.file);
  let myFile = req.file.originalname;
  const fileType = myFile[myFile.length - 1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${fileType}` + ".mp4",
    Body: req.file.buffer,
    // ContentMD5: "STRING_VALUE",
  };

  //   s3.putObject(params, function (err, data) {
  //     if (err) console.log(err, err.stack); // an error occurredx
  //     else console.log(data); // successful response
  //   });

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
      console.log("if error");
    }
    res.status(200).send(data);
    console.log(s3.getObject().startTime);
    console.log(data);
    console.log("success");
  });
});

app.listen(port, () => {
  console.log(`Server is up at ${port}`);
});
