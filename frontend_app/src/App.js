import React, { Fragment, useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Link as RouterLink,
    Switch,
    Route,
} from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Link,
    IconButton,
    Container,
    Chip,
} from '@material-ui/core';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { cryptography } from "@liskhq/lisk-client";
import * as api from './api';
import { NodeInfoContext, nodeInfoContextDefaultValue } from './context';

import HomePage from './components/HomePage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import TransactionsPage from './components/TransactionsPage';
import AccountPage from './components/AccountPage';
import CreateAccountDialog from './components/dialogs/CreateAccountDialog';
import TransferFundsDialog from './components/dialogs/TransferFundsDialog';
import CreatePostDialog from './components/dialogs/CreatePostDialog';

const useStyles = makeStyles((theme) => ({
    appBarLink: {
        margin: theme.spacing(0, 2),
        flex: 1,
    },
    speedDial: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
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
        setInterval(updateHeight, 1000);
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

    if (document.cookie.split('; ').find(r => r.startsWith('passphrase=')).split('=')[1].split(' ').length === 12) {
        const base32UIAddress = cryptography.getBase32AddressFromPassphrase(document.cookie.split('; ').find(r => r.startsWith('passphrase=')).split('=')[1]).toString('hex');
        const addyPath = `/accounts/${base32UIAddress}`
        myAcct =
            <Link
                color="inherit"
                component={RouterLink}
                to={addyPath}
                className={classes.appBarLink}
            >
                My Account
            </Link>;
    } else {
        myAcct = <></>;
    }

    return (
        <Fragment>
            <NodeInfoContext.Provider value={nodeInfoState}>
                <Router>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" aria-label="menu">
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6">Social Media App</Typography>

                            <Link
                                color="inherit"
                                component={RouterLink}
                                to="/home"
                                className={classes.appBarLink}
                            >
                                Home
                            </Link>
                            <Link
                                color="inherit"
                                component={RouterLink}
                                to="/transactions"
                                className={classes.appBarLink}
                            >
                                Transactions
                            </Link>
                            {myAcct}
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

                    <Container className={classes.contentContainer}>
                        <Switch>
                            <Route path="/" exact>
                                <SignInPage />
                            </Route>

                            <Route path="/home" component={HomePage} />
                            <Route path="/accounts/:address" component={AccountPage} />
                            <Route path="/transactions" component={TransactionsPage} />
                            <Route path="/signin" component={SignInPage} />
                            <Route path="/signup" component={SignUpPage} />
                        </Switch>
                    </Container>

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
    );
}

export default App;
