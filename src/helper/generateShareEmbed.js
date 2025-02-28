const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { createCanvas, loadImage } = require("canvas");

const app = express();
const PORT = 3000;
const SECRET_KEY = "supersecretkey"; //CHANGE KEY

app.use(express.static(path.join(__dirname, "dist"))); //serve Vite frontend

//function to verify the score's signature
function verifySignature(score, signature) {
    const expectedSignature = crypto.createHmac("sha256", SECRET_KEY)
        .update(score.toString())
        .digest("hex");
    return signature === expectedSignature;
}

//generate a dynamic OG image
app.get("/api/og-image/:score/:signature", async (req, res) => {
    const { score, signature } = req.params;

    //validate the signature
    if (!verifySignature(score, signature)) {
        return res.status(403).send("Invalid signature!");
    }

    //create a 1200x630 image CHANGE TO VERT IMAGE
    const width = 1200, height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    //background color
    ctx.fillStyle = "#1E1E1E"; // Dark theme
    ctx.fillRect(0, 0, width, height);

    //load a background image (optional)
    try {
        const bgImage = await loadImage("background.png"); // Add a custom background
        ctx.drawImage(bgImage, 0, 0, width, height);
    } catch (err) {
        console.log("No background image found, skipping.");
    }

    //draw the score text
    ctx.fillStyle = "#FFFFFF"; // White text
    ctx.font = "bold 80px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Score: ${score}`, width / 2, height / 2);

    //convert canvas to PNG buffer
    const buffer = canvas.toBuffer("image/png");
    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(buffer);
});

//serve the score page with dynamic OG meta tags
app.get("/score/:score/:signature", (req, res) => {
    const { score, signature } = req.params;

    //validate the signature
    if (!verifySignature(score, signature)) {
        return res.status(403).send("Invalid score signature!");
    }

    //generate dynamic meta tags
    const url = `https://yourwebsite.com/score/${score}/${signature}`;
    const imageUrl = `https://yourwebsite.com/api/og-image/${score}/${signature}`;

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>I scored ${score} points!</title>

            <meta property="og:title" content="I scored ${score} points!" />
            <meta property="og:description" content="Can you beat my score?" />
            <meta property="og:image" content="${imageUrl}" />
            <meta property="og:url" content="${url}" />
            <meta name="twitter:card" content="summary_large_image" />

            <script>
                window.location.replace("/#/score/${score}/${signature}");
            </script>
        </head>
        <body>
            <h1>Redirecting...</h1>
        </body>
        </html>
    `);
});