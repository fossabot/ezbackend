import chalk from "chalk";
import { ProjectType } from "./project-types";
import { isEzbInstalled } from "./detect";
import { readPackageJson } from "./js-package-manager";
import { JsPackageManagerFactory } from "./js-package-manager/JsPackageManagerFactory";
import { paddedLog } from "./helpers";
import { commandLog } from "./helpers";
import path from 'path'
import fs from 'fs'
import defaultGenerator from './generators/DEFAULT'


//TODO: Seperate the cli from the server to reduce load time
const logger = console;

export type initiateOptions = {
  force?: boolean,
  dir: string,
  install? :boolean
}

export default function initiate(dir: string, options: initiateOptions, pkg: any) {
  console.log(options)
  const welcomeMessage =
    "EzBackend - An extensible backend optimised for the developer experience";
  logger.log(chalk.inverse(`\n ${welcomeMessage} \n`));

  let projectType;

  const ezbInstalled = isEzbInstalled(readPackageJson(), options.force);
  projectType = ezbInstalled
    ? ProjectType.ALREADY_HAS_EZB
    : ProjectType.DEFAULT;

  const installPath = path.resolve(process.cwd(), dir)

  if (installPath !== process.cwd()) {
    try {
      fs.mkdirSync(dir)
    } catch (e: any) {
      if (e.code === 'EEXIST') {
        throw new Error(
          `Folder "${dir}" already exists.` +
          `The directory "${dir}" needs to be non-existent for ezbackend to create a project there.` +
          `Use with caution: rmdir ${dir}`
        )
      }
    }
  }
  process.chdir(installPath)

  return installEzb(projectType,options);
}

const installEzb = (projectType: ProjectType,options:initiateOptions) => {

  const packageManager = JsPackageManagerFactory.getPackageManager()

  const runGenerator: () => Promise<void> = () => {
    switch (projectType) {
      case ProjectType.ALREADY_HAS_EZB:
        logger.log();
        paddedLog("EzBackend seems to already be available in this project. You can override this with the -f flag");
        logger.log();
        return Promise.resolve();
      case ProjectType.DEFAULT:
        return defaultGenerator(packageManager,options).then(
          commandLog("Adding EzBackend to your app")
        );
      default:
        paddedLog(
          `We could not detect your project type. (code: ${projectType})`
        );
        return Promise.resolve()
    }
  };

  return runGenerator().catch((ex) => {
    logger.error(`\n     ${chalk.red(ex.stack)}`);
    process.exit(1);
  });
};
