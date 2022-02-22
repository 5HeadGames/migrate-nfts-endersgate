pragma solidity 0.8.10;

import "../interface/IERC1155MetadataURI.sol";
import "./HasTokenURI.sol";

/**
    Note: The ERC-165 identifier for this interface is 0x0e89341c.
*/
contract ERC1155MetadataURI is IERC1155MetadataURI, HasTokenURI {
    constructor(string memory _tokenURIPrefix) public HasTokenURI(_tokenURIPrefix) {}

    function uri(uint256 _id) external view override returns (string memory) {
        return _tokenURI(_id);
    }
}
