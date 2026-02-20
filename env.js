import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

process.loadEnvFile(resolve(dirname(fileURLToPath(import.meta.url)), '.env'));
