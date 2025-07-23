const ftp = require('basic-ftp');
const multer = require('multer');
const express = require('express');
const app = express();
// At the top of app.js
const cors = require("cors");
app.use(cors());


app.use(express.json());

const upload = multer({ dest: 'uploads/' }); // temp file storage

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/ftp-file/:name', async (req, res) => {
  //console.log('req', req);
  const name = req.params.name;
  const filename = '/' + name + '.txt';

const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: "127.0.0.1",
      port: 21,
      user: "user",
      password: "pass",
      secure: false
    });

    const chunks = [];
    await client.downloadTo(
      new require("stream").Writable({
        write(chunk, _, callback) {
          chunks.push(chunk);
          callback();
        }
      }),
      filename
    );

    const result = Buffer.concat(chunks).toString("utf-8");
    res.status(200).send(result);

  } catch (err) {
    console.warn("FTP Error:", err.message);
    res.status(500).send("FTP error: " + err.message);
  } finally {
    client.close();
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
        const filePath = req.file.path;
        const originalName = req.file.originalname;

        console.log("📤 Received:", originalName, "→", filePath);

        const client = new ftp.Client();
        await client.access({
            host: "127.0.0.1",
            user: "user",
            password: "pass",
            secure: false,
        });

        // Upload file to FTP server
        await client.uploadFrom(filePath, "/" + originalName);
        client.close();

        res.send("Uploaded to FTP: " + originalName);
    } catch (err) {
        console.error("❌ FTP upload failed:", err);
        res.status(500).send("FTP upload failed");
    }  
});

const port = 3333;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
