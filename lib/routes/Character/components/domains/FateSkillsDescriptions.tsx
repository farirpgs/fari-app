export const FateSkillsDescriptions: Record<
  string,
  { quick: string; long: string }
> = {
  academics: {
    quick: `Mundane, everyday human knowledge and education, including history, sciences, and medicine.`,
    long: `Academics stunts often refer to specialized areas of knowledge and medical skills.`,
  },
  athletics: {
    quick: `A measurement of physical potential.`,
    long: `Athletics stunts focus on movement—running, jumping, parkour—and dodging attacks.`,
  },
  burglary: {
    quick: `Knowledge of and ability to bypass security systems, pick pockets, and generally commit crimes.`,
    long: `Burglary stunts give bonuses to the various stages of committing a crime, from the planning to the execution and escape.`,
  },
  contacts: {
    quick: `Knowledge of the right people and connections that can help you.`,
    long: `Contacts stunts give you ready allies and an information network wherever you go in the world.`,
  },
  crafts: {
    quick: `Ability to make or break machinery, build contraptions, and pull off MacGyver-esque feats of ingenuity.`,
    long: `Crafts stunts let you have the gizmo on hand, give bonuses to building and breaking things, and provide justification for using Crafts in place of skills like Burglary or Academics under certain circumstances.`,
  },
  deceive: {
    quick: `Ability to lie and cheat convincingly and with aplomb.`,
    long: `Deceive stunts might improve your ability to tell a particular breed of lie or help invent false identities.`,
  },
  drive: {
    quick: `Controlling vehicles under the most grueling circumstances, pulling wicked maneuvers, and simply getting the most out of your ride.`,
    long: `Drive stunts can be signature maneuvers, a special vehicle of your own, or the ability to use Drive in place of a skill like Burglary or Academics under certain circumstances.`,
  },
  empathy: {
    quick: `Ability to accurately judge someone’s mood and intentions.`,
    long: `Empathy stunts can be about judging a crowd, picking up on lies, or helping others recover from mental consequences.`,
  },
  fight: {
    quick: `Ability to excel at hand-to-hand combat, whether with weapons or fists.`,
    long: `Fight stunts include signature weapons and special techniques.`,
  },
  investigate: {
    quick: `Deliberate, careful study and puzzling out mysteries. Use this to piece together clues or reconstruct a crime scene.`,
    long: `Investigate stunts help you form brilliant deductions or piece together information more quickly.`,
  },
  lore: {
    quick: `Specialized, arcane knowledge that falls outside of the scope of Academics, including supernatural topics of one sort or another. This is where the weird stuff happens.`,
    long: `Lore stunts often support practical applications of your arcane knowledge, such as casting spells. Some settings may remove Lore, replace it with a different skill, or combine it with Academics.`,
  },
  notice: {
    quick: `Ability to pick up details in the moment, spot trouble before it happens, and generally be perceptive. It contrasts Investigate, which is for slow, deliberate observation.`,
    long: `Notice stunts sharpen your senses, improve your reaction time, or make you harder to sneak up on.`,
  },
  physique: {
    quick: `Raw power and durability.`,
    long: `Physique stunts let you perform superhuman feats of strength, throw your weight around while wrestling, and shrug off physical consequences. In addition, a high Physique rating gives you more physical stress or consequence slots.`,
  },
  provoke: {
    quick: `Ability to push people to act the way you want them to. It’s coarse and manipulative, not a positive interaction.`,
    long: `Provoke stunts let you push opponents into foolhardy action, draw aggression toward you, or scare enemies (assuming they can feel fear).`,
  },
  rapport: {
    quick: `Building connections with others and working together. Where Provoke is manipulation, Rapport is sincerity, trust, and goodwill.`,
    long: `Rapport stunts let you sway the crowd, improve relationships, or build contacts.`,
  },
  resources: {
    quick: `Access to material things, not just money or direct ownership. It might reflect your ability to borrow from friends or dip into an organization’s armory.`,
    long: `Resources stunts let you use Resources in place of Rapport or Contacts or give you extra free invokes when you pay for the best.`,
  },
  shoot: {
    quick: `All forms of ranged combat, whether guns, throwing knives, or bow and arrow.`,
    long: `Shoot stunts let you make called shots, quick-draw, or always have a gun handy.`,
  },
  stealth: {
    quick: `Staying unseen or unheard and escaping when you need to hide.`,
    long: `Stealth stunts let you vanish in plain sight, blend into crowds, or advance through shadows unseen.`,
  },
  will: {
    quick: `Mental fortitude, the ability to overcome temptation and to withstand trauma.`,
    long: `Will stunts let you ignore mental consequences, withstand the mental agony of strange powers, and hold steady against enemies who provoke you. In addition, a high Will rating gives you more mental stress or consequence slots.`,
  },
};

