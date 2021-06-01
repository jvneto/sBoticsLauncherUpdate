import { TitleBar, backdrop } from '../class/__interface_components.js';
import {
  DataUpdate,
  DownloadsUpdate,
  CheckUpdate,
} from '../class/__download_controller.js';
import { DetecOSFolder } from '../utils/application-manager.js';
import { Create } from '../utils/progress-bar.js';

// Interface Manager
$('.close-alert').click(function () {
  $('.top-alert').css('display', 'none');
});

$('.close-config').click(function () {
  $('.config-content').css('display', 'none');
});

const InterfaceLoad = async () => {
  // await TitleBar();
  await backdrop({ elementName: 'backdrop' });
};

// Download sBotics Manager
const DonwnloadsBotics = async () => {
  const dataUpdate = await DataUpdate();
  const dataUpdateLength = dataUpdate.length;
  dataUpdate['data'].forEach((element) => {
    DownloadsUpdate({
      path: element.path,
      name: element.name,
      size: element.size,
      prefix: `${DetecOSFolder()}/`,
    })
      .then((resp) => {
        if (resp['state'] == 'update') {
          Create({
            percentage: 1,
            sizeCreate: true,
            id: '1',
            state: true,
            limit: 100,
          });
        }
      })
      .catch((err) => console.log('Desatualizado'));
  });
};

$(document).ready(() => {
  InterfaceLoad();
  DonwnloadsBotics();
});
