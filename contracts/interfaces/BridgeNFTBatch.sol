// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/**
 * Required for ERC-1155 / ERC721A while transferring NFTs / SFTs in batches
 */

interface BridgeNFTBatch {
  /* Mint multiple NFTs
    mintArgs are not supposed to be passed to the receiver but rather,
    must be used for custom logic in this contract (if any)
    In the current version, its safe to assume that amounts is an aray of ones
    */
  function mintBatch(
    address to,
    uint256[] calldata ids,
    uint256[] calldata amounts,
    bytes calldata mintArgs
  ) external virtual;

  // Burn Multiple nfts
  // In the current version, its safe to assume that amounts is an aray of ones
  function burnBatchFor(
    address from,
    uint256[] calldata ids,
    uint256[] calldata amounts
  ) external virtual;

  /* Mint a new NFT
    mintArgs are not supposed to be passed to the receiver but rather,
    must be used for custom logic in this contract (if any)
    */
  function mint(
    address to,
    uint256 id,
    bytes calldata mintArgs
  ) external virtual;

  // Burn an NFT
  function burnFor(address to, uint256 id) external virtual;

  /* Base URL of the contract
    Must follow the ERC1155Metadata_URI extension's {id} based format
    */
  function baseURI() external virtual returns (string memory);
}
