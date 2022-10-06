const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

class MongoCRUD {
    constructor({ url, dbName, collection }) {
        this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        this.dbName = dbName;
        this.collection = collection;
    }

    connect() {
        if (!MongoCRUD.connection) {
            MongoCRUD.connection = new Promise((resolve, reject) => {
                this.client.connect(err => {
                    if (err) {
                        reject(err);
                    }

                    console.log('Connected succesfully to mongo');
                    resolve(this.client.db(this.dbName));
                });
            });
        }

        return MongoCRUD.connection;
    }

    getAll(query) {
        return this.connect().then(db => {
            return db
                .collection(this.collection)
                .find(query)
                .toArray();
        });
    }

    get(id) {
        return this.connect().then(db => {
            return db
                .collection(this.collection)
                .findOne({ _id: ObjectId(id) });
        });
    }

    create(data) {
        return this.connect()
            .then(db => {
                return db.collection(this.collection).insertOne(data);
            })
            .then(result => result.insertedId);
    }

    update(id, data) {
        return this.connect()
            .then(db => {
                return db
                    .collection(this.collection)
                    .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
            })
            .then(result => result.upsertedId || id);
    }

    delete(id) {
        return this.connect()
            .then(db => {
                return db
                    .collection(this.collection)
                    .deleteOne({ _id: ObjectId(id) });
            })
            .then(() => id);
    }

    deleteAll() {
        return this.connect()
            .then(db => {
                return db
                    .collection(this.collection)
                    .deleteMany({});
            })
            .then(() => true);
    }

    close() {
        return this.client.close();
    }
}

module.exports = { MongoCRUD };