# Solidity Test for Settle

### by [Rodrigo Acosta](https://github.com/acostarodrigo)

## Folder structure

`Contracts`: holds the source code of the smart contracts:

* STLToken: an ERC-20 token used as money to interact with the pool.
* STLPool: the STLHarvest’s pool with the requested logic.

`ignition`: holds the modules that deploy the contracts and deployment results

`scripts`: holds the deployment script

`test`: holds the test scripts for both contracts.

## Smart contract deployment
I have used Sepolia testnet network to depoy and verify the smart contracts.
They can be found and reviewed here:

`STLToken`: [0x0b16b4D3AD610712d34Ce7d9A87fD4cAD00B0D71](https://sepolia.etherscan.io/address/0x0b16b4D3AD610712d34Ce7d9A87fD4cAD00B0D71#code)

`STLPool`: [0x489d54C07D7a0d9bbFB755991CfB2d1fdCF53DB2](https://sepolia.etherscan.io/address/0x489d54C07D7a0d9bbFB755991CfB2d1fdCF53DB2#code)


## Execution
A `Dockerfile` has been provided to facilitate execution of the code.

Complete the following steps:

1. Clone this repository by executing:
```
git clone https://github.com/acostarodrigo/settle_test.git
```

2. Build a docker container by passing the 
```
docker build -t solidity_exam .
```
3. Run the Docker image you just created
```
docker run solidity_exam:latest
```

The following output is displayed showing all tests have passed
```
> soliditytest@1.0.0 test
> npx hardhat test

Downloading compiler 0.8.24
Downloading compiler 0.8.24
Compiled 20 Solidity files successfully (evm target: paris).


  Pool contract tests
    ✔ Should allow Alice to deposit on the pool (552ms)
    ✔ Should allow Bob to deposit on the pool
    ✔ Should allow HT to reward on the pool
    ✔ Should not allow a non owner account to reward on the pool
    ✔ Should allow Alice and Bob to withdraw the correct amount - 1st scenario
    ✔ Should allow Alice and Bob to withdraw the correct amount - 2nd scenario
    ✔ Should not allow Alice to withdraw without a deposit
    ✔ Should not allow Bob to perform multiple deposits without withdraws

  STLToken contract
    ✔ Allows the owner to mint to everyone
    ✔ Will fail if someone else mints


  10 passing (624ms)
```


