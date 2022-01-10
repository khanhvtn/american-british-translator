const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");
const validTextAmericanToBritish = "Mangoes are my favorite fruit.";

suite("Functional Tests", () => {
   test("Translation with text and locale fields: POST request to /api/translate", function (done) {
      chai
         .request(server)
         .post("/api/translate")
         .send({
            text: validTextAmericanToBritish,
            locale: Translator.AMERICAN_TO_BRITISH_LOCALE,
         })
         .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "text");
            assert.property(res.body, "translation");
            assert.strictEqual(
               res.body.translation,
               `Mangoes are my <span class="highlight">favourite</span> fruit.`
            );
            done();
         });
   });
   test("Translation with text and invalid locale field: POST request to /api/translate", function (done) {
      chai
         .request(server)
         .post("/api/translate")
         .send({
            text: validTextAmericanToBritish,
            locale: "invalid-locale",
         })
         .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "error");
            assert.strictEqual(
               res.body.error,
               `Invalid value for locale field`
            );
            done();
         });
   });
   test("Translation with missing text field: POST request to /api/translate", function (done) {
      chai
         .request(server)
         .post("/api/translate")
         .send({
            locale: Translator.AMERICAN_TO_BRITISH_LOCALE,
         })
         .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "error");
            assert.strictEqual(res.body.error, `Required field(s) missing`);
            done();
         });
   });
   test("Translation with missing locale field: POST request to /api/translate", function (done) {
      chai
         .request(server)
         .post("/api/translate")
         .send({
            text: validTextAmericanToBritish,
         })
         .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "error");
            assert.strictEqual(res.body.error, `Required field(s) missing`);
            done();
         });
   });
   test("Translation with empty text: POST request to /api/translate", function (done) {
      chai
         .request(server)
         .post("/api/translate")
         .send({
            text: "",
            locale: Translator.AMERICAN_TO_BRITISH_LOCALE,
         })
         .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "error");
            assert.strictEqual(res.body.error, `No text to translate`);
            done();
         });
   });
   test("Translation with text that needs no translation: POST request to /api/translate", function (done) {
      chai
         .request(server)
         .post("/api/translate")
         .send({
            text: validTextAmericanToBritish,
            locale: Translator.BRITISH_TO_AMERICA_LOCALE,
         })
         .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "text");
            assert.property(res.body, "translation");
            assert.strictEqual(
               res.body.translation,
               `Everything looks good to me!`
            );
            done();
         });
   });
});
