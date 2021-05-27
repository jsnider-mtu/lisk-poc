import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Link,
  Divider,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { transactions, cryptography, Buffer } from "@liskhq/lisk-client";

import LikePostDialog from "./dialogs/LikePostDialog";
import SharePostDialog from "./dialogs/SharePostDialog";
import CreateChildPostDialog from "./dialogs/CreateChildPostDialog";

const useStyles = makeStyles((theme) => ({
  propertyList: {
    listStyle: "none",

    "& li": {
      margin: theme.spacing(2, 0),
      borderBottomColor: theme.palette.divider,
      borderBottomStyle: "solid",
      borderBottomWidth: 1,

      "& dt": {
        display: "block",
        width: "100%",
        fontWeight: "bold",
        margin: theme.spacing(1, 0),
      },
      "& dd": {
        display: "block",
        width: "100%",
        margin: theme.spacing(1, 0),
      },
    },
  },
}));

export default function Post(props) {
  const classes = useStyles();
  const [openShare, setOpenShare] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [openLike, setOpenLike] = useState(false);
  // Get username from address
  const base32UIAddress = cryptography.getBase32AddressFromAddress(Buffer.from(props.item.ownerAddress, 'hex'), 'lsk').toString('binary');
  // const base32OrigAddress = cryptography.getBase32AddressFromAddress(Buffer.from(props.item.origOwnerAddress, 'hex'), 'lsk').toString('binary');
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{props.item.message}</Typography>
        <Divider />
        <dl className={classes.propertyList}>
          <li>
            <dt>Post ID</dt>
            <dd>{props.item.id}</dd>
          </li>
          <li>
            <dt>Likes</dt>
            <dd>{props.item.likes.length}</dd>
          </li>
          <li>
            <dt>Shares</dt>
            <dd>{props.item.shares.length}</dd>
          </li>
          <li>
            <dt>Replies</dt>
            <dd>{props.item.replies.length}</dd>
          </li>
          <li>
            <dt>Owner</dt>
            <dd>
              <Link
                component={RouterLink}
                to={`/accounts/${base32UIAddress}`}
              >
                {base32UIAddress}
              </Link>
            </dd>
          </li>
        </dl>
        // <Typography variant="h6">NFT History</Typography>
        // <Divider />
        // {props.item.tokenHistory.map((obj) => (
        //   <dl className={classes.propertyList}>
        //     <li>
        //       <dd>
        //         <Link
        //           component={RouterLink}
        //           to={`/accounts/${obj.address}`}
        //         >
        //           {obj.address}
        //         </Link> at {transactions.convertBeddowsToLSK(obj.salePrice)} LSK
        //       </dd>
        //     </li>
        //   </dl>
        // ))}

      </CardContent>
      <CardActions>
        <>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              setOpenLike(true);
            }}
          >
            Like Post
          </Button>
          <LikePostDialog
            open={openLike}
            handleClose={() => {
              setOpenLike(false);
            }}
            post={props.item}
            />
        </>
        <>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              setOpenShare(true);
            }}
          >
            Share Post
          </Button>
          <SharePostDialog
            open={openShare}
            handleClose={() => {
              setOpenShare(false);
            }}
            post={props.item}
           />
        </>
        <>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              setOpenReply(true);
            }}
          >
            Reply to Post
          </Button>
          <CreateChildPostDialog
            open={openReply}
            handleClose={() => {
              setOpenReply(false);
            }}
            post={props.item}
          />
        </>
        // <>
        //   <Button
        //     size="small"
        //     color="primary"
        //     onClick={() => {
        //       setOpenUpdateMinPrice(true);
        //     }}
        //   >
        //     Update Minimum Price
        //   </Button>
        //   <UpdateNFTMinPriceDialog
        //     open={openUpdateMinPrice}
        //     handleClose={() => {
        //       setOpenUpdateMinPrice(false);
        //     }}
        //     token={props.item}
        //   />
        // </>
      </CardActions>
    </Card>
  );
}
