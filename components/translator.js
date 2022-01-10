const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");
class Translator {
   //locale const
   static BRITISH_TO_AMERICA_LOCALE = "british-to-american";
   static AMERICAN_TO_BRITISH_LOCALE = "american-to-british";
   //locale list
   #LIST_SUPPORTED_LOCALE = [
      Translator.BRITISH_TO_AMERICA_LOCALE,
      Translator.AMERICAN_TO_BRITISH_LOCALE,
   ];

   //type
   #BRITISH = "british";
   #AMERICAN = "american";
   translate(originalText, locale) {
      //get local
      const targetLocale = this.#LIST_SUPPORTED_LOCALE.find(
         (item) => item === locale
      );
      if (!targetLocale) {
         return new Error("Invalid value for locale field");
      }
      if (targetLocale === Translator.BRITISH_TO_AMERICA_LOCALE) {
         return this.britishToAmerican(originalText);
      } else {
         return this.americanToBritish(originalText);
      }
   }
   britishToAmerican(originalText) {
      let result = originalText.slice();
      //check and replace american words
      const keyBritishOnly = Object.keys(britishOnly);
      keyBritishOnly.forEach((value) => {
         const regex = new RegExp(value, "i");
         if (this.#isAWordInSentence(result, regex)) {
            result = result.replace(
               regex,
               `<span class="highlight">${britishOnly[value]}</span>`
            );
         }
      });
      //check spelling and replace
      const keyAmericanToBritishSpelling = Object.keys(
         americanToBritishSpelling
      );
      result = result
         .split(" ")
         .map((value) => {
            let tmpResult = value;
            for (let i = 0; i < keyAmericanToBritishSpelling.length; i++) {
               let britishWord =
                  americanToBritishSpelling[keyAmericanToBritishSpelling[i]];
               if (britishWord === value) {
                  tmpResult = `<span class="highlight">${keyAmericanToBritishSpelling[i]}</span>`;
                  break;
               }
            }

            return tmpResult;
         })
         .join(" ");
      //check titles and replace
      const keyAmericanToBritishTitles = Object.keys(americanToBritishTitles);
      result = result
         .split(" ")
         .map((value) => {
            let tmpResult = value;
            for (let i = 0; i < keyAmericanToBritishTitles.length; i++) {
               let britishWord =
                  americanToBritishTitles[keyAmericanToBritishTitles[i]];
               let regex = new RegExp(`^${britishWord}$`, "i");
               if (regex.test(value)) {
                  tmpResult = `<span class="highlight">${this.#capitalFirstLetter(
                     keyAmericanToBritishTitles[i]
                  )}</span>`;
                  break;
               }
            }
            return tmpResult;
         })
         .join(" ");
      //convert to american time
      result = this.#convertTime(result, this.#AMERICAN);
      //Capital the first letter
      result = this.#capitalFirstLetter(result);
      return result;
   }
   americanToBritish(originalText) {
      let result = originalText.slice();
      //check and replace british words
      const keyAmericanOnly = Object.keys(americanOnly);
      keyAmericanOnly.forEach((value) => {
         const regex = new RegExp(value, "i");
         if (this.#isAWordInSentence(result, regex)) {
            result = result.replace(
               regex,
               `<span class="highlight">${americanOnly[value]}</span>`
            );
         }
      });

      //check spelling and replace
      const keyAmericanToBritishSpelling = Object.keys(
         americanToBritishSpelling
      );
      result = result
         .split(" ")
         .map((value) => {
            let tmpResult = value;
            for (let i = 0; i < keyAmericanToBritishSpelling.length; i++) {
               let britishWord =
                  americanToBritishSpelling[keyAmericanToBritishSpelling[i]];
               if (keyAmericanToBritishSpelling[i] === value) {
                  tmpResult = `<span class="highlight">${britishWord}</span>`;
                  break;
               }
            }
            return tmpResult;
         })
         .join(" ");
      //check titles and replace
      const keyAmericanToBritishTitles = Object.keys(americanToBritishTitles);
      result = result
         .split(" ")
         .map((value) => {
            let tmpResult = value;
            for (let i = 0; i < keyAmericanToBritishTitles.length; i++) {
               let britishWord =
                  americanToBritishTitles[keyAmericanToBritishTitles[i]];
               let regex = new RegExp(
                  `^${keyAmericanToBritishTitles[i]}$`,
                  "i"
               );
               if (regex.test(value)) {
                  tmpResult = `<span class="highlight">${this.#capitalFirstLetter(
                     britishWord
                  )}</span>`;
                  break;
               }
            }
            return tmpResult;
         })
         .join(" ");
      //convert to british time
      result = this.#convertTime(result, this.#BRITISH);
      //Capital the first letter
      result = this.#capitalFirstLetter(result);
      return result;
   }
   #isAWordInSentence(text, regex) {
      const targetMatch = text.match(regex);
      if (targetMatch !== null) {
         //only replace word if the match is a word in a sentence,
         if (/[\s.]/.test(text[targetMatch.index + targetMatch[0].length])) {
            return true;
         }
      }
      return false;
   }
   #capitalFirstLetter(text) {
      return text[0].toUpperCase().concat(text.slice(1));
   }
   #convertTime(text, type) {
      let tmpResult = text.slice();
      let current = type === this.#BRITISH ? ":" : ".";
      let change = type === this.#BRITISH ? "." : ":";
      let regex =
         type === this.#BRITISH ? /\d{1,2}:\d{1,2}/ : /\d{1,2}[.]\d{1,2}/;
      while (tmpResult.match(regex) !== null) {
         tmpResult = tmpResult.replace(
            regex,
            `<span class="highlight">${tmpResult
               .match(regex)[0]
               .replace(current, change)}</span>`
         );
      }
      return tmpResult;
   }
}

module.exports = Translator;
