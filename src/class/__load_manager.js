import { TitleBar, backdrop } from '../class/__interface_components.js';
import { Create, Update } from '../utils/progress-bar.js';
import {
  URLdictionary,
  ValidateConnection,
} from '../utils/validate-connection.js';
import { OpenConfig } from '../class/__file_config.js';
import {
  CreateUserFile,
  OpenUserFile,
  UpdateUserFile,
} from '../class/__file_user.js';
import { LanguageInit, Lang } from '../utils/language-manager.js';
import { syncWait, asyncWait } from '../utils/wait-manager.js';
import {
  UpdateInit,
  UpdateAvailable,
  UpdateNotAvailable,
} from '../utils/autoupdate-manager.js';
import { SLMP } from '../utils/application-manager.js';

const InterfaceLoad = async () => {
  await TitleBar();
  await backdrop({
    elementName: 'backdrop',
  });
  Create({
    percentage: 2,
    id: 'LoadBar',
    text: [{ textContainer: 'TextProgress', message: 'Inicializando...' }],
  });
};

const init = async () => {
  // Verificar versão do launcher -> Auto Updatew
  // Verifica se os dados do user existe
  await asyncWait(800);

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

  await asyncWait(800);

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

  await asyncWait(800);

  try {
    Update({
      id: 'LoadBar',
      addState: 'info',
      percentage: 20,
      text: [
        {
          textContainer: 'TextProgress',
          message:
            '<i class="fas fa-file-archive text-info"></i> <span style="margin-left: 13px">Procurando atualização do sBotics Launcher. Aguarde!</span>',
        },
      ],
    });

    if (UpdateInit()) {
      await asyncWait(800);
      const UpdateAvailable = await UpdateAvailable;
      const UpdateNotAvailable = await UpdateNotAvailable;

      if (UpdateAvailable['state']) {
        Update({
          id: 'LoadBar',
          addState: 'success',
          removeState: 'info',
          percentage: 25,
          text: [
            {
              textContainer: 'TextProgress',
              message:
                '<i class="fas fa-file-archive text-info"></i> <strong style="margin-left: 13px">Atualização disponivel, fazendo download! Aguarde...</strong>',
            },
          ],
        });
      }
      if (UpdateNotAvailable['state']) {

        Update({
          id: 'LoadBar',
          addState: 'success',
          removeState: 'info',
          percentage: 25,
          text: [
            {
              textContainer: 'TextProgress',
              message:
                '<i class="fas fa-file-archive text-info"></i> <strong style="margin-left: 13px">sBotics Launcher esta na ultima versão disponivel!</strong>',
            },
          ],
        });

      }
    } else if (!SLMP())
      return Update({
        id: 'LoadBar',
        addState: 'danger',
        percentage: 100,
        text: [
          {
            textContainer: 'TextProgress',
            message:
              '<i class="fas fa-file-archive text-danger"></i> <strong style="margin-left: 13px">Falha!</strong> Não foi possivel procurar atualização. Tente novamente mais tarde!',
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
            '<i class="fas fa-dumpster-fire text-danger"></i> <strong style="margin-left: 5px; margin-right: 13px;">[LauncherProtection]</strong> A procura de atualização foi abortada, por conta de uma falha localizada!',
        },
      ],
    });
  }
};

$(document).ready(() => {
  InterfaceLoad();
  LanguageInit(OpenConfig());
  init();
  // init();
  // (async () => {
  //   try {
  //     console.log(
  //       await ValidasdasdateConnection({ url: URLdictionary['sBotics'] }),
  //     );
  //   } catch (error) {
  //     throw new Error('Aconteceu um erro');
  //   }
  //   console.log('Aqui');
  // })();

  // console.log(CreateConfig());
  // console.log(
  //   UpdateConfig({ data: { language: 'pt-BR', user: 'juliocesar' } }),
  // );
});
