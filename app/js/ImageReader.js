export default class ImageReader {
  filledTiles = [];
  coloredTiles = [];

  width = 0;
  height = 0;

  inputImgEl = document.createElement("input");
  inputImgFieldEl = document.createElement("label");

  constructor(inputImgEl, inputImgFieldEl) {
    this.inputImgEl = inputImgEl;
    this.inputImgFieldEl = inputImgFieldEl;
  }

  onFileChange() {
    return new Promise((resolve, reject) => {
      this.inputImgEl.oninput = (e) => {
        const files = e.target.files;

        const filteredFiles = [...files].filter(
          (f) => f.name.match("_fill.") || f.name.match("_color.")
        );

        filteredFiles.forEach(async (file) => {
          const fileName = file.name;

          const imgSrc = await this.#readAsDataURL(file);
          const img = await this.#loadImage(imgSrc);

          const ctx = document.createElement("canvas").getContext("2d");
          ctx.drawImage(img, 0, 0);

          const pixels = ctx.getImageData(0, 0, img.width, img.height).data;

          if (this.width == 0 || this.height == 0) {
            this.width = img.width;
            this.height = img.height;
          } else if (this.width != img.width || this.height != img.height) {
            reject(`El ancho o alto de las imagenes no cuadran.
              - Tamaño de la primera imagen: ${this.width} x ${this.height}.
              - Tamaño de la segunda imagen: ${img.width} x ${img.height}.`);
          }

          if (fileName.match("_fill.")) this.filledTiles = [];
          else if (fileName.match("_color.")) this.coloredTiles = [];

          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            const hex = this.rgbToHex(r, g, b);

            if (fileName.match("_fill.")) {
              if (hex == "#000000") this.filledTiles.push(1);
              else this.filledTiles.push(0);
            } else if (fileName.match("_color.")) {
              this.coloredTiles.push(hex);
            }
          }
          if (
            this.filledTiles.length > 0 &&
            (this.coloredTiles.length > 0) & (this.width > 0) &&
            this.height > 0
          ) {
            this.inputImgFieldEl.style.display = "none";
            resolve();
          }
        });
      };
    });
  }

  rgbToHex(r, g, b) {
    const toDigit = (string) => (string.length === 1 ? "0" + string : string);

    return (
      "#" +
      toDigit(r.toString(16)) +
      toDigit(g.toString(16)) +
      toDigit(b.toString(16))
    );
  }

  #readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("loadend", (ev) => {
        const result = ev.target.result;
        resolve(result);
      });
      reader.readAsDataURL(file);
    });
  }

  #loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  }
}
