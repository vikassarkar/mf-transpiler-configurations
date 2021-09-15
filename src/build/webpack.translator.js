import path from 'path';
import fs from 'fs';

const PLUGIN_NAME = 'MergeTranslatorPlugin';
const defaultOptions = {
    srcPath: null,
    fileName: '',
    outFileName: ''
};

export class MergeTranslatorPlugin {
    constructor(options) {
        this.options = { ...defaultOptions, ...options };
    }

    async processJson(compiler, compilation, logger) {
        const translatorContent = {};
        const { sources: { RawSource } } = compiler.webpack;
        const { srcPath, fileName, outFileName } = this.options;
        fs.readdirSync(srcPath).map((dir) => {
            const translatorFolderPath = path.join(srcPath, dir);
            if (fs.statSync(translatorFolderPath).isDirectory()) {
                const dirNameArr = dir.split('-');
                const translatorPath = path.join(translatorFolderPath, fileName);
                const translatorJson = JSON.parse(fs.readFileSync(translatorPath, 'utf8'));
                const availableLanguages = Object.keys(translatorJson);
                const firstLanguage = availableLanguages[0];
                const translatorJsonSlice = translatorJson[firstLanguage].slice_name;
                dirNameArr.pop();
                const translatorName = translatorJsonSlice ? translatorJsonSlice.id : dirNameArr.join('_');
                translatorContent[translatorName] = translatorJson;
            }
            return true;
        });
        compilation.emitAsset(outFileName, new RawSource(JSON.stringify(translatorContent)));
        logger.info(`Translator files written to: ${outFileName}`);
    }

    apply(compiler) {
        const { Compilation } = compiler.webpack;
        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
            compilation.hooks.processAssets.tapPromise({
                name: PLUGIN_NAME,
                stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
            },
                async () => {
                    try {
                        const logger = compilation.getLogger(PLUGIN_NAME);
                        logger.debug('Merging translator files.');
                        await this.processJson(compiler, compilation, logger);
                    } catch (err) {
                        compilation.errors.push(err);
                    }
                });
        });
    }
}
