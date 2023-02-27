const express = require('express');
const multer = require('multer');
const path = require('path');


const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render(__dirname + '/public/index.html');
});

app.post('/', upload.single("image"), (req, res) => {
    res.json({ message: "File uploaded successfully", link: req.file.path });
});

app.get('/images/:image', (req, res) => {
    res.sendFile(__dirname + '/images/' + req.params.image);
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});