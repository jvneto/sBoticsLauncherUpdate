import {
  TitleBar,
  backdrop,
  TextVersion,
} from '../class/__interface_components.js';
import { Create, Update } from '../utils/progress-bar.js';
import {
  URLdictionary,
  ValidateConnection,
  UserData,
} from '../utils/connection-manager.js';
import { OpenConfig } from '../class/__file_config.js';
import { CreateUserFile, OpenUserFile } from '../class/__file_user.js';
import { LanguageInit } from '../utils/language-manager.js';
import { asyncWait } from '../utils/wait-manager.js';
import {
  UpdateInit,
  UpdateAvailable,
  UpdateInstall,
} from '../utils/autoupdate-manager.js';
import { SLMP } from '../utils/application-manager.js';
import { LoadClose, LoginOpen, IndexOpen } from '../utils/window-manager.js';
const { ipcRenderer } = require('electron');

var donwloadStateInit = false;
var donwloadStateCallback = true;

const InterfaceLoad = async () => {
  await TitleBar();
  await backdrop({
    elementName: 'backdrop',
  });
  await TextVersion({ elementName: 'TextVersion' });
  Create({
    percentage: 2,
    id: 'LoadBar',
    text: [
      {
        textContainer: 'TextProgress',
        message:
          '<i class="fas fa-rocket text-rainbow"></i> <span style="margin-left: 13px">Esquentando motores! Aguarde...</span>',
      },
    ],
  });
};

const init = async () => {
  await asyncWait(900);

  Update({
    id: 'LoadBar',
    addState: 'info',
    percentage: 7,
    text: [
      {
        textContainer: 'TextProgress',
        message:
          '<i class="fas fa-wifi text-info"></i> <span style="margin-left: 13px">Verificando Conexão com a internet. Aguarde! </span>',
      },
    ],
  });

  await asyncWait(600);

  try {
    if (await ValidateConnection({ url: URLdictionary['GitHub'] }))
      Update({
        id: 'LoadBar',
        addState: 'success',
        removeState: 'info',
        percentage: 15,
        text: [
          {
            textContainer: 'TextProgress',
            message:
              '<i class="fas fa-wifi text-success"></i> <strong style="margin-left: 13px"> Conectado na Internet</strong>',
          },
        ],
      });
  } catch (error) {
    return Update({
      id: 'LoadBar',
      addState: 'danger',
      percentage: 100,
      text: [
        {
          textContainer: 'TextProgress',
          message:
            '<i class="fas fa-wifi text-danger"></i> <strong style="margin-left: 13px"> Sem conexão com a internet! </strong> Verifique sua conexão com a internet',
        },
      ],
    });
  }

  await asyncWait(600);

  Update({
    id: 'LoadBar',
    addState: 'info',
    percentage: 25,
    text: [
      {
        textContainer: 'TextProgress',
        message:
          '<i class="fas fa-wifi text-info"></i> <span style="margin-left: 13px">Verificando Conexão com nossos servidores. Aguarde! </span>',
      },
    ],
  });

  await asyncWait(600);

  try {
    if (await ValidateConnection({ url: URLdictionary['wEduc'] }))
      Update({
        id: 'LoadBar',
        addState: 'success',
        removeState: 'info',
        percentage: 35,
        text: [
          {
            textContainer: 'TextProgress',
            message:
              '<i class="fas fa-wifi text-success"></i> <strong style="margin-left: 13px">Conectado em nossos servidores.</strong>',
          },
        ],
      });
  } catch (error) {
    return Update({
      id: 'LoadBar',
      addState: 'danger',
      percentage: 100,
      text: [
        {
          textContainer: 'TextProgress',
          message:
            '<i class="fas fa-wifi text-danger"></i> <strong style="margin-left: 13px"> Não foi possivel se conectar a nossos servidores! </strong> Tente novamente mais tarde.',
        },
      ],
    });
  }

  await asyncWait(600);

  Update({
    id: 'LoadBar',
    addState: 'info',
    percentage: 45,
    text: [
      {
        textContainer: 'TextProgress',
        message:
          '<i class="fas fa-file-archive text-info"></i> <span style="margin-left: 13px">Procurando atualização do sBotics Launcher. Aguarde!</span>',
      },
    ],
  });

  try {
    if (UpdateInit()) {
      await asyncWait(600);
      const updateAvailable = await UpdateAvailable;
      if (updateAvailable['state']) {
        Update({
          id: 'LoadBar',
          addState: 'info',
          percentage: 55,
          text: [
            {
              textContainer: 'TextProgress',
              message:
                '<i class="fas fa-file-archive text-info"></i> <strong style="margin-left: 13px">Atualização disponivel, fazendo download! Aguarde...</strong>',
            },
          ],
        });
        return (donwloadStateInit = true);
      } else {
        Update({
          id: 'LoadBar',
          addState: 'success',
          removeState: 'info',
          percentage: 55,
          text: [
            {
              textContainer: 'TextProgress',
              message:
                '<i class="fas fa-file-archive text-success"></i> <strong style="margin-left: 13px">sBotics Launcher esta na ultima versão disponivel!</strong>',
            },
          ],
        });
      }
    } else if (!SLMP()) {
      return Update({
        id: 'LoadBar',
        addState: 'danger',
        removeState: 'info',
        percentage: 100,
        text: [
          {
            textContainer: 'TextProgress',
            message:
              '<i class="fas fa-file-archive text-danger"></i> <strong style="margin-left: 13px">Falha!</strong> Não foi possivel procurar atualização. Tente novamente mais tarde!',
          },
        ],
      });
    }
  } catch (error) {
    return Update({
      id: 'LoadBar',
      addState: 'danger',
      removeState: 'info',
      percentage: 100,
      text: [
        {
          textContainer: 'TextProgress',
          message:
            '<i class="fas fa-dumpster-fire text-danger"></i> <strong style="margin-left: 5px; margin-right: 13px;">[LauncherProtection]</strong> A procura de atualização foi abortada, por conta de uma falha localizada!',
        },
      ],
    });
  }

  if (!donwloadStateInit) {
    await asyncWait(500);

    Update({
      id: 'LoadBar',
      addState: 'info',
      percentage: 80,
      text: [
        {
          textContainer: 'TextProgress',
          message:
            '<i class="fas fa-file-archive text-info"></i> <span style="margin-left: 13px">Procurando e carregando seus dados. Aguarde!</span>',
        },
      ],
    });
    var userdata = OpenUserFile();
    if (!userdata) {
      await asyncWait(200);
      Update({
        id: 'LoadBar',
        addState: 'danger',
        percentage: 100,
        text: [
          {
            textContainer: 'TextProgress',
            message:
              '<i class="fas fa-user-circle text-danger"></i> <strong style="margin-left: 13px">Falha Detectada!</strong> Ao tentar localizar dados do usuário uma falha foi localizada! Aguarde tentando resolver!',
          },
        ],
      });
      if (CreateUserFile()) {
        Update({
          id: 'LoadBar',
          addState: 'info',
          removeState: 'danger',
          percentage: 100,
          text: [
            {
              textContainer: 'TextProgress',
              message:
                '<i class="fas fa-user-circle text-info"></i> <span style="margin-left: 13px">Resolvido mais o login é necessario!</span>',
            },
          ],
        });
        await asyncWait(200);
        return console.log('LoginUser');
      } else {
        await asyncWait(200);
        return Update({
          id: 'LoadBar',
          addState: 'danger',
          removeState: 'info',
          percentage: 100,
          text: [
            {
              textContainer: 'TextProgress',
              message:
                '<i class="fas fa-dumpster-fire text-danger"></i> <strong style="margin-left: 5px; margin-right: 13px;">[LauncherProtection]</strong> Não foi possível corrigir a falha localizada.',
            },
          ],
        });
      }
    }
    await asyncWait(200);
    if (
      userdata['name'] &&
      userdata['email'] &&
      userdata['accessToken'] &&
      userdata['logged']
    ) {
      await asyncWait(200);
      const access_token = userdata['accessToken'];
      UserData({
        accessToken: access_token,
      })
        .then((response) => {
          Update({
            id: 'LoadBar',
            addState: 'success',
            removeState: 'info',
            percentage: 100,
            text: [
              {
                textContainer: 'TextProgress',
                message:
                  '<i class="fas fa-user-circle text-success"></i> <span style="margin-left: 13px">Sucesso! Abrindo sBotics Launcher</span>',
              },
            ],
          });

          IndexOpen();
          LoadClose();
        })
        .catch((err) => {
          Update({
            id: 'LoadBar',
            addState: 'info',
            percentage: 100,
            text: [
              {
                textContainer: 'TextProgress',
                message:
                  '<i class="fas fa-user-circle text-info"></i> <span style="margin-left: 13px">O login é necessario!</span>',
              },
            ],
          });
          LoginOpen();
          LoadClose();
        });
    } else {
      Update({
        id: 'LoadBar',
        addState: 'info',
        percentage: 100,
        text: [
          {
            textContainer: 'TextProgress',
            message:
              '<i class="fas fa-user-circle text-info"></i> <span style="margin-left: 13px">O login é necessario!</span>',
          },
        ],
      });
      await asyncWait(200);
      LoginOpen();
      LoadClose();
    }
  }
};

$(document).ready(() => {
  InterfaceLoad();
  LanguageInit(OpenConfig());
  init();
});

ipcRenderer.on('update-download-progress', (event, arg) => {
  const percentage =
    arg['progress']['percent'] == 100 && donwloadStateCallback
      ? 1
      : arg['progress']['percent'];
  donwloadStateCallback = false;
  if (donwloadStateInit)
    Update({
      id: 'LoadBar',
      addState: 'success',
      removeState: 'info',
      percentage: percentage,
      text: [
        {
          textContainer: 'TextProgress',
          message:
            '<i class="fas fa-file-archive text-success"></i> <strong style="margin-left: 13px">Atualização disponivel, fazendo download! Aguarde...</strong>',
        },
      ],
    });
});

ipcRenderer.on('update-downloaded', (event, arg) => {
  (async () => {
    Update({
      id: 'LoadBar',
      addState: 'success',
      removeState: 'info',
      percentage: 100,
      text: [
        {
          textContainer: 'TextProgress',
          message:
            '<i class="fas fa-redo-alt text-success"></i> <strong style="margin-left: 13px">Reiniciando para finalizar atualização...</strong>',
        },
      ],
    });
    await asyncWait(300);
    UpdateInstall();
  })();
});
