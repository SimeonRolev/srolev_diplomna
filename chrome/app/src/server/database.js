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
            UNIQUE(translation, entry)
            ON CONFLICT REPLACE
        )
    `)

    // Create a demo user
    database.run(`
        INSERT OR REPLACE INTO users (id) VALUES (1)
    `)
}


const userId = 1;

const translations = {
    getAll: function () {
        return new Promise((resolve, reject) => {
            database.all(`
                SELECT *
                FROM translation
                WHERE user=${userId}
            `, [], (err, rows) => {
                if (err) {
                    reject(err);
                    throw err;
                }
                resolve(rows);
            })
        });  
    },
    get: function (id) {
        return new Promise((resolve, reject) => {
            database.get(`
                SELECT *
                FROM translation
                WHERE user=${userId}
                AND id=${id}
            `, [], (err, row) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    resolve(row);
                }
            )
        })
    },
    create: function ({ word, translation, from, to }) {
        return new Promise((resolve, reject) => {
            database.run(`
                INSERT INTO translation (
                    user,
                    word,
                    trans,
                    language_from,
                    language_to
                ) VALUES (
                    ${userId},
                    "${word}",
                    "${translation}",
                    "${from}",
                    "${to}"
                );
            `, [], function (err) {
                if (err) {
                    reject(err);
                    throw err;
                } else {
                    resolve({id: this.lastID})
                }
            })
        })
    },
    update: function (id, updates={}) {
        const paredUpdates = Object.entries(updates).map(([key, val]) => {
                return `${key}=${typeof(val) === 'string' ? `"${val}"` : val}`
            }).join(',');

        return new Promise((resolve, reject) => {
            database.run(`
                UPDATE translation
                SET ${paredUpdates}
                WHERE id=${id}
            `, [], function (err) {
                if (err) {
                    reject(err);
                    throw err;
                } else {
                    resolve({id: this.lastID})
                }
            })
        })
    }
}

const contexts = {
    get: function (translationId) {
        return new Promise((resolve, reject) => {
            database.all(`
                SELECT *
                FROM context
                WHERE translation=${translationId}
            `, [], (err, rows) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    resolve(rows);
                }
            )
        })
    },
    create: function ({translationId, entry, url}) {
        return new Promise((resolve, reject) => {
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
            `, [], function (err) {
                if (err) {
                    reject(err);
                    throw err;
                }
                resolve({id: this.lastID})
            })
        })
    }
}

createTables();

module.exports = {
    createTables,
    translations,
    contexts
}
