import React from "react";

const Footer = ({ completedTasksCount = 0, activeTasksCount = 0 }) => {
    return (
        <>
            {completedTasksCount + activeTasksCount > 0 && (
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        {completedTasksCount > 0 && (
                            <>
                                Bạn đã hoàn thành {completedTasksCount} việc
                                {activeTasksCount > 0 &&
                                    `, còn ${activeTasksCount} việc chưa hoàn thành!`}
                            </>
                        )}

                        {completedTasksCount === 0 && activeTasksCount > 0 && (
                            <>Hãy bắt đầu làm {activeTasksCount} nhiệm vụ!</>
                        )}
                    </p>
                </div>
            )}

            <div className="mt-20 text-sm text-center">
                <p>TodoX MERN App • Designed for productivity by ThaiHuynh</p>
            </div>
        </>
    );
};

export default Footer;
