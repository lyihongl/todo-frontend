import React, { createContext, ReactNode, useCallback, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Button } from "@material-ui/core";
import { lazy, Suspense, useEffect } from "react";
import TaskItem from "./components/TaskItem";
import { Screens } from "./constants";
import * as Interface from "./MainScreen";
import useStyles from './styles'

const LoginScreen = lazy(() => import("../LoginScreen"));

type DynamicRenderProps = {
  children: ReactNode;
};

export const ScreenContext = createContext<Interface.IScreens>({
  screen: Screens.Main,
  setScreen: (s: Screens) => {},
});

const DynamicRender = ({ children }: DynamicRenderProps) => {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};

const MainScreen = () => {
  const [screen, setScreen] = useState<Screens>(Screens.Main);

  const classes = useStyles()

  const handleLoginClick = useCallback(() => {
    setScreen(Screens.Login);
  }, [setScreen, Screens]);

  const renderScreen = (screen: Screens) => {
    switch (screen) {
      case Screens.Main: {
        return (
          <>
            <Button onClick={handleLoginClick}>Login</Button>
          </>
        );
      }
      case Screens.Login: {
        return (
          <DynamicRender>
            <LoginScreen />
          </DynamicRender>
        );
      }
      default: {
      }
    }
  };

  return (
    <div className={classes.root}>
      <ScreenContext.Provider value={{ screen, setScreen }}>
        {renderScreen(screen)}
      </ScreenContext.Provider>
    </div>
  );
};

export default MainScreen;
