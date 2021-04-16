import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import { gql, useMutation } from "@apollo/client";
import { ScreenContext } from "../MainScreen";
import { Screens } from "../MainScreen/constants";
import useUpdateEffect from "../../hooks/useEffectUpdate";

interface ErrorMessage {
  field: string;
  message: string;
}

interface LoginResonse {
  login: {
    errors: ErrorMessage[];
    user: {
      id: number;
      username: string;
      email: string;
    };
  };
}

const GET_USER = gql`
  mutation Register($username: String!, $password: String!) {
    login(options: { username: $username, password: $password }) {
      user {
        id
        username
        email
      }
      errors {
        field
        message
      }
    }
  }
`;

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data }] = useMutation<LoginResonse>(GET_USER);

  const screenContext = useContext(ScreenContext);

  const onLoginClick = () => {
    login({ variables: { username, password } });
  };
  const onBackClick = () => {
    screenContext.setScreen(Screens.Main);
  };

  useUpdateEffect(() => {
    if (data) {
      if (data.login.errors !== null) {
        console.log("error");
      } else {
        screenContext.setScreen(Screens.Main);
      }
    }
  }, [data]);

  const handleUsernameUpdate = useCallback(
    (event) => {
      setUsername(event.target.value);
    },
    [setUsername]
  );
  const handlePassword = useCallback(
    (event) => {
      setPassword(event.target.value);
    },
    [setPassword]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          size="small"
          value={username}
          onChange={handleUsernameUpdate}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          size="small"
          value={password}
          onChange={handlePassword}
        />
      </Grid>
      <Grid item>
        <Button onClick={onLoginClick}>Login</Button>
      </Grid>
      <Grid item>
        <Button onClick={onBackClick}>Back</Button>
      </Grid>
    </Grid>
  );
};

export default LoginScreen;
