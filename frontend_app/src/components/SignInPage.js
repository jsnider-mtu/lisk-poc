import React, { useEffect, useState } from 'react';
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
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { cryptography } from '@liskhq/lisk-client';
import LoginErrorDialog from "./dialogs/LoginErrorDialog";
import * as api from "../api";

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInPage() {
  const classes = useStyles();
  const [data, setData] = useState({ username: "", passphrase: "" });
  const [openLoginError, setOpenLoginError] = useState(false);

  useEffect(() => {
    if (!document.cookie.includes('passphrase')) {
    } else if (document.cookie.split('passphrase')[1].slice(1).split('; ')[0].split(' ').length === 12) {
      window.location.href = '#/home';
    }
  }, []);

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  }

  const handleSend = async (event) => {
    event.preventDefault();
    if (data.username !== "") {
      const addressFromPass = cryptography.getAddressFromPassphrase(data.passphrase).toString("hex");
      const res = await api.fetchAccountInfo(addressFromPass);
      if (!res) {
        setOpenLoginError(true);
      } else if (data.username === res.socmed.name) {
        document.cookie = `passphrase=${data.passphrase}; path=/`;
        window.location.href = '#/home';
      } else {
        setOpenLoginError(true);
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="passphrase"
          label="Passphrase"
          type="passphrase"
          id="passphrase"
          autoComplete="current-passphrase"
          onChange={handleChange}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSend}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item>
            <Link href="#/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      <LoginErrorDialog
        open={openLoginError}
        handleClose={() => {
          setOpenLoginError(false);
        }}
      />
    </Container>
  );
}
