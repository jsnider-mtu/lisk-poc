import React, { useEffect, useState } from 'react';
//import { useParams } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import GitHubIcon from '@material-ui/icons/GitHub';
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { cryptography, Buffer } from '@liskhq/lisk-client';
import * as api from '../api';

import CreateAccountDialog from './dialogs/CreateAccountDialog';
import LoadingAccountDialog from './dialogs/LoadingAccountDialog';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <GitHubIcon />
      {' Github is '}
      <Link color="inherit" href="https://github.com/jsnider-mtu/lisk-poc">
        Here
      </Link>
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUpPage() {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(null);
  const [data, setData] = useState({ username: "", address: "" });
  const [txAccounts, setTxAccounts] = useState([]);
  const [invalidUsername, setInvalidUsername] = useState(false);
  const [fetchDataRan, setFetchDataRan] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const allAccounts = await api.getAllAccounts();
      let txAccounts = await Promise.all(
        allAccounts.map((t) => {
          let binaryAddress = cryptography.getAddressFromPublicKey(Buffer.from(t['senderPublicKey'], 'hex')).toString('hex');
          return api.fetchAccountInfo(binaryAddress);
        })
      )
      setTxAccounts(txAccounts);
    }
    if (!fetchDataRan) {
      fetchData();
      setFetchDataRan(true);
    }
    if (txAccounts.length > 0) {
      let usernames = txAccounts.map((a) => a.socmed.name);
      if (usernames.includes(data.username) || data.username === 'afsa' || data.username.includes(' ') || data.username.includes('#') || data.username.includes('@')) {
        setInvalidUsername(true);
      } else {
        setInvalidUsername(false);
      }
    } else {
      if (data.username === 'afsa' || data.username.includes(' ') || data.username.includes('#') || data.username.includes('@')) {
        setInvalidUsername(true);
      } else {
        setInvalidUsername(false);
      }
    }
  }, [data.username, fetchDataRan]);

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AssignmentIndIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <br />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={data.username}
              autoComplete="username"
              onChange={handleChange}
              error={invalidUsername}
              helperText={invalidUsername ? "That username is not available" : ""}
            />
          </Grid>
        </Grid>
        <Grid container className={classes.form} justify="flex-end">
          <Grid item>
            <Link href="#/signin" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => {
            if (data.username !== "") {
              setOpenDialog('CreateAccountDialog');
            }
          }}
        >
          Sign Up
        </Button>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
      <CreateAccountDialog
        open={openDialog === 'CreateAccountDialog'}
        username={data.username}
        handleClose={(addy, passp) => {
          setData({ ...data, ['address']: addy, ['passphrase']: passp });
          if (passp.split(' ').length === 12) {
            document.cookie = `passphrase=${passp}; path=/`;
          }
          setOpenDialog('LoadingAccountDialog');
        }}
      />
      <LoadingAccountDialog
        open={openDialog === 'LoadingAccountDialog'}
        address={data.address}
        username={data.username}
        passphrase={data.passphrase}
        handleClose={() => {
          window.location.href = `#/home`;
        }}
      />
    </Container>
  );
}
