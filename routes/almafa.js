var express = require('express');
var router = express.Router();
const ftp = require('basic-ftp');

/* GET almafa */
router.get('/', async function(req, res, next) {
const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    const ftpResponse = await client.access({
      host: "127.0.0.1",    // Replace with your FTP server
      port: 21,
      user: "user",
      password: "pass",
      secure: false               // true if FTPS is required
    });

    console.log("✅ Logged in!", ftpResponse);

    const list = await client.list();
    console.log("Directory contents:", list);

    // Path to the file you want to download
    const remoteFilePath = "/almafa.txt";

    // Download file to a buffer
    let content = "";
    await client.downloadTo(
      streamCollector(text => content += text),
      remoteFilePath
    );

    res.send(content);

  } catch (err) {
    console.warn(err);
    res.status(500).send("❌ Failed to fetch file from FTP: "+err.message);
  }

  client.close();
});

module.exports = router;

// Helper to collect stream into string
const streamCollector = (onData) => {
  const { Writable } = require("stream");
  return new Writable({
    write(chunk, encoding, callback) {
      onData(chunk.toString());
      callback();
    }
  });
};