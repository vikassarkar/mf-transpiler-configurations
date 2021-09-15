import fs from 'fs';
import inquirer from 'inquirer';
import fuzzy from 'fuzzy';

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

export const promtModuleToLoadInServer = async (folderSourcePath) => {
    let moduleName;
    const promptChoices = (subDirArr) => {
        const searchModules = (answers, input = '') => (
            new Promise((resolve) => {
                const fuzzyResult = fuzzy.filter(input, subDirArr);
                resolve(
                    fuzzyResult.map((el) => (
                        el.original
                    ))
                );
            })
        );
        const promptData = [{
            type: 'autocomplete',
            name: 'folder',
            message: 'Which view you want to run ? ',
            pageSize: 10,
            source: searchModules
        }];
        return promptData;
    };
    const allFoldersList = fs.readdirSync(folderSourcePath);
    console.log(allFoldersList);
    const folderList = allFoldersList.filter((subDir) => (!subDir.match('.js|.ts')));
    if (folderList.length > 0) {
        const answerSelected = await inquirer.prompt(promptChoices(folderList))
            .then((answer) => (
                answer
            )).catch((err) => {
                console.log(err);
                console.log('something wrong, please load from specific path.');
                console.log(`please run server from ${this.buildrc.appType} you want to load..`);
                return err;
            });
        moduleName = answerSelected.folder;
    }
    return moduleName;
};
