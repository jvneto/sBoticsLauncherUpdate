import { TitleBar, backdrop } from '../class/__interface_components.js';
import {
  DataUpdate,
  DownloadsUpdate,
  CheckUpdate,
  CheckAllUpdate,
} from '../class/__download_controller.js';
import { DetecOSFolder } from '../utils/application-manager.js';
import { Create, Update, Reset } from '../utils/progress-bar.js';
import { MagicButton } from '../utils/magic-button-manager.js';

// Interface Manager
$('.close-alert').click(function () {
  $('.top-alert').css('display', 'none');
});

$('.close-config').click(function () {
  $('.config-content').css('display', 'none');
});

const InterfaceLoad = async () => {
  await backdrop({ elementName: 'backdrop' });
};

// Download sBotics Manager
const DonwnloadsBotics = async (modeText = '') => {
  Reset();
  MagicButton({
    mode: 'process',
    text: modeText,
  });

  const dataUpdate = await DataUpdate();
  const dataUpdateLength = dataUpdate['data'].length;
  var filesID = dataUpdateLength + 1;
  var filesPast = 0;
  dataUpdate['data'].map((dataUpdate) => {
    const fileID = --filesID;
    Create({
      percentage: dataUpdateLength,
      sizeCreate: true,
      id: fileID,
      state: 'info',
      limit: dataUpdateLength,
    });

    DownloadsUpdate({
      path: dataUpdate.path,
      name: dataUpdate.name,
      size: dataUpdate.size,
      prefix: `${DetecOSFolder()}/`,
      id: fileID,
    })
      .then((resp) => {
        if (resp.state == 'ok') {
          Update({
            id: resp.id,
            addState: 'sbotics-okfiles',
            removeState: 'info',
          });
        } else if (resp.state == 'update') {
          console.log(dataUpdate.path + dataUpdate.name);
          Update({
            id: resp.id,
            addState: 'success',
            removeState: 'info',
          });
        } else {
          Update({
            id: resp.id,
            addState: 'danger',
            removeState: 'info',
          });
        }
      })
      .catch((err) => {
        Update({
          id: resp.id,
          addState: 'danger',
          removeState: 'info',
        });
      })
      .then(() => {
        filesPast = filesPast + 1;
        if (filesPast == dataUpdateLength)
          MagicButton({
            mode: 'start',
          });
      });
  });
};

const FilesVerification = async () => {
  MagicButton({
    mode: 'process',
    text: 'Procurando atualização! Aguarde...',
  });

  const dataUpdate = await DataUpdate();
  const checkAllUpdate = CheckAllUpdate({ dataUpdate: dataUpdate });

  const filesFind = checkAllUpdate.filesFind;
  const filesNotFind = checkAllUpdate.filesNotFind;
  const dataUpdateFiles = checkAllUpdate.dataUpdateFiles;

  if (filesFind == dataUpdateFiles) {
    MagicButton({
      mode: 'start',
    });
  } else {
    if (filesFind > 0) {
      MagicButton({
        mode: 'update',
      });
    } else {
      MagicButton({
        mode: 'install',
      });
    }
  }
};

$(document).ready(() => {
  InterfaceLoad();
  FilesVerification();
});
$(document).on('click', '#MagicButtonClick', () => {
  const mode = $('#MagicButtonClick').data('mode');
  const state = $('#MagicButtonClick').data('state');

  if (!state) return;

  switch (mode) {
    case 'install':
      DonwnloadsBotics('Instalando sBotics! Aguarde...');
      break;

    case 'update':
      DonwnloadsBotics('Atualizando o sBotics! Aguarde...');
      break;
    case 'start':
      break;
    default:
      break;
  }
});
