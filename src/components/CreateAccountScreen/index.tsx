import { gql, useMutation } from "@apollo/client";
import { Grid, TextField, Button } from "@material-ui/core";
import { useState, useContext, useCallback } from "react";
import { UserStateContext } from "../../App";
import useUpdateEffect from "../../hooks/useEffectUpdate";
import { ScreenContext } from "../MainScreen";
import { Screens } from "../MainScreen/constants";
import {RegisterUserResponse} from '../Types/UserResponse'


const REGISTER_USER = gql`
  mutation Register($username: String!, $password: String!, $email: String!) {
    registerUser(
      options: { username: $username, password: $password }
      email: $email
    ) {
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

const CreateAccountScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data }] = useMutation<RegisterUserResponse>(REGISTER_USER);

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
      if (data.registerUser.errors !== null) {
        console.log("error");
      } else {
        screenContext.setScreen(Screens.Main);
        UserContext.setUserid(data.registerUser.user.id);
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

export default CreateAccountScreen;
