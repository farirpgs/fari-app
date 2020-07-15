import { IPossibleTranslationKeys } from "../IPossibleTranslationKeys";

/*eslint quotes: ["error", "backtick"]*/
export const esTranslation: Record<
  IPossibleTranslationKeys,
  string | undefined
> = {
  "common.language.en": `Inglés`,
  "common.language.pt": `Portugués WIP`,
  "common.language.es": `Español`,
  "common.language.dev": `Desarrollo`,
  "menu.play": `Jugar`,
  "menu.dice": `Dados`,
  "menu.about": `Acerca de`,
  "menu.help": `Ayuda`,
  "home-route.meta.title": `Asistente para Fate RPG`,
  "home-route.meta.description": `Fari es la mejor aplicación de asistencia para Fate RPG. ¡Juega escenas en tiempo real con tus amigos, lanzad los dados FUDGE y dejad que vuestra imaginación colectiva corra libre, tejiendo historias memorables juntos!`,
  "home-route.welcome": `Bienvenido a Fari`,
  "home-route.subtitle1": `Fari es una Aplicación de Tablero Virtual cuidadosamente diseñada para jugar a Fate RPG (Core, Acelerado o Condensado).`,
  "home-route.subtitle2": `Facilita describir escenas, tener a la vista los personajes y sus puntos Fate, llevar registro de los aspectos y mucho más. Pensad en astutas soluciones para sacar a vuestros personajes de las precarias situaciones en las que los dados (o el Director de Juego) les haya puesto y ¡dejad que vuestra imaginación colectiva corra libre, tejiendo historias memorables juntos!`,
  "home-route.play-online.title": `Jugar a Fate Online`,
  "home-route.play-online.description": `Reúnete con tus amigos de forma remota usando vuestra plataforma de videochat favorita, envíales el enlace a la partida y ¡disfrutad jugando a Fate!`,
  "home-route.play-online.button": `Iniciar Partida Online`,
  "home-route.play-offline.title": `Jugar a Fate Offline`,
  "home-route.play-offline.description": `Reúnete con tus amigos en persona o por videollamada, comparte tu pantalla y ¡disfrutad jugando a Fate!`,
  "home-route.play-offline.button": `Iniciar Partida Offline`,
  "home-route.support-fari.title": `Considera Apoyar Fari`,
  "home-route.support-fari.description": `Fari es open-source y completamente gratuito. Creo en construir grandes programas y aplicaciones que beneficien a la comunidad. Sin embargo, la cosa se complica cuando se trata de mantener a los desarrolladores que hay detrás del proyecto. \n\n Mantener y desarrollar nuevas funciones de Fari cuesta una cantidad considerable de tiempo. Pero con tu ayuda económica, podría invertir más tiempo en Fari para hacerlo mejor, o usar la financiación para actualizar los servidores. \n\n Cualquier cantidad ayuda, pero si tu situación financiera te impide invertir en el proyecto, ¡siempre puedes ayudar corriendo la voz!`,
  "cookie-consent.description": `Este sitio web usa cookies para proporcionar una mejor experiencia de uso. Al usar Fari, acepta el uso de cookies.`,
  "cookie-consent.button": `Acepto`,
  "dice-route.meta.title": `Lanzar Dados Fate Online`,
  "dice-route.meta.description": `Lanza dados Fate/Fudge online usando este lanzador justo.`,
  "dice-route.title": `Presionar para volver a tirar`,
  "dice-route.button": `Lanzar`,
  "about-route.meta.title": `Acerca de`,
  "about-route.meta.description": `Fari es una aplicación de asistencia para Fate RPG creada por René-Pier Deshaies-Gélinas`,
  "changelog-route.meta.title": `Changelog`,
  "changelog-route.meta.description": `Changelog de Fari`,
  "play-route.play": `¡Jugar!`,
  "play-route.awesome-name": `Por cierto, ¡es un nombre genial!`,
  "play-route.join-error": `El juego al que intentas unirte no existe`,
  "play-route.leave-prompt": `¿Está seguro de que desea salir y resetear la escena?`,
  "play-route.add-character": `Añadir Personaje`,
  "play-route.character-name": `Nombre del Personaje:`,
  "play-route.cancel": `Cancelar`,
  "play-route.players": `Jugadores:`,
  "play-route.connected": `conectado`,
  "play-route.roll": `Lanzar`,
  "play-route.name": `Nombre`,
  "play-route.initiative-tracker": `Contador de Iniciativa`,
  "play-route.init": `Inic`,
  "play-route.fate-points": `Puntos Fate`,
  "play-route.fp": `P.F.`,
  "play-route.dice": `Dados`,
  "play-route.click-on-the-": `Pulse en el botón`,
  "play-route.click-on-the-add-aspect-": `Añadir Aspecto`,
  "play-route.click-on-the-add-aspect-button": `para añadir un nuevo Aspecto a la Escena`,
  "play-route.no-aspects": `Aún no hay aspectos en la escena`,
  "play-route.add-aspect": `Añadir Aspecto`,
  "play-route.add-boost": `Añadir Impulso`,
  "play-route.add-npc": `Añadir PnJ`,
  "play-route.add-bad-guy": `Añadir Adversario`,
  "play-route.add-index-card": `Añadir Tarjeta`,
  "play-route.copy-game-link": `Copiar enlace a la partida`,
  "play-route.sort": `Ordenar`,
  "play-route.reset-initiative": `Reiniciar`,
  "play-route.reset-scene": `Reiniciar Escena`,
  "play-route.reset-scene-confirmation": `¿Está seguro de que desea reiniciar la escena y eliminar todos los aspectos?`,
  "play-route.error.title": `Algo malo ha ocurrido.`,
  "play-route.error.description1": `No se ha podido conectar al servidor para inicializar la partida.`,
  "play-route.error.description2": `Intente refrescar la página para intentar resolver el problema. También puede iniciar una partida offline en su lugar.`,
  "play-route.connect-to-game": `Conectar a una partida.`,
  "play-route.or-pick-existing": `O seleccione un Personaje existente`,
  "play-route.clear-drawing": `Limpiar`,
  "play-route.undo-drawing": `Deshacer`,
  "index-card.add-1-free-invoke": `+ Invocación Gratuita`,
  "index-card.add-1-physical-stress-box": `+  Estrés Físico`,
  "index-card.add-1-mental-stress-box": `+  Estrés Mental`,
  "index-card.add-1-consequence": `+ Consecuencia`,
  "index-card.add-1-countdown": `+ Cuenta Atras`,
  "index-card.remove": `Quitar`,
  "index-card.reset": `Reiniciar`,
  "index-card.free-invokes": `Invocaciones Gratuitas`,
  "index-card.physical-stress": `Estrés Físico`,
  "index-card.mental-stress": `Estrés Mental`,
  "index-card.countdown": `Cuenta Atras`,
  "index-card.consequence": `Consecuencias`,
  "index-card.aspect": `Aspecto`,
  "index-card.boost": `Impulso`,
  "index-card.npc": `PnJ`,
  "index-card.bad-guy": `Adversario`,
  "player-row.remove-fate-point": `Quitar Punto Fate`,
  "player-row.add-fate-point": `Añadir Punto Fate`,
  "player-row.remove-character": `Quitar Personaje`,
  "player-row.fate-points": `Puntos Fate`,
  "player-row.played": `Ha jugado`,
  "player-row.not-played": `No ha jugado`,
  "menu.characters": `Personajes`,
  "characters-route.title": `Gestión de Personajes`,
  "characters-route.title-select": `Selecciona tu Personaje`,
  "characters-route.description": `...`,
  "characters-route.create-character": `Crear Personaje`,
  "characters-route.delete-character-confirmation": `¿Está seguro de que desea eliminar este personaje?`,
  "characters-route.character-type.core-condensed": `Core / Condensado`,
  "characters-route.character-type.accelerated": `Acelerado`,
  "characters-route.character-type.custom": `Personalizado`,
  "character-dialog.name": `Nombre`,
  "character-dialog.save": `Guardar`,
  "character-dialog.advanced": `Modo Avanzado`,
  "character-dialog.delete": `Borrar`,
  "character-dialog.aspects": `Aspectos`,
  "character-dialog.stress": `Estrés`,
  "character-dialog.consequences": `Consecuencias`,
  "character-dialog.stunts-extras": `Proezas y Extras`,
  "character-dialog.skills": `Habilidades`,
  "character-dialog.refresh": `Recuperación`,
  "character-dialog.close-confirmation": `¿Está seguro de que desea cerrar su hoja de personaje y perder todos los cambios?`,
};
