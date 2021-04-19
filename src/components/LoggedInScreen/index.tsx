import { gql, useQuery } from "@apollo/client";
import { Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import TaskItem from "./components/TaskItem";

const GET_TASKS = gql`
  query {
    getTasks {
      id
      title
      description
    }
  }
`;

type TaskResponseElement = {
  id: number;
  title: string;
  description: string;
};

type TaskResponse = {
  getTasks: TaskResponseElement[];
};

const LoggedInScreen = () => {
  const { loading, error, data } = useQuery<TaskResponse>(GET_TASKS);
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Grid container spacing={2}>
      {data &&
        data!.getTasks.map((e) => (
          <Grid item xs={12}>
            <TaskItem title={e.title} desc={e.description} />
          </Grid>
        ))}
    </Grid>
  );
};

export default LoggedInScreen;
