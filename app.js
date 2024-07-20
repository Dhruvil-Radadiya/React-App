if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
    }

const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const QrCodeReader = require('qrcode-reader');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Cloudinary configuration
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key :   process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});


// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'qr-codes',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route to display the upload form
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Route to render the QR scanner page
app.get('/qr-scanner', (req, res) => {
    res.render('qr-scanner');
});

// Route to handle file upload and QR code scanning
app.post('/upload', upload.single('qrCode'), (req, res) => {
  const filePath = req.file.path;

  Jimp.read(filePath)
    .then(image => {
      const qr = new QrCodeReader();
      qr.callback = (err, value) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error reading QR code');
          return;
        }
        res.send(`QR Code Data: ${value.result}`);
      };
      qr.decode(image.bitmap);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error processing image');
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



