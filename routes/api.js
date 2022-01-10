"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
   const translator = new Translator();

   app.route("/api/translate").post((req, res) => {
      const { text, locale } = req.body;
      if (text === undefined || locale === undefined) {
         return res.json({ error: "Required field(s) missing" });
      }
      if (!text) {
         return res.json({ error: "No text to translate" });
      }
      //translate
      const result = translator.translate(text, locale);
      if (result instanceof Error) {
         return res.json({ error: result.message });
      }
      return res.json({
         text,
         translation: result === text ? "Everything looks good to me!" : result,
      });
   });
};
