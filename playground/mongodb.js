// CRUD create read update delete

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log("Unable to connect to database");
    }

    console.log("Connected correctly");

    const db = client.db(databaseName);

    // db.collection("users").updateOne({
    //     _id: new ObjectID("5e4a74d8506a041b5c30095e")
    // }, {
    //         $inc: {
    //             age: 1
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });

    db.collection("tasks").updateMany({
        completed: true
    }, {
            $set: {
            completed: false
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    });

    db.collection("users").deleteOne({
        _id: ObjectID("5e4a733cd2c0ad27e46b3397")
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    });
});