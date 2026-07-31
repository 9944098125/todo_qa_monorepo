import chalk from 'chalk';

export const logger = {
  info: (msg: string) => console.log(chalk.blue('ℹ'), msg),
  success: (msg: string) => console.log(chalk.green('✔'), msg),
  warn: (msg: string) => console.log(chalk.yellow('⚠'), msg),
  error: (msg: string) => console.log(chalk.red('✖'), chalk.red(msg)),
  debug: (msg: string, verbose: boolean = false) => {
    if (verbose) {
      console.log(chalk.gray('🔍'), chalk.gray(msg));
    }
  },
};
