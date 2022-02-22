const ABI = require('../utils/harmony/abi')
const EndersGate = require('../artifacts/contracts/EndersGate.sol/EndersGate.json')

const {hasAllSignatures} = ABI()

const expectedMethodsAndEvents = [
  'TransferSingle',
  'TransferBatch',
  // 'totalSupply',
  'owner',
  'tokenURIPrefix',
  'balanceOfBatch',
  'contractURI',
]

const main = async () => {
  console.log({
    res: hasAllSignatures(expectedMethodsAndEvents, EndersGate.bytecode)
  })
};

main()
  .then(() => {})
  .catch((err) => {
    console.log("ERR", err);
  });
