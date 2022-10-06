import fs from 'fs';

export async function renameFile(
  oldFilename: string,
  newFilename: string,
  errorMessage = 'File system error: Error renaming'
) {
  return new Promise((resolve, reject) => {
    fs.rename(oldFilename, newFilename, err => {
      if (err) {
        reject({ error: err, message: errorMessage });
      } else {
        resolve({ error: false });
      }
    });
  });
}

export async function listDir(
  pathToDirectory: string,
  errorMessage = 'File system error: Error listing content'
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(pathToDirectory, (err, files) => {
      if (err) {
        reject({ error: err, message: errorMessage });
      } else {
        resolve(files);
      }
    });
  });
}

export async function createDirectory(
  pathToDirectory: string,
  errorMessage = 'File system error: Error creating directory'
) {
  return new Promise((resolve, reject) => {
    fs.mkdir(pathToDirectory, err => {
      if (err) {
        reject({ error: err, message: errorMessage });
      } else {
        resolve({ error: false });
      }
    });
  });
}

export async function deleteDirectory(pathToDirectory: string) {
  return new Promise((resolve, reject) => {
    fs.rm(pathToDirectory, { recursive: true }, err => {
      if (err) {
        reject({ error: err, message: 'Error deleting directory' });
      } else {
        resolve({ error: false });
      }
    });
  });
}

export async function readFile(
  filePath: string,
  errorMessage = 'File system error: Error reading file'
) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, fileContent) => {
      if (err) {
        reject({ error: err, message: errorMessage });
      } else {
        resolve(fileContent);
      }
    });
  });
}

export async function appendFile(
  filePath: string,
  fileData: string,
  errorMessage = 'File system error: Error writing file'
) {
  return new Promise((resolve, reject) => {
    fs.appendFile(filePath, fileData, err => {
      if (err) {
        reject({ error: err, message: errorMessage });
      } else {
        resolve({ error: false });
      }
    });
  });
}

export async function deleteFile(
  filePath: string,
  errorMessage = 'File system error: Error deleting file'
) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, err => {
      if (err) {
        reject({ error: err, message: errorMessage });
      } else {
        resolve({ error: false });
      }
    });
  });
}

export async function deleteFiles(
  filePaths: string[],
  errorMessage = 'File system error: Error deleting file'
) {
  return new Promise(async (resolve, reject) => {
    let promises = [];
    for (let path of filePaths) {
      promises.push(
        fs.unlink(path, err => {
          if (err) {
            reject({ error: err, message: errorMessage });
          }
        })
      );
    }
    await Promise.all(promises);
    resolve({ error: false });
  });
}
