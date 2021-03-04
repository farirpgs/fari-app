/**
 * @jest-environment jsdom
 */
import { IndexCardSkills } from "../IndexCardSkills";

describe("IndexCardSkills", () => {
  describe("Given there no content", () => {
    it("should return an empty array", () => {
      const result = IndexCardSkills.getSkills(undefined);
      expect(result).toEqual([]);
    });
  });
  describe("Given the content is empty", () => {
    it("should return an empty array", () => {
      const result = IndexCardSkills.getSkills("");
      expect(result).toEqual([]);
    });
  });
  describe("Given the content is just space", () => {
    it("should return an empty array", () => {
      const result = IndexCardSkills.getSkills(`
      
      
      `);
      expect(result).toEqual([]);
    });
  });
  describe("Given the content has  spaces", () => {
    it("should return an empty array", () => {
      const result = IndexCardSkills.getSkills("[    Fight :     4   ]");
      expect(result).toEqual([{ label: "Fight", modifier: "4" }]);
    });
  });
  describe("Given the content is only brackets", () => {
    it("should return an empty array", () => {
      const result = IndexCardSkills.getSkills("[]");
      expect(result).toEqual([]);
    });
  });
  describe("Given the content is only label", () => {
    it("should return an empty array", () => {
      const result = IndexCardSkills.getSkills("[label:]");
      expect(result).toEqual([]);
    });
  });
  describe("Given the content is only value", () => {
    it("should return an empty array", () => {
      const result = IndexCardSkills.getSkills("[:3]");
      expect(result).toEqual([]);
    });
  });

  describe("Given the content has a skill with a negative number", () => {
    it("should return an empty array", () => {
      const result = IndexCardSkills.getSkills("[Fight: -4]");
      expect(result).toEqual([{ label: "Fight", modifier: "-4" }]);
    });
  });
  describe("Given the content contains a br with a font size", () => {
    it("should return an empty array", () => {
      const result = IndexCardSkills.getSkills(`
        Hi

        [Fight: -4]
        <br style="font-size: 3rem"/>
      `);
      expect(result).toEqual([{ label: "Fight", modifier: "-4" }]);
    });
  });
  describe("Given the content has a skill with an accent", () => {
    it("should return an empty array", () => {
      const result = IndexCardSkills.getSkills(`
      [Combat à l'épé:4]
      [Tir à l'arc:4]
      `);
      expect(result).toEqual([
        { label: "Combat à l'épé", modifier: "4" },
        { label: "Tir à l'arc", modifier: "4" },
      ]);
    });
  });
  describe("Given the content skills on the same line", () => {
    it("should return an empty array", () => {
      const result = IndexCardSkills.getSkills(
        `[Combat à l'épé : 4] [Tir à l'arc : 4]`
      );
      expect(result).toEqual([
        { label: "Combat à l'épé", modifier: "4" },
        { label: "Tir à l'arc", modifier: "4" },
      ]);
    });
  });
  describe("Given the content is complex", () => {
    it("should return an empty array", () => {
      const result = IndexCardSkills.getSkills(`
      This is a complex NPC

      [Notice: 4]
      [Fight: 3]
      [Physique: 3]
      [Investigate:2]
      [Athletic:-2]
      [Will:-1]
      
      `);
      expect(result).toEqual([
        { label: "Notice", modifier: "4" },
        { label: "Fight", modifier: "3" },
        { label: "Physique", modifier: "3" },
        { label: "Investigate", modifier: "2" },
        { label: "Athletic", modifier: "-2" },
        { label: "Will", modifier: "-1" },
      ]);
    });
  });
});
