# Talao DAO prototype

Based on https://github.com/facebook/create-react-app

## tl;dr

    git clone git@github.com:TalaoDAO/dao.git
    cd dao
    npm install
    npm run start

Your are now running a local dev server of Talao DAO, connected to the Ropsten network.
If it didn't open a browser tab automatically, go to : http://localhost:3000

## Using a local dev blockchain

    cp .env.development .env.development.local

Edit .env.development.local
+ Change the contracts addresses for the ones you have deployed on your local dev BC
+ Change ABIs too if you are developing on the Smart contracts

### Parity local dev blockchain

We use Parity local dev blockchain a lot, because it's persistent nature and tools are real usefull to us. If you want to use it as well:

In a shell, open Parity with Parity UI:

    parity ui --chain=dev --unsafe-expose --datadir ./data/parity

Leave that shell open with the BC running. Go to Parity UI, create a few accounts including an "Admin" account who will be the Smart Contracts owner. Compile and deploy the contracts in /contracts.

Update the adresses and if necessary the ABIs in /.env.development.local
