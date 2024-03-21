const firstSentences = [
  "Lorem cryptum dolor sit amet, consectetur adipiscing fiat elit.",
  "Crypto ipsum dolor sit amet, consectetur adipiscing blockchain elit.",
  "Hodl ipsum dolor sit amet, consectetur adipiscing fiat elit.",
  "Token ipsum dolor sit amet, consectetur adipiscing blockchain elit.",
  "Fiat ipsum dolor sit amet, consectetur adipiscing blockchain elit.",
];

const randomSentences = [
  "Shiba Inu enim ad minim veniam, quis nostrud exercitation ullamco metaverse laboris nisi ut aliquip ex ea commodo consequat.",
  "Satoshi Nakamoto Duis aute irure dolor in reprehen-dogecoin-derit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt decentralized mollit anim id est laborum.",
  "Shiba Inu sed do eiusmod token incididunt ut labore et dolore magna aliqua.",
  "Hodl enim ad minim veniam, quis nostrud exercitation ether decentralized laboris nisi ut aliquip ex ea commodo consequat.",
  "Velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt fugiat nulla pariatur.",
  "Ether Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Metaverse Duis aute irure dolor in reprehen-bitcoin-derit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt anim id est laborum.",
  "Metamask sed do eiusmod token incididunt ut labore et dolore magna aliqua.",
  "Fiat enim ad minim veniam, quis nostrud exercitation decentralized laboris nisi ut aliquip ex ea commodo consequat.",
  "Web3 Duis aute irure dolor in reprehen-NFT-derit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Dogecoin sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt fugiat nulla pariatur.",
  "Bitcoin Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "NFT sed do eiusmod token incididunt ut labore et dolore magna aliqua.",
];

const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomBlobText = () => {
  const firstSentence = getRandomElement(firstSentences);
  const otherSentences = Array.from({ length: 3 }, () =>
    getRandomElement(randomSentences),
  );
  return [firstSentence, ...otherSentences].join(" ");
};
