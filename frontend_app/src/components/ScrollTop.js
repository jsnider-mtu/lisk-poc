import React from 'react';
import { Zoom, useScrollTrigger } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backToTop: {
    position: 'fixed',
    top: theme.spacing(10),
    right: theme.spacing(2),
  },
}));

export default function ScrollTop(props) {
  const { children } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger();

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.backToTop}>
        {children}
      </div>
    </Zoom>
  );
}
