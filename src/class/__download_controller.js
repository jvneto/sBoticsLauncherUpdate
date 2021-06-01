var extend = require('extend-shallow');
var sBoticsDownloader = require('sbotics-downloader');
import { FindSync, FileSizeSync, SaveAsync } from '../utils/files-manager.js';
import { DetecOSFolder } from '../utils/application-manager.js';

const BlackList = [
  'sBotics/sBotics_Data/StreamingAssets/Skybox.json',
  'sBotics/sBotics_Data/StreamingAssets/skybox.jpg',
  'sBotics/sBotics_Data/StreamingAssets/robots.png',
  'sBotics/sBotics_Data/StreamingAssets/KeyBinding.json',
  'sBotics/sBotics_Data/StreamingAssets/ColorTheme.json',
  'sBotics/sBotics_Data/StreamingAssets/ColorTheme.json.zip',
  'sBotics/sBotics_Data/StreamingAssets/KeyBinding.json.zip',
  'sBotics/sBotics_Data/StreamingAssetsrobots.png.zip',
  'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/C#-en.json',
  'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/C#-pt_BR.json',
  'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/rEduc-en.json',
  'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/rEduc-pt_BR.json',
];

const __sBoticsDownloader = new sBoticsDownloader({
  user: 'sBotics',
  repository: 'sBoticsBuilds',
  branch: 'master',
  externalDownload: true,
  detailedAnswer: true,
});

const DataUpdate = (options) => {
  options = extend(
    {
      defaultOS: DetecOSFolder(),
    },
    options,
  );
  const defaultOS = options.defaultOS;
  return new Promise((resolve, reject) => {
    if (!defaultOS) return reject(false);
    __sBoticsDownloader.file(`${defaultOS}.json`, (err, resp) => {
      if (err) return reject(false);
      resolve(JSON.parse(resp.file));
    });
  });
};

const CheckUpdate = (options) => {
  options = extend(
    {
      path: '',
      name: '',
      size: '',
    },
    options,
  );

  const path = options.path;
  const name = options.name;
  const size = options.size;

  const pathDownload = `sBotics/${path + name}`;

  if (FindSync(pathDownload)) {
    if (FileSizeSync(pathDownload).size != size) {
      if (BlackList.indexOf(pathDownload) > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else {
    return false;
  }
};

const DownloadsUpdate = (options) => {
  options = extend(
    {
      path: '',
      name: '',
      prefix: '',
      size: '',
    },
    options,
  );

  const path = options.path;
  const name = options.name;
  const prefix = options.prefix;
  const size = options.size;

  if (!name || !prefix) return 'teste';

  const pathFile = prefix + path + name;

  return new Promise((resolve, reject) => {
    if (CheckUpdate({ path: path, name: name, size: size }))
      return resolve({ state: 'ok' });

    __sBoticsDownloader.file(
      pathFile,
      { savePath: `sBotics/${path + name}` },
      (err, resp) => {
        if (err) reject(false);
        SaveAsync(resp.path, resp.file)
          .then((resp) => resolve({ state: 'update' }))
          .catch((err) => reject({ state: 'false' }));
      },
    );
  });
};

export { DataUpdate, CheckUpdate, DownloadsUpdate };
