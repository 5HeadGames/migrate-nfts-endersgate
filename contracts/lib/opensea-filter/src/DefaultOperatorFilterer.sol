// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {OperatorFilterer} from "./OperatorFilterer.sol";

abstract contract DefaultOperatorFilterer is OperatorFilterer {
    address constant DEFAULT_SUBSCRIPTION =
        address(0x3cc6CddA760b79bAfa08dF41ECFA224f810dCeB6);

    constructor() OperatorFilterer(DEFAULT_SUBSCRIPTION, true) {}
}
