# Talao DAO ReactJS prototype

Based on http://truffleframework.com/boxes/react-auth

## Installation

    npm install

## Compile and deploy the contracts

Go in ~ and create a folder for Parity blockchains and one for this prototype:

    cd
    mkdir -p parity/react-proto

In a shell, open Parity with Parity UI:

    parity ui --chain=dev --unsafe-expose --datadir ./parity/react-proto

Leave that shell open with the BC running.

Go to Parity UI, create a few accounts including an "Admin" account who will be the Smart Contracts owner.

Compile and deploy the contracts in /contracts.

Update the ABIs and the adresses in:

+ src/App.js
+ src/objection/Objection.js
+ src/objection/ObjectionForm.js

## Launch the app:

In another shell:

    cd
    cd react-proto
    npm run start

The app is on http://localhost:3000
