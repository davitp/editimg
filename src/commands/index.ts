import { version, name } from '../../package.json';
import { createCommand } from 'commander';
import splitCommand from './split';

const program = createCommand();

program
  .name("editimg")
  .description('A simple CLI tool to edit images')
  .version(version, '-v, --version')
  .enablePositionalOptions();

program.addCommand(splitCommand);


export default program;

