import React, { Fragment, useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Link as RouterLink,
    Switch,
    Route,
} from 'react-router-dom';
import {
    AppBar,
    Button,
    Toolbar,
    Typography,
    Link,
    Container,
    Chip,
    Grid,
    Divider,
} from '@material-ui/core';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';
import { createMuiTheme, MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import SettingsIcon from '@material-ui/icons/Settings';
import { cryptography } from "@liskhq/lisk-client";
import * as api from './api';
import { NodeInfoContext, nodeInfoContextDefaultValue } from './context';

import HomePage from './components/HomePage';
import AllPage from './components/AllPage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import TransactionsPage from './components/TransactionsPage';
import AccountPage from './components/AccountPage';
import PostPage from './components/PostPage';
import HashtagPage from './components/HashtagPage';
import CreateAccountDialog from './components/dialogs/CreateAccountDialog';
import TransferFundsDialog from './components/dialogs/TransferFundsDialog';
import CreatePostDialog from './components/dialogs/CreatePostDialog';
import SettingsDialog from './components/dialogs/SettingsDialog';

const useStyles = makeStyles((theme) => ({
    appBarLink: {
        margin: theme.spacing(0, 2),
        flex: 1,
        textTransform: 'none',
    },
    speedDial: {
        position: 'fixed',
        bottom: theme.spacing(5),
        right: theme.spacing(5),
    },
    contentContainer: {
        padding: theme.spacing(5, 0),
    },
    grow: {
        flexGrow: 1,
    },
}));

function App() {
    const classes = useStyles();
    const [nodeInfoState, updateNodeInfoState] = useState(
        nodeInfoContextDefaultValue,
    );
    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const [openDialog, setOpenDialog] = useState(null);
    const [openSettings, setOpenSettings] = useState(false);
    const [paletteType, setPaletteType] = useState("light");

    const theme = createMuiTheme({
        palette: {
            secondary: {
                main: "#0069ff",
            },
            type: paletteType,
        },
    });

    const updateHeight = async () => {
        const info = await api.fetchNodeInfo();

        updateNodeInfoState({
            networkIdentifier: info.networkIdentifier,
            minFeePerByte: info.genesisConfig.minFeePerByte,
            height: info.height,
        });
    };

    useEffect(() => {
      async function fetchData() {
        const info = await api.fetchNodeInfo();
        updateNodeInfoState({
          networkIdentifier: info.networkIdentifier,
          minFeePerByte: info.genesisConfig.minFeePerByte,
          height: info.height,
        });
        setInterval(updateHeight, 5000);
      }
      fetchData();
    }, []);

    const handleSpeedDialClose = () => {
        setOpenSpeedDial(false);
    };

    const handleSpeedDialOpen = () => {
        setOpenSpeedDial(true);
    };


    let myAcct;
    let logoutlink;

    if (document.cookie.split('; ').pop().split('=')[1].split(' ').length === 12) {
        const base32UIAddress = cryptography.getBase32AddressFromPassphrase(document.cookie.split('; ').pop().split('=')[1]).toString('hex');
        const addyPath = `/accounts/${base32UIAddress}`
        myAcct =
            <Button
                size="small"
                color="inherit"
                href={addyPath}
                className={classes.appBarLink}
            >
                My Account
            </Button>;
        logoutlink =
            <Button
                size="small"
                color="inherit"
                className={classes.appBarLink}
                onClick={() => {
                  document.cookie = "passphrase=; Secure";
                  window.location.href = "/signin";
                }}
            >
                Logout
            </Button>;
    } else {
        myAcct = <></>;
        logoutlink = <></>;
    }

    return (
        <MuiThemeProvider theme={theme}>
            <Fragment>
                <NodeInfoContext.Provider value={nodeInfoState}>
                    <Router>
                        <AppBar position="static">
                            <Toolbar>
    
                                <Link
                                    color="inherit"
                                    component={RouterLink}
                                    to="/home"
                                    className={classes.appBarLink}
                                >
                                    <Typography variant="h6">Social Media App</Typography>
                                </Link>
                                {myAcct}
                                {logoutlink}
                                <div className={classes.grow} />
                                <Chip label={nodeInfoState.height} />
                            </Toolbar>
                        </AppBar>
    
                        <SpeedDial
                            ariaLabel="SpeedDial example"
                            color="secondary"
                            className={classes.speedDial}
                            icon={<SpeedDialIcon />}
                            onClose={handleSpeedDialClose}
                            onOpen={handleSpeedDialOpen}
                            open={openSpeedDial}
                            direction={'up'}
                        >
                            <SpeedDialAction
                                key={'Create Post'}
                                icon={<AddPhotoAlternateIcon />}
                                tooltipTitle={'Create Post'}
                                onClick={() => {
                                    setOpenSpeedDial(false);
                                    setOpenDialog('CreatePostDialog');
                                }}
                            />
    
                            <SpeedDialAction
                                key={'Transfer'}
                                icon={<LocalAtmIcon />}
                                tooltipTitle={'Transfer Funds'}
                                onClick={() => {
                                    setOpenSpeedDial(false);
                                    setOpenDialog('TransferFundsDialog');
                                }}
                            />
                        </SpeedDial>
    
                        <Grid container
                            direction="row"
                            justify="space-evenly"
                            alignItems="flex-start"
                        >
                            <Grid item xs>
                                <Container className={classes.contentContainer}>
                                    <Button
                                        classes={{position: 'fixed'}}
                                        size="large"
                                        color="inherit"
                                        startIcon={<SettingsIcon />}
                                        onClick={() => {
                                            setOpenSettings(true);
                                        }}
                                    >
                                        Settings
                                    </Button>
                                    <SettingsDialog
                                        open={openSettings}
                                        palType={paletteType}
                                        handleClose={(pType) => {
                                            setPaletteType(pType);
                                            setOpenSettings(false);
                                        }}
                                    />
                                </Container>
                            </Grid>
                            <Divider orientation="vertical" flexItem />
                            <Grid item xs={6}>
                                <Container className={classes.contentContainer}>
                                    <Switch>
                                        <Route path="/" exact>
                                            <SignInPage />
                                        </Route>
            
                                        <Route path="/home" component={HomePage} />
                                        <Route path="/all" component={AllPage} />
                                        <Route path="/accounts/:address" component={AccountPage} />
                                        <Route path="/post/:postId" component={PostPage} />
                                        <Route path="/hashtag/:hashtag" component={HashtagPage} />
                                        <Route path="/transactions" component={TransactionsPage} />
                                        <Route path="/signin" component={SignInPage} />
                                        <Route path="/signup" component={SignUpPage} />
                                    </Switch>
                                </Container>
                            </Grid>
                            <Divider orientation="vertical" flexItem />
                            <Grid item xs>
                            </Grid>
                        </Grid>
    
                        <CreatePostDialog
                            open={openDialog === 'CreatePostDialog'}
                            handleClose={() => {
                                setOpenDialog(null);
                            }}
                        />
    
                        <CreateAccountDialog
                            open={openDialog === 'CreateAccountDialog'}
                            handleClose={() => {
                                setOpenDialog(null);
                            }}
                        />
    
                        <TransferFundsDialog
                            open={openDialog === 'TransferFundsDialog'}
                            handleClose={() => {
                                setOpenDialog(null);
                            }}
                        />
                    </Router>
                </NodeInfoContext.Provider>
            </Fragment>
        </MuiThemeProvider>
    );
}

export default App;
