# Talao DAO ReactJS prototype

Based on https://github.com/facebook/create-react-app

## Installation

    npm install

The font is commercial, so not included in this repo.

## Compile and deploy the contracts

### On a local Parity blockchain

Install Parity.

In a shell, open Parity with Parity UI:

    parity ui --chain=dev --unsafe-expose --datadir ./data/parity

Leave that shell open with the BC running.

Go to Parity UI, create a few accounts including an "Admin" account who will be the Smart Contracts owner.

Compile and deploy the contracts in /contracts.

Update the ABIs and the adresses in:

+ /.env.development.local for your local BC (not commited)
+ /.env.development for Ropsten (commited but please do not change, if you want to test on Ropsten with new contracts instances, please use .env.development.local)

## Launch the app:

In another shell:

    cd
    cd react-proto
    npm run start

The app is on http://localhost:3000
