//https://eth-goerli.g.alchemy.com/v2/AlNzok6CyGEJWACnaurXTFGO9myzDNIR

require('@nomiclabs/hardhat-waffle');

module.exports = {
  defaultNetwork: "goerli",
  networks: {
    hardhat: {
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/AlNzok6CyGEJWACnaurXTFGO9myzDNIR",
      accounts: ['79762310e66f372f0dec75c57fd66e594d6460002da168d9335acfffa488f1e2']
    }
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}
