const opBNBTestnet = {
  id: 5611,
  network: 'opbnb',
  name: 'OPBNB Testnet',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://opbnb-testnet-rpc.bnbchain.org'],
    },
    public: {
      http: ['https://opbnb-testnet-rpc.bnbchain.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'OPBNB Testnet',
      url: 'http://opbnbscan.com',
    },
  },
  testnet: true,
};

export { opBNBTestnet as opBNB };
