require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("5e5031057ce3aa2ff4888cce").then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);
// });

const deleteTaskAndCount = async(taskId) => {
    const task = await Task.findByIdAndDelete(taskId);
    const count = Task.countDocuments({ completed: false });
    return count;
};

deleteTaskAndCount("5e502f805cb83c17487fab82").then((result) => {
    console.log("result", result);
}).catch((error) => {
    console.log("error", error);
});