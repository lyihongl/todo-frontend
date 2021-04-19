import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { ScreenContext } from "../MainScreen";
import { Screens } from "../MainScreen/constants";
import useUpdateEffect from "../../hooks/useEffectUpdate";
import { UserStateContext } from "../../App";
// import { ErrorMessage } from "../Types/UserResponse";
import { LoginResponse } from "../Types/UserResponse";

// interface LoginResponse {
//   login: {
//     errors: ErrorMessage[];
//     user: {
//       id: string;
//       username: string;
//       email: string;
//     };
//   };
// }

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
  const [login, { data }] = useMutation<LoginResponse>(GET_USER);

  const screenContext = useContext(ScreenContext);
  const UserContext = useContext(UserStateContext);

  const onLoginClick = () => {
    login({ variables: { username, password } });
  };
  const onBackClick = () => {
    screenContext.setScreen(Screens.Main);
  };
  // useEffect(() => {
  //   console.log(loading, error, subData);
  // }, [subData]);

  useUpdateEffect(() => {
    if (data) {
      if (data.login.errors !== null) {
        console.log("error");
      } else {
        // screenContext.setScreen(Screens.Main);
        // UserContext.setUserId(data.login.user.id);
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
          placeholder={"username"}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          size="small"
          value={password}
          onChange={handlePassword}
          placeholder={"password"}
          type="password"
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
