export const IndexCardSkills = {
  getSkills(
    content: string | undefined
  ): Array<{ label: string; modifier: string }> {
    const div = document.createElement("DIV");
    div.innerHTML = content ?? "";
    const clickableSkills = div.textContent?.match(SkillRegex);

    if (!clickableSkills) {
      return [];
    }

    const result = clickableSkills
      .map((skill) => {
        const [label, modifier] = skill.split(":");
        const trimmedLabel = label?.replace("[", "").trim();
        const trimmedModifier = modifier?.replace("]", "").trim();

        if (!trimmedLabel || !trimmedModifier) {
          return null;
        }

        return {
          label: trimmedLabel,
          modifier: trimmedModifier,
        };
      })
      .filter(filterNonNullValue) as Array<{ label: string; modifier: string }>;
    return result;
  },
};

const SkillRegex = /\[(.*?)\]/gm;

const filterNonNullValue = (
  skill: { label: string; modifier: string } | null
): boolean => {
  return !!skill;
};
