// GET ALL
export const getAllTasks = (request, response) => {
    response.status(200).send("Bạn có 10 việc cần làm");
};

// POST
export const createTask = (req, res) => {
    res.status(201).json({
        message: "Nhiệm vụ mới đã được thêm vào thành công",
    });
};

// PUT
export const updateTask = (req, res) => {
    res.status(200).json({
        message: "Nhiệm vụ mới đã được thay đổi thành công",
    });
};

// DELETE
export const deleteTask = (req, res) => {
    res.status(200).json({
        message: "Nhiệm vụ đã được xoá",
    });
};
