/**
 * @jest-environment jsdom
 */
import { previewContentEditable } from "../ContentEditable";

describe("previewContentEditable", () => {
  describe("Given an empty string", () => {
    it("should return an empty string", () => {
      const result = previewContentEditable({
        value: ``,
      });

      expect(result).toEqual("");
    });
  });
  describe("Given an undefined string", () => {
    it("should return an empty string", () => {
      const result = previewContentEditable({
        value: undefined,
      });

      expect(result).toEqual("");
    });
  });
  describe("Given a string that ends with a space", () => {
    it("should return an empty string", () => {
      const result = previewContentEditable({
        value: "Unfinished Sentance ",
      });

      expect(result).toMatchInlineSnapshot(`"Unfinished Sentance"`);
    });
  });
  describe("Given a string", () => {
    it("should return a properly formatted string", () => {
      const result = previewContentEditable({
        value: `Ba Sing Se`,
      });

      expect(result).toEqual("Ba Sing Se");
    });
  });
  describe("Given a complex multiline string", () => {
    it("should return a properly formatted string", () => {
      const result = previewContentEditable({
        value: `This is<br><br>A Very COMPLEX<br><br>String<br><br>With<br><br>Multiple Lines<br>`,
      });

      expect(result).toMatchInlineSnapshot(
        `"This is  A Very COMPLEX  String  With  Multiple Lines"`
      );
    });
  });
  describe("Given a string with an image", () => {
    it("should return a properly formatted string", () => {
      const result = previewContentEditable({
        value: `This is<br><br>A Very Complex<br><br>String<br><br><img src="https://i.imgur.com/sohWhy9.jpg" alt="surprised-pikachu"><br>With<br><br>Multiple Lines<br>`,
      });
      expect(result).toMatchInlineSnapshot(
        `"This is  A Very Complex  String   With  Multiple Lines"`
      );
    });
  });
  describe("Given a long string that needs to be truncated", () => {
    it("should return a properly formatted string", () => {
      const result = previewContentEditable({
        value: `Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.`,
        length: 50,
      });
      expect(result).toMatchInlineSnapshot(
        `"Turnip greens yarrow ricebean rutabaga endive c..."`
      );
    });
  });
});