export const FateSkillsDescriptionsLong: Record<string, string> = {
  academics: `Mundane, everyday human knowledge and education, including history, sciences, and medicine. Academics stunts often refer to specialized areas of knowledge and medical skills.`,
  athletics: `A measurement of physical potential. Athletics stunts focus on movement—running, jumping, parkour—and dodging attacks.`,
  burglary: `Knowledge of and ability to bypass security systems, pick pockets, and generally commit crimes. Burglary stunts give bonuses to the various stages of committing a crime, from the planning to the execution and escape.`,
  contacts: `Knowledge of the right people and connections that can help you. Contacts stunts give you ready allies and an information network wherever you go in the world.`,
  crafts: `Ability to make or break machinery, build contraptions, and pull off MacGyver-esque feats of ingenuity. Crafts stunts let you have the gizmo on hand, give bonuses to building and breaking things, and provide justification for using Crafts in place of skills like Burglary or Academics under certain circumstances.`,
  deceive: `Ability to lie and cheat convincingly and with aplomb. Deceive stunts might improve your ability to tell a particular breed of lie or help invent false identities.`,
  drive: `Controlling vehicles under the most grueling circumstances, pulling wicked maneuvers, and simply getting the most out of your ride. Drive stunts can be signature maneuvers, a special vehicle of your own, or the ability to use Drive in place of a skill like Burglary or Academics under certain circumstances.`,
  empathy: `Ability to accurately judge someone’s mood and intentions. Empathy stunts can be about judging a crowd, picking up on lies, or helping others recover from mental consequences.`,
  fight: `Ability to excel at hand-to-hand combat, whether with weapons or fists. Fight stunts include signature weapons and special techniques.`,
  investigate: `Deliberate, careful study and puzzling out mysteries. Use this to piece together clues or reconstruct a crime scene. Investigate stunts help you form brilliant deductions or piece together information more quickly.`,
  lore: `Specialized, arcane knowledge that falls outside of the scope of Academics, including supernatural topics of one sort or another. This is where the weird stuff happens. Lore stunts often support practical applications of your arcane knowledge, such as casting spells. Some settings may remove Lore, replace it with a different skill, or combine it with Academics.`,
  notice: `Ability to pick up details in the moment, spot trouble before it happens, and generally be perceptive. It contrasts Investigate, which is for slow, deliberate observation. Notice stunts sharpen your senses, improve your reaction time, or make you harder to sneak up on.`,
  physique: `Raw power and durability. Physique stunts let you perform superhuman feats of strength, throw your weight around while wrestling, and shrug off physical consequences. In addition, a high Physique rating gives you more physical stress or consequence slots.`,
  provoke: `Ability to push people to act the way you want them to. It’s coarse and manipulative, not a positive interaction. Provoke stunts let you push opponents into foolhardy action, draw aggression toward you, or scare enemies (assuming they can feel fear).`,
  rapport: `Building connections with others and working together. Where Provoke is manipulation, Rapport is sincerity, trust, and goodwill. Rapport stunts let you sway the crowd, improve relationships, or build contacts.`,
  resources: `Access to material things, not just money or direct ownership. It might reflect your ability to borrow from friends or dip into an organization’s armory. Resources stunts let you use Resources in place of Rapport or Contacts or give you extra free invokes when you pay for the best.`,
  shoot: `All forms of ranged combat, whether guns, throwing knives, or bow and arrow. Shoot stunts let you make called shots, quick-draw, or always have a gun handy.`,
  stealth: `Staying unseen or unheard and escaping when you need to hide. Stealth stunts let you vanish in plain sight, blend into crowds, or advance through shadows unseen.`,
  will: `Mental fortitude, the ability to overcome temptation and to withstand trauma. Will stunts let you ignore mental consequences, withstand the mental agony of strange powers, and hold steady against enemies who provoke you. In addition, a high Will rating gives you more mental stress or consequence slots.`,
};
