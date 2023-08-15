import fs from "node:fs";
import path from "node:path";
import type { Buffer } from "node:buffer";
import axios from "axios";
import cliProgress from "cli-progress";

export interface Image {
  name: string;
}

const IMAGE_COUNT = 7 * 7;

(async () => {
  console.log(`🖌️ Start generating ${IMAGE_COUNT} images...`);
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  const imagesPath = path.join(__dirname, "../public/assets/images");

  // delete all files in "imagesPath"
  deleteAllFilesInPath(imagesPath);

  // generate json "_images.json"
  const imagesJson = path.join(__dirname, "../src/_images.json");
  fs.writeFileSync(imagesJson, JSON.stringify([]));

  // generate newImages array
  const newImages: Image[] = [];

  progressBar.start(IMAGE_COUNT, 0);

  for (let i = 0; i < IMAGE_COUNT; i++) {
    // download image from url using axios
    const imageResponse = await axios.get("https://picsum.photos/500/500", { responseType: "arraybuffer" });
    const imageBuffer: Buffer = imageResponse.data;
    const imageFileName = `image-${i}.jpg`;
    const imageFilePath = path.join(imagesPath, imageFileName);
    fs.writeFileSync(imageFilePath, imageBuffer);
    newImages.push({ name: imageFileName });

    progressBar.update(i + 1);
  }

  // write newImages array to "_images.json"
  fs.writeFileSync(imagesJson, JSON.stringify(newImages, null, 2));

  progressBar.stop();

  console.log(`🖌️ Finished generating ${IMAGE_COUNT} images!`);
})();

function deleteAllFilesInPath(imagesPath: string) {
  const images = fs.readdirSync(imagesPath);
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imageFile = path.join(imagesPath, image);
    const imageFileStat = fs.statSync(imageFile);
    if (imageFileStat.isFile()) {
      fs.unlinkSync(imageFile);
    }
  }
}
