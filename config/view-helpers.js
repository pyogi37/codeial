const path = require("path");
const env = require("./environment");
const fs = require("fs");

module.exports = (app) => {
  app.locals.assetPath = function (filepath) {
    if (env.name == "development") {
      return "/" + filepath;
    }

    return (
      "/" +
      JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "../public/assets/rev-manifest.json")
        )
      )[filepath]
    );
  };
};
