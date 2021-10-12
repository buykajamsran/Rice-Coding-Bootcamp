const fs = require('fs');

if (process.argv.length < 3) throw 'Folder name is required as a CLI argument';
const week = process.argv[2];

if (week) {
    const path = `${__dirname}/01-class-content/${week}/01-Activities`;
    readActivities(path).catch(console.error);
}

async function readActivities(path) {
    const dir = await fs.promises.opendir(path);
    const activities = [];
    const ignore = ['.gitignore-cl', '.gitignore', '.DS_Store', '.gitkeep'];

    for await (dirent of dir) {
        if (!ignore.includes(dirent.name)) activities.push(dirent.name);
    }

    const filePaths = [];
    for await (activity of activities) {
        const childDir = await fs.promises.opendir(`${path}/${activity}`);
        filePaths.push(activity);
        for await (dirent of childDir) {
            if (
                dirent.isDirectory() &&
                dirent.name.toLowerCase() !== 'unsolved'
            ) {
                filePaths.push(`${activity}/${dirent.name}`);
            }
        }
    }

    console.log(filePaths);

    fs.writeFile(`${path}/.gitignore`, filePaths.sort().join('\n'), function (
        err
    ) {
        console.log('check file');
        console.log(err);
    });
}
