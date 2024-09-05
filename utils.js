import {Platform} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';

const {fs} = RNFetchBlob;

const FILE_EXTENSION_PATTERN = /\.\w{3,4}(?=([\?#&].*$|$))/gim;

const sanitizeDirectory = directory =>
  directory?.replace?.(/\/$/, '')?.replace?.('file://', '');

export const getDownloadDirectory = () => {
  return sanitizeDirectory(fs.dirs.DownloadDir);
};

export const getFileNameFromUrl = url => {
  const randomFileName = Math.random().toString(36).substr(2, 12);
  if (!url) {
    return randomFileName;
  }
  let splittedUrlPayload = url.split('/');
  const fileNameWithMime = splittedUrlPayload[splittedUrlPayload.length - 1];
  splittedUrlPayload = fileNameWithMime.split('.');
  const fileName = splittedUrlPayload[0];
  return fileName || randomFileName;
};

export const getMimeTypeFromUrl = url => {
  if (!url) {
    return '';
  }

  const decodedUrl = decodeURIComponent(url);

  // This can give mimetype even if the url has query params or hash after the url
  const mimeTypeWithDot = decodedUrl.match(FILE_EXTENSION_PATTERN)?.[0] || '';
  return mimeTypeWithDot?.substring(1)?.toLowerCase?.();
};

const downloadDocumentForAndroid = ({
  url,
  filePath,
  mimeType,
  onProgress = () => {},
  headers = {},
}) => {
  return RNFetchBlob.config({
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: false,
      mime: mimeType,
      path: filePath,
    },
    fileCache: true,
    appendExt: getMimeTypeFromUrl(filePath),
  })
    .fetch('GET', url, headers)
    .progress({count: 5}, (received, total) => {
      onProgress(received / total);
    })
    .then(res => {
      const path = res.path();
      return path;
    })
    .catch(error => Promise.reject(error));
};

export const downloadFile = ({
  url,
  mimeType,
  filePath,
  onProgress = () => {},
  silent = false,
  headers = {},
}) => {
  if (silent) {
    return RNFetchBlob.config({path: filePath})
      .fetch('GET', url, headers)
      .then(res => {
        if (Math.floor(res?.respInfo?.status / 100) !== 2) {
          throw new Error('Failed to successfully download file');
        }
        return filePath;
      });
  }

  if (Platform.OS === 'android') {
    return downloadDocumentForAndroid({
      url,
      mimeType,
      filePath,
      onProgress,
      headers,
    });
  }
};
