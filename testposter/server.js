const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

app.post("/process", upload.single("video"), (req, res) => {
    const input = req.file.path;
    const output = input + "_out.mp4";

    execFile(
        path.join(__dirname, "ffmpeg.exe"),
        [
            "-y",
            "-i", input,
            "-vf", "posterize=6",
            "-pix_fmt", "yuv420p",
            output
        ],
        () => {
            res.download(output, "posterized.mp4", () => {
                fs.unlinkSync(input);
                fs.unlinkSync(output);
            });
        }
    );
});

app.listen(8080);
