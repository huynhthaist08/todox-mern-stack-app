import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
    const [taskBuffer, setTaskBuffer] = useState([]);
    const [activeTaskCount, setActiveTaskCount] = useState(0);
    const [completeTaskCount, setCompleteTaskCount] = useState(0);
    const [filter, setFilter] = useState("all");
    const [dateQuery, setDateQuery] = useState("today");
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchTasks();
    }, [dateQuery]);

    // Logic
    const fetchTasks = async () => {
        try {
            const res = await api.get(`/tasks?filter=${dateQuery}`);
            setTaskBuffer(res.data.tasks);
            setActiveTaskCount(res.data.activeCount);
            setCompleteTaskCount(res.data.completeCount);
            // console.log(res.data);
        } catch (error) {
            console.error("Lỗi xảy ra khi truy xuất tasks:", error);
            toast.error("Lỗi xảy ra khi truy xuất tasks");
        }
    };

    // Biến
    const filteredTasks = taskBuffer.filter((task) => {
        switch (filter) {
            case "active":
                return task.status === "active";
            case "completed":
                return task.status === "complete";
            default:
                return true;
        }
    });

    // Logic xử lý pagination
    // Hàm handleTaskChange này dùng để gọi lại fetchTasks() -> lấy data -> update state -> render UI
    const handleTaskChanged = () => {
        fetchTasks();
    };

    // Hàm slice tính vị trí bắt đầu và kết thúc 1 trang pagination
    const visibleTasks = filteredTasks.slice(
        (page - 1) * visibleTaskLimit, // vị trí bắt đầu
        page * visibleTaskLimit, // vị trí kết thúc
    );

    const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit); // Math.ceil -> hàm làm tròn số

    const handleNext = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    };
    const handlePrev = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    if (visibleTasks.length === 0) {
        handlePrev();
    }

    // Fix bug render complement task
    useEffect(() => {
        setPage(1);
    }, [filter, dateQuery]);

    // Fix bug delete task -> prev page
    if (visibleTasks.length === 0) {
        handlePrev();
    }

    return (
        <>
            <div className="relative w-full min-h-screen bg-black">
                {/* X Organizations Black Background with Top Glow */}{" "}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
                    }}
                />
                {/* Your Content/Components */}
                <div className="container relative z-10 pt-8 mx-auto">
                    <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
                        {/* Header */}
                        <Header />

                        {/* Tạo nhiệm vụ */}
                        <AddTask handleNewTaskAdded={handleTaskChanged} />

                        {/* Thống kê và bộ lọc */}
                        <StatsAndFilters
                            filter={filter}
                            setFilter={setFilter}
                            activeTasksCount={activeTaskCount}
                            completedTasksCount={completeTaskCount}
                        />

                        {/* Danh sách nhiệm vụ */}
                        <TaskList
                            filteredTasks={visibleTasks}
                            filter={filter}
                            handleTaskChanged={handleTaskChanged}
                        />

                        {/* Phân trang và lọc theo ngày */}
                        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                            <TaskListPagination
                                handleNext={handleNext}
                                handlePrev={handlePrev}
                                handlePageChange={handlePageChange}
                                page={page}
                                totalPages={totalPages}
                            />
                            <DateTimeFilter
                                dateQuery={dateQuery}
                                setDateQuery={setDateQuery}
                            />
                        </div>

                        {/* Footer */}
                        <Footer
                            activeTasksCount={activeTaskCount}
                            completedTasksCount={completeTaskCount}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
