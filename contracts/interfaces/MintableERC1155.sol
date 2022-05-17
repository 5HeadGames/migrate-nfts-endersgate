// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { IERC1155MetadataURI } from "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

interface MintableERC1155 is IERC1155MetadataURI {
  function mint(
    address _to,
    uint256 _optionId,
    uint256 _amount,
    string memory _data
  ) external;

  function mintBatch(
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    string memory
  ) external;
}
