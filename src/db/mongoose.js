const mongoose = require("mongoose");

try {
    mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
} catch (e) {
    console.log("unable to connect to database")
}
