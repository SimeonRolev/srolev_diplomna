var sqlite3 = require('sqlite3').verbose();
const path = require('path');

let database = new sqlite3.Database(
    path.resolve(__dirname, '../../database.db'),
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chinook database.');
});


const createTables = function () {
    database.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY)`)
    database.run(`
        CREATE TABLE IF NOT EXISTS translation (
            id INTEGER PRIMARY KEY,
            user INTEGER,
            word STRING NOT NULL,
            trans STRING NOT NULL,
            language_from STRING NOT NULL,
            language_to STRING NOT NULL,
            last_revision DATE,
            FOREIGN KEY(user) REFERENCES users(id)
            UNIQUE(word, language_from, language_to)
            ON CONFLICT REPLACE
        )
    `)
    database.run(`
        CREATE TABLE IF NOT EXISTS context (
            id INTEGER PRIMARY KEY,
            translation INTEGER NOT NULL,
            entry STRING NOT NULL UNIQUE,
            url STRING NOT NULL,
            FOREIGN KEY(translation) REFERENCES translation(id)
        )
    `)

    database.run(`
        INSERT OR REPLACE INTO users (id) VALUES (1)
    `)
}

const getWords = function (userId=1) {
    return new Promise((resolve, reject) => {
        database.all(
            `SELECT * FROM translation WHERE user=1`,
            [], (err, rows) => {
            if (err) {
                reject(err);
                throw err;
            }
            resolve(rows);
        })
    });
}

const getContexts = function ({ translationId }) {
    return new Promise((resolve, reject) => {
        database.all(
            `SELECT translation.id, word, translation, entry, url, trans FROM context
            LEFT OUTER JOIN translation
            ON context.translation = translation.id
            WHERE translation=${parseInt(translationId)}`,
            [], (err, rows) => {
            if (err) {
                reject(err);
                throw err;
            }
            resolve(rows);
        })
    });
}

const saveContext = function ({translationId, entry, url}) {
    database.run(`
        INSERT OR REPLACE INTO context (
            translation,
            entry,
            url
        ) VALUES (
            ${translationId},
            "${entry}",
            "${url}"
        );  
    `)    
}

const saveTranslation = function ({userId, word, trans, from, to, context, url}) {
    
    console.log(userId, word, trans, from, to, context, url)
    database.run(`
        INSERT OR REPLACE INTO translation (
            user,
            word,
            trans,
            language_from,
            language_to
        ) VALUES (
            ${userId},
            "${word}",
            "${trans}",
            "${from}",
            "${to}"
        );
    `, [], function (err) {
        if (context) {
            saveContext({
                translationId: this.lastID,
                entry: context,
                url: url
            });
        }
    })
    return new Promise();
}

const updateTranslation = function ({wordId, trans}) {
    database.run(`
        UPDATE translation SET trans="${trans}" WHERE id=${parseInt(wordId)}
    `)
}

createTables();

module.exports = {
    createTables,
    getWords,
    getContexts,
    saveContext,
    saveTranslation,
    updateTranslation
}