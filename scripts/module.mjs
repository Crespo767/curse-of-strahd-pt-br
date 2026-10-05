const MODULE_ID = "curse-of-strahd-pt-br";
const PACKS = ["cenas", "atores", "itens", "tabelas"];

Hooks.once("ready", async () => {
  if (!game.user?.isGM) return;

  try {
    for (const name of PACKS) {
      const pack = game.packs.get(`${MODULE_ID}.${name}`);
      if (pack?.locked) {
        await pack.configure({ locked: false }).catch(err => {
          console.warn(`${MODULE_ID} | Não foi possível desbloquear ${name}:`, err);
        });
      }
    }
  } catch (err) {
    console.warn(`${MODULE_ID} | Erro na configuração de pacotes:`, err);
  }

  try {
    const setting = game.settings.get("dnd5e", "packSourceConfiguration");
    if (setting) {
      const sourceConfiguration = { ...setting };
      let changed = false;
      for (const name of ["atores", "itens"]) {
        const collection = `${MODULE_ID}.${name}`;
        if (sourceConfiguration[collection] === false) {
          sourceConfiguration[collection] = true;
          changed = true;
        }
      }
      if (changed) {
        await game.settings.set("dnd5e", "packSourceConfiguration", sourceConfiguration).catch(err => {
          console.warn(`${MODULE_ID} | Erro ao salvar packSourceConfiguration:`, err);
        });
      }
    }
  } catch (err) {
    console.warn(`${MODULE_ID} | Erro ao acessar packSourceConfiguration:`, err);
  }
});
