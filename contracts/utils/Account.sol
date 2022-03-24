// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

contract Account is ERC1155Receiver {
    using Address for address;

    function execute(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata dataElements
    ) external payable {
        for (uint8 i = 0; i < targets.length; i++) {
            targets[i].functionCallWithValue(dataElements[i], values[i]);
        }
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155Receiver)
        returns (bool)
    {
        return
            interfaceId == type(IERC1155Receiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4) {
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4) {
        return
            bytes4(
                keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)")
            );
    }
}
