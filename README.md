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

+ src/token/Token.js
+ src/objection/Objection.js
+ src/objection/ObjectionForm.js

## Launch the app:

In another shell:

    cd
    cd react-proto
    npm run start

The app is on http://localhost:3000
