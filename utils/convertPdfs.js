import fs from "fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const path = "./pdf"

const fileNames = fs.readdirSync(path, { encoding: "utf8" });

function pdfToPng(files) {

  files.forEach(async (file) => {

    const fileNoExt = file.replace(".pdf", "")

    const loadingTask = getDocument(`${path}/${file}`);

    try {

      const pdfDocument = await loadingTask.promise;

      const page = await pdfDocument.getPage(1);

      const canvasFactory = pdfDocument.canvasFactory;

      const viewport = page.getViewport({ scale: 2.0 });

      const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);

      const renderContext = {
        canvasContext: canvasAndContext.context,
        viewport,
      }

      const renderTask = page.render(renderContext);
      await renderTask.promise;

      const image = canvasAndContext.canvas.toBuffer();

      fs.writeFile(`./png/${fileNoExt}.png`, image, function (err) {
        if (err) {
          console.error("Error: ", err)
        } else {
          // console.log("pdf converted to png")
        }
      })

    } catch (e) {
      console.error("Error: ", e)
    }
  })

}

pdfToPng(fileNames);