const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const webpack = require('webpack');
const chalk = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const openBrowser = require('react-dev-utils/openBrowser');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const { prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const paths = require('../configs/paths');

const env = require('../configs/.env');
const { rmDir, isDirEmpty } = require('./common');

const packageJSON = require(paths.packageJSON);
// ==========================================================
/**
 * Prepare what necessary stuff to build
 * @returns {Promise}
 */
function prepareToBuild() {
  return new Promise((resolve) => {
    const devMode = process.argv[2].split('=').includes('development');
    if (!devMode && fs.existsSync(paths.appDist)) {
      rmDir(paths.appDist);
    }
    resolve({ devMode });
  });
}

// ==========================================================
/**
 * Build webpack DLL bundle (common libs)
 * @returns {Promise}
 */
function buildVendors({ devMode }) {
  const jsonStr = JSON.stringify({
    dependencies: packageJSON.dependencies ? packageJSON.dependencies : null,
    devDependencies: packageJSON.devDependencies ? packageJSON.devDependencies : null,
  });
	// create md5 hash from a string
  const currentHash = crypto.createHash('md5').update(JSON.stringify(jsonStr)).digest('hex');

  let rebuildVendors = true;
  try {
    if (fs.existsSync(paths.HASH_FILE_PATH) && !isDirEmpty(paths.appDist)) {
      const prevHash = fs.readFileSync(paths.HASH_FILE_PATH, 'utf8');
      rebuildVendors = (prevHash !== currentHash);
    }
  } catch (err) {
    console.info(chalk.red('[ERR] read hash file.'));
    console.error(err);
    rebuildVendors = true;
  }

  return new Promise((resolve, reject) => {
    if (rebuildVendors) {
      console.info(chalk.gray('Rebuilding vendor dll...'));
      const webpackVendorCfg = require(paths.WEBPACK_VENDOR_CONFIG);
      webpack(webpackVendorCfg).run((err) => {
        if (err) {
          console.info(chalk.red('[ERR] build webpack vendor.\n'));
          reject(err);
        }
        fs.writeFileSync(paths.HASH_FILE_PATH, currentHash, 'utf-8');
        resolve({ devMode });
      });
    } else {
      console.info(chalk.gray('Reuse vendor dll...'));
      resolve({ devMode });
    }
  });
}

// ==========================================================
/**
 * Create webpack compiler and start dev server
 * @returns {Promise}
 */

function startDevServer({ devMode }) {
  return new Promise((resolve, reject) => {
    const protocol = env.HTTPS ? 'https' : 'http';
    const urls = prepareUrls(protocol, env.HOST, env.PORT);

    const devServerCfg = require(paths.DEV_SERVER_CONFIG);
    const webpackCfg = require(paths.WEBPACK_CONFIG)({ devMode });
    WebpackDevServer.addDevServerEntrypoints(webpackCfg, devServerCfg);
    const compiler = webpack(webpackCfg);
    const devServer = new WebpackDevServer(compiler, devServerCfg);
    devServer.listen(env.PORT, env.HOST, (err) => {
      if (err) {
        console.info(chalk.red('[ERR] failed to start dev server.\n'));
        reject(err);
      }
      // if (process.stdout.isTTY) {
      //   clearConsole();
      // }
      console.info(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);
      resolve();
    });

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig, () => {
        devServer.close();
        process.exit();
      });
    });
  });
}

// ==========================================================
/**
 * Creating application bundles
 * @returns {Promise}
 */
function buildClient({ devMode }) {
  return new Promise((resolve, reject) => {
    const webpackCfg = require(paths.WEBPACK_CONFIG)({ devMode });
    webpack(webpackCfg).run((err, stats) => {
      if (err) return reject(err);

      const messages = formatWebpackMessages(stats.toJson({}, true));
      if (messages.errors.length) {
				// Only keep the first error. Others are often indicative
				// of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }

      if (messages.warnings.length) {
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      return resolve({ stats });
    });
  });
}

function buildBaseOnEnv({ devMode }) {
  return devMode ? startDevServer({ devMode }) : buildClient({ devMode });
}

prepareToBuild()
	.then(buildVendors)
	.then(buildBaseOnEnv)
	.catch((err) => {
  console.info(chalk.red('Failed to compile.\n'));
  console.error(err);
  process.exit(1);
});
