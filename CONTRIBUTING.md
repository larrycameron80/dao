# Contributing to Talao DAO

First, welcome to the project and thanks for taking the time to contribute! :tada::+1:

## Repository and Pull Requests

The branches *master* and *dev* are protected. *master* is not used so much for now, the default branch is *dev*.

*dev* does not accept pushes, only Pull Requests:

+ Approved Talao team members are added to the Talao GitHub organization and can push their own branches to this repository, but still have to submit PRs.
+ Community contributors fork the Talao project on their own GitHub and submit PRs.

## Commercial assets

Commercial assets such as fonts are not available in this repository. You should never submit a PR that breaks things without having the commercial assets.

## Interface building

The interface is based on Facebook's [create-react-app](https://github.com/facebook/create-react-app).

At the moment we have:

+ Base: [create-react-app](https://github.com/facebook/create-react-app)
+ Web3: [react-web3](https://github.com/coopermaruyama/react-web3)
+ CSS: [purecss](https://purecss.io/) (we will need a more complete framework & probably will stay without SASS/LESS since it's not so usefull with React)
+ Icons: [react-fontawesome](https://github.com/FortAwesome/react-fontawesome)

We will need to add new tools but we would like to keep the project as simple as possible.

Please provide a rationale as to why we really should add something.

For CSS, we need more than PureCSS and we would very much like to use a library integrated as React components. We would like to wait for react-bootstrap to update to Bootstrap 4. Or wait for a release of Materia-UI without the dependency to the Roboto font. If you have any other idea, please tell us.

## Ethereum features

### Web3.JS

For now we stick to the "old" Web3.JS version (of Metamask). More to come about this, we hope.

### Truffle

We would very much like use Truffle to manage and test our contracts. Very soon, we will open a branch with Truffle. But we will not merge it in *dev* until we can deploy all the contracts on a local Parity chain. There are gas price problems and such, that we have to solve before our contracts can be deployed with Truffle on Parity. The "Advanced token" of Ethereum.org does not even migrate with Truffle on Parity, for now.

It's real important for us to be able to use a persistent local BC for our devs.
