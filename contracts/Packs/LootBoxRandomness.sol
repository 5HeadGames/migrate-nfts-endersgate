// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

abstract contract Factory {
  function mint(
    address _toAddress,
    uint256 _optionId,
    uint256 _amount,
    string memory _data
  ) external virtual;

  function balanceOf(address _owner, uint256 _optionId) public view virtual returns (uint256);
}

/**
 * @title LootBoxRandomness
 * LootBoxRandomness- support for a randomized and openable lootbox.
 */
library LootBoxRandomness {
  // Event for logging lootbox opens
  event LootBoxOpened(
    uint256 indexed optionId,
    address indexed buyer,
    uint256 boxesPurchased,
    uint256 itemsMinted
  );

  uint256 constant INVERSE_BASIS_POINT = 10000;

  struct OptionSettings {
    uint256[] typeIds;
    uint256[] typeInferiorLimit;
    uint256[] typeSuperiorLimit;
    uint256 mintLimit;
  }

  struct LootBoxRandomnessState {
    address factoryAddress;
    uint256 numOptions;
    uint256 numTypes;
    mapping(uint256 => OptionSettings) optionToSettings;
    mapping(uint256 => uint256[]) typeToTokens;
    uint256 seed;
  }

  //////
  // INITIALIZATION FUNCTIONS FOR OWNER
  //////

  /**
   * @dev Set up the fields of the state that should have initial values.
   */
  function initState(
    LootBoxRandomnessState storage _state,
    address _factoryAddress,
    uint256 _numOptions,
    uint256 _numTypes,
    uint256 _seed
  ) public {
    _state.factoryAddress = _factoryAddress;
    _state.numOptions = _numOptions;
    _state.numTypes = _numTypes;
    _state.seed = _seed;
  }

  /**
   * @dev If the tokens for some class are pre-minted and owned by the
   * contract owner, they can be used for a given class by setting them here
   */
  function setTokensForTypes(
    LootBoxRandomnessState storage _state,
    uint256 _typeId,
    uint256[] memory _tokenIds
  ) public {
    require(_typeId < _state.numTypes, "type out of range");
    _state.typeToTokens[_typeId] = _tokenIds;
  }

  /**
   * @dev Remove all token id for a given class, causing it to fall back to
   * creating/minting into the nft address
   */
  function resetOption(LootBoxRandomnessState storage _state, uint256 _option) public {
    require(_option < _state.numOptions, "_typeId out of range");
    delete _state.optionToSettings[_option];
  }

  function setOptionSettings(
    LootBoxRandomnessState storage _state,
    uint256 _option,
    uint256 _mintLimit,
    uint256[] memory _typeIds,
    uint256[] memory _typeInferiorLimit,
    uint256[] memory _typeSuperiorLimit
  ) public {
    require(_option < _state.numOptions, "_option out of range");
    require(_typeIds.length == _typeInferiorLimit.length, "params lenght mismatch");
    require(_typeIds.length == _typeSuperiorLimit.length, "params lenght mismatch");
    require(_typeIds.length > 0, "_options lenght is zero");

    OptionSettings memory settings = OptionSettings({
      typeIds: _typeIds,
      typeInferiorLimit: _typeInferiorLimit,
      typeSuperiorLimit: _typeSuperiorLimit,
      mintLimit: _mintLimit
    });

    _state.optionToSettings[_option] = settings;
  }

  /**
   * @dev Improve pseudorandom number generator by letting the owner set the seed manually,
   * making attacks more difficult
   * @param _newSeed The new seed to use for the next transaction
   */
  function setSeed(LootBoxRandomnessState storage _state, uint256 _newSeed) public {
    _state.seed = _newSeed;
  }

  /**
   * @dev Main minting logic for lootboxes
   */
  function _mint(
    LootBoxRandomnessState storage _state,
    uint256 _optionId,
    address _toAddress,
    uint256 _amount,
    bytes memory, /* _data */
    address _owner
  ) internal returns (uint256) {
    require(_optionId < _state.numOptions, "_option out of range");

    OptionSettings memory settings = _state.optionToSettings[_optionId];
    uint256 finalMinted = 0;

    for (uint256 i = 0; i < _amount; i++) {
      uint256 totalMinted = 0;
      uint256[] memory typesMinted = new uint256[](settings.typeIds.length);

      for (uint256 j = 0; j < settings.typeIds.length; j++) {
        //send guaranteed
        if (settings.typeInferiorLimit[j] > 0) {
          uint256 amount = settings.typeInferiorLimit[j];
          _sendTokensWithType(_state, _toAddress, settings.typeIds[j], amount);
          totalMinted += amount;
          typesMinted[j] += amount;
        }
      }

      for (; totalMinted < settings.mintLimit; ) {
        uint256 typeIndex = uint256(_random(_state) % settings.typeIds.length);

        if (typesMinted[typeIndex] >= settings.typeSuperiorLimit[typeIndex]) continue;
        _sendTokensWithType(_state, _toAddress, settings.typeIds[typeIndex], 1);

        totalMinted++;
        typesMinted[typeIndex]++;
      }

      finalMinted += totalMinted;
      emit LootBoxOpened(_optionId, _toAddress, _amount, totalMinted);
    }

    // Event emissions
    return finalMinted;
  }

  function _sendTokensWithType(
    LootBoxRandomnessState storage _state,
    address _toAddress,
    uint256 _typeId,
    uint256 amount
  ) internal {
    require(_typeId < _state.numTypes, "type out of range");
    Factory factory = Factory(_state.factoryAddress);

    for (uint256 i = 0; i < amount; i++) {
      uint256 tokenIndex = uint256(_random(_state) % _state.typeToTokens[_typeId].length);
      uint256 tokenId = _state.typeToTokens[_typeId][tokenIndex];
      factory.mint(_toAddress, tokenId, 1, "");
    }
  }

  /**
   * @dev Pseudo-random number generator
   * NOTE: to improve randomness, generate it with an oracle
   */
  function _random(LootBoxRandomnessState storage _state) internal returns (uint256) {
    uint256 randomNumber = uint256(
      keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, _state.seed))
    );
    _state.seed = randomNumber;
    return randomNumber;
  }
}
