const mongoose = require("mongoose");

try {
    mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
} catch (e) {
    console.log("unable to connect to database")
}
