require("../src/db/mongoose");
const User = require("../src/models/user");

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {
        age: 14
    });
    const count = await User.countDocuments({ age });
    return count;
};

updateAgeAndCount("5e4fe86619bab92ac0184c1e", 14).then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
});