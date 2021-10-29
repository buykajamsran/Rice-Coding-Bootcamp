const { opendir, stat, writeFile, appendFile } = require("fs").promises;

const getFolderNames = async (week) => {
  const ret = [];
  let path = `${__dirname}/01-class-content/${week}`;

  let subDirs = await opendir(path);
  let unitModules = [];
  for await (dirent of subDirs) {
    if(dirent.name[0] !== '.'){
        unitModules.push(dirent.name);
    }
  }
  unitModules = unitModules.sort();

  for await (dir of unitModules) {
    let path = `${__dirname}/01-class-content/${week}/${dir}`;
    let subDirs = await opendir(path);

    for await (dirent of subDirs) {
      if (dirent.name.toUpperCase().includes("MAIN")) {
        ret.push(`${dir}/${dirent.name}`);
      } else {
        try {
          const result = await stat(
            `${__dirname}/01-class-content/${week}/${dir}/${dirent.name}/Solved`
          );
          if (result.isDirectory()) {
            ret.push(`${dir}/${dirent.name}/Solved`);
          }
        } catch (err) {}
      }
    }
  }
  return ret;
};

const go = async () => {
  if (process.argv.length < 3)
    throw "Folder name is required as a CLI argument";
  const week = process.argv[2];

  let listOfFolders = await getFolderNames(week);
  listOfFolders = listOfFolders.sort();
  writeFile(`${__dirname}/01-class-content/${week}/.gitignore`, "");
  listOfFolders.forEach(async (dir) => {
    await appendFile(
      `${__dirname}/01-class-content/${week}/.gitignore`,
      dir + "\n"
    );
  });
};

go();
