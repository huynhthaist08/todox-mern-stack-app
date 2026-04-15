import Task from "../models/Task.js";

// GET ALL
export const getAllTasks = async (req, res) => {
    try {
        // const tasks = await Task.find().sort({ createdAt: -1 }); // -1: sắp xếp giảm dần <=> desc: giảm dần, asc: tăng dần

        const result = await Task.aggregate([
            {
                $facet: {
                    // facet -> chạy 3 pipelines này cùng lúc -> kết quả của 3 bước này sẽ trả về chung 1 đối tượng
                    tasks: [{ $sort: { createdAt: -1 } }], // sắp xếp lại
                    activeCount: [
                        // đếm số nhiệm vụ active
                        { $match: { status: "active" } },
                        { $count: "count" },
                    ],
                    completeCount: [
                        // đếm số nhiệm vụ hoàn thành
                        { $match: { status: "complete" } },
                        { $count: "count" },
                    ],
                },
            },
        ]);

        const tasks = result[0].tasks;
        const activeCount = result[0].activeCount[0]?.count || 0;
        const completeCount = result[0].completeCount[0]?.count || 0;

        res.status(200).json({ tasks, activeCount, completeCount });
    } catch (error) {
        console.log("Lỗi khi gọi getAllTasks", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// POST
export const createTask = async (req, res) => {
    try {
        const { title } = req.body;
        const task = new Task({ title });

        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.log("Lỗi khi gọi createTask", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// PUT
export const updateTask = async (req, res) => {
    try {
        const { title, status, completedAt } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                status,
                completedAt,
            },
            {
                new: true,
            },
        );
        if (!updateTask) {
            return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        console.log("Lỗi khi gọi updatedTask", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// DELETE
export const deleteTask = async (req, res) => {
    try {
        const deleteTask = await Task.findByIdAndDelete(req.params.id);

        if (!deleteTask) {
            return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
        }
        res.status(200).json(deleteTask);
    } catch (error) {
        console.log("Lỗi khi gọi deleteTask", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
