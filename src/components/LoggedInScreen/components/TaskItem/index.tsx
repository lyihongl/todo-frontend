import { Paper } from "@material-ui/core";
import React from "react";
const TaskItem = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <Paper>
      {title}
      {desc}
    </Paper>
  );
};

export default TaskItem;
