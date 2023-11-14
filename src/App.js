import { useState, createContext, useEffect } from 'react';
import './App.css';
import Router from './Router';
import Navbar, { RoleTypes } from './components/Navbar';
import Loader from './components/Loader';
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import BottomNavbar from './components/BottomNavbar';
import { CssBaseline } from '@mui/material';
import CustomizedSnackbars from './components/Snackbar';


export const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const GeneralContext = createContext();

function App() {
  const [user, setUser] = useState();
  const [loader, setLoader] = useState(true);
  const [userRoleType, setUserRoleType] = useState(RoleTypes.none);
  const [mode, setMode] = useState('light');
  const [snackbarMsg, setSnackbarMsg] = useState("BEEP");
  const [open, setOpen] = useState(false);



  useEffect(() => {
    fetch(`https://api.shipap.co.il/clients/login`, {
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return res.text().then(x => {
            throw new Error(x);
          });
        }
      })
      .then(data => {
        setUser(data);
        setUserRoleType(RoleTypes.user);

        if (data.business) {
          setUserRoleType(RoleTypes.business);
        } else if (data.admin) {
          setUserRoleType(RoleTypes.admin);
        }
      })
      .catch(err => {
        setUserRoleType(RoleTypes.none);
      })
      .finally(() => setLoader(false));
  }, []);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );


  return (
    <ColorModeContext.Provider value={colorMode}>
      <CssBaseline />
      <GeneralContext.Provider value={{ user, setUser, setLoader, userRoleType, setUserRoleType, mode, setMode, snackbarMsg, setSnackbarMsg, open, setOpen }}>
        <ThemeProvider theme={theme}>
          <Navbar />
          <Router />
          <BottomNavbar />
          {loader && <Loader />}
        </ThemeProvider>
        <CustomizedSnackbars />
      </GeneralContext.Provider>
    </ColorModeContext.Provider>
  );
}

export default App;



