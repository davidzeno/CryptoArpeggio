
# CryptoArpeggio
Decentralize the music industry - building a smart contract application that disrupt the world of music...

**Video Demo:**
https://youtu.be/bimtLHxAcR4

Follow the steps below to download, install, and run this project.

## Dependencies
Install these prerequisites.
- NPM: https://nodejs.org
- Truffle: https://github.com/trufflesuite/truffle
- Ganache: http://truffleframework.com/ganache/
- Metamask: https://metamask.io/


## Step 1. Clone the project
`git clone https://github.com/davidzeno/CryptoArpeggio`

## Step 2. Install dependencies
```
$ cd CryptoArpeggio
$ npm install
```

## Step 3. Start Ganache
Open the Ganache GUI client that you downloaded and installed. This will start your local blockchain instance.

## Step 4. Compile & Deploy CryptoArpeggio Smart Contract
`$ truffle migrate --reset`
You must migrate the CryptoArpeggio smart contract each time your restart ganache.

## Step 5. Configure Metamask
- Unlock Metamask
- Connect metamask to your local Etherum blockchain provided by Ganache.
- Import an account provided by ganache.

## Step 5. Run the Front End Application
`$ npm run dev`
Visit this URL in your browser: http://localhost:3000



