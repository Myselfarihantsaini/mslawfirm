import Database from 'better-sqlite3';
import {mkdirSync} from 'node:fs';
mkdirSync('data',{recursive:true});
const db=new Database('data/chambers.sqlite');db.pragma('journal_mode = WAL');
db.exec('CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, body TEXT NOT NULL); CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, body TEXT NOT NULL)');
export function list(table){return db.prepare(`SELECT body FROM ${table==='posts'?'posts':'enquiries'} ORDER BY rowid DESC`).all().map(r=>JSON.parse(r.body))}
export function save(table,value){db.prepare(`INSERT OR REPLACE INTO ${table==='posts'?'posts':'enquiries'} (id,body) VALUES (?,?)`).run(value.id,JSON.stringify(value))}
