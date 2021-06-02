var extend = require('extend-shallow');

const Modes = {
  start: {
    theme: 'bg-success text-white MagicButtonCenter',
    text: '<i class="far fa-play-circle iconMagicButton"></i> <span class="textoMagicButton">Iniciar</span>',
    state: true,
  },
  install: {
    theme: 'bg-primary text-white MagicButtonCenter',
    text: '<i class="fas fa-download iconMagicButton"></i> <span class="textoMagicButton">Instalar</span>',
    state: true,
  },
  update: {
    theme: 'bg-sbotics-info text-white MagicButtonCenter',
    text: '<i class="fas fa-download iconMagicButton"></i> <span class="textoMagicButton">Atualizar</span>',
    state: true,
  },
  process: {
    theme: 'bg-secondary text-white disabled',
    text: '',
    state: false,
  },
  repair_installation: {
    theme: 'bg-danger text-white MagicButtonCenter',
    text: '<i class="fas fa-tools iconMagicButton"></i> <span class="textoMagicButton">Reparar Instalação</span>',
    state: true,
  },
};

const MagicButton = (options) => {
  options = extend(
    {
      mode: '',
      defaultModes: Modes,
      elementContent: 'MagicButtonContent',
      elementButton: 'MagicButton',
      text: '',
    },
    options,
  );

  const mode = options.mode;
  const elementContent = options.elementContent;
  const defaultModes = options.defaultModes[mode];
  const text = options.text;

  if (!mode) return false;

  const textButton = !text ? defaultModes.text : text;
  document.getElementById(
    elementContent,
  ).innerHTML = `<button id="MagicButtonClick" data-mode=${mode} data-state=${defaultModes.state} class="w-100 btn ${defaultModes.theme}">${textButton}</button>`;
};
export { MagicButton };
