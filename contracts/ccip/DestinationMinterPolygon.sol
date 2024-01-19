// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {EndersComicsMultiTokens} from "../Native&Multitokens/EndersComicsMultiTokens.sol";

contract DestinationMinterPolygon is CCIPReceiver {
    EndersComicsMultiTokens nft =
        EndersComicsMultiTokens(0xf484F0983FcB0C0f0456d34624B912b2F22793B6);

    event MintCallSuccessfull();

    constructor() CCIPReceiver(0x70499c328e1E2a3c41108bd3730F6670a44595D1) {}

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (bool success, ) = address(nft).call(message.data);
        require(success);
        emit MintCallSuccessfull();
    }
}
