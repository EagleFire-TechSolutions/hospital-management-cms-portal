import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5* 1024 *1024 //5MB
  },
  fileFilter: function (req , file ,cb){
    const fileTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
     "application/msword", // .doc
"application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
    ];
    if(fileTypes.includes(file.mimetype)){
      cb(null , true)

    }else{
      cb(new Error("Invalid file type.Only PDF , JPEG , PNG and JPG files are allowed."));
      alert("Invalid file type.Only PDF , JPEG , PNG and JPG files are allowed.");
    };
  }
});

export default upload;
