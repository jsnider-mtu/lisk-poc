# lisk-poc
NodeJS version: v12.22.1

A simple social media platform where users create posts, reply to posts, like posts, and share posts. Also included are moderator accounts who can ban and unban accounts.

Users are rewarded for getting likes, shares, and replies to their posts.

First start the blockchain application:

```
cd blockchain_app/
npm install
node index.js
```

Wait for the first block to be added to the chain, then start the frontend app:

```
cd frontend_app/
npm install
npm start
```

To build and deploy the frontend:

The frontend is hosted in S3 in my case. You will need to change the deploy script in frontend\_app/package.json

```
cd frontend_app/
npm run-script build && npm run-script deploy
```
