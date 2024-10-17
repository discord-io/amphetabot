import { resolve } from 'node:path';
import { JSONFileSyncPreset } from "lowdb/node";

const { DB_DIR } = process.env;
const getPath = filename => resolve(DB_DIR, filename);

export const tagsDB = JSONFileSyncPreset(getPath('tags.json'), {});
export const quotesDB = JSONFileSyncPreset(getPath('quotes.json'), {});
