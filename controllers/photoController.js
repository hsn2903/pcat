const fs = require("fs");
const path = require("path");

const Photo = require("./../models/Photo");

exports.getAllPhotos = async (req, res) => {
  // urlden gelen sayfa bilgisi = hangi sayfa
  const page = req.query.page || 1;
  // sayfa başına gösterilecek resim sayısı
  const photosPerPage = 2;
  // db deki toplam fotograf sayısı
  const totalPhotos = await Photo.find().countDocuments();
  // tüm fotograflar
  const photos = await Photo.find({})
    .sort("-dateCreated")
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);

  res.render("index", {
    photos: photos,
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage),
  });
};

exports.getPhoto = async (req, res) => {
  const id = req.params.id;
  const photo = await Photo.findById(id);
  res.render("photo", {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  // uploads klasörü oluşturuyorum
  const uploadDir = "public/uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // yüklenen resim
  let uploadedImage = req.files.image;
  // nereye yüklenecek
  let uploadPath = __dirname + "/../public/uploads/" + uploadedImage.name;

  // resmin benim belirlediğim klasöre eklenmesi için
  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadedImage.name,
    });
    res.redirect("/");
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  // fotografı fiziksel olarak siler
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + "/../public" + photo.image;
  fs.unlinkSync(deletedImage);
  // db'den siler
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect("/");
};
