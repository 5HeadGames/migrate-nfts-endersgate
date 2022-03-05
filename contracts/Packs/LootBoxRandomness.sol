// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;
import "hardhat/console.sol";

/*
  DESIGN NOTES:
  - We assume Class 0 is common!
  - Because this is a library we use a state struct rather than member
    variables. This struct is passes as the first argument to any functions that
    need it. This can make some function signatures look strange.
  - Because this is a library we cannot call owner(). We could include an owner
    field in the state struct, but this would add maintenance overhead for
    users of this library who have to make sure they change that field when
    changing the owner() of the contract that uses this library. We therefore
    append an _owner parameter to the argument list of functions that need to
    access owner(), which makes some function signatures (particularly _mint)
    look weird but is better than hiding a dependency on an easily broken
    state field.
  - We also cannot call onlyOwner or whenNotPaused. Users of this library should
    not expose any of the methods in this library, and should wrap any code that
    uses methods that set, reset, or open anything in onlyOwner().
    Code that calls _mint should also be wrapped in nonReentrant() and should
    ensure perform the equivalent checks to _canMint() in
    CreatureAccessoryFactory.
 */

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
  event Warning(string message, address account);

  uint256 constant INVERSE_BASIS_POINT = 10000;

  // NOTE: Price of the lootbox is set via sell orders on OpenSea
  struct OptionSettings {
    uint256[] classIds;
    uint256[] classProbabilities;
  }

  struct LootBoxRandomnessState {
    address factoryAddress;
    uint256 numOptions;
    uint256 numClasses;
    uint256 numTypes;
    mapping(uint256 => OptionSettings) optionToSettings;
    mapping(uint256 => uint256[]) classToTokenType;
    mapping(uint256 => uint256[]) classToTypeAmount;
    mapping(uint256 => uint256[]) typeTotokens;
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
    uint256 _numClasses,
    uint256 _numTypes,
    uint256 _seed
  ) public {
    _state.factoryAddress = _factoryAddress;
    _state.numOptions = _numOptions;
    _state.numClasses = _numClasses;
    _state.numTypes = _numTypes;
    _state.seed = _seed;
  }

  /**
   * @dev If the tokens for some class are pre-minted and owned by the
   * contract owner, they can be used for a given class by setting them here
   */
  function setClassForTokenId(
    LootBoxRandomnessState storage _state,
    uint256 _tokenId,
    uint256 _tokenAmount,
    uint256 _classId
  ) public {
    require(_classId < _state.numClasses, "_class out of range");
    _addTokenIdToClass(_state, _classId, _tokenId, _tokenAmount);
  }

  /**
   * @dev Alternate way to add token ids to a class
   * Note: resets the full list for the class instead of adding each token id
   */
  function setTokenTypeForClass(
    LootBoxRandomnessState storage _state,
    uint256 _classId,
    uint256[] memory _tokenTypes,
    uint256[] memory _tokenAmount
  ) public {
    require(_classId < _state.numClasses, "_class out of range");
    _state.classToTokenType[_classId] = _tokenTypes;
    _state.classToTypeAmount[_classId] = _tokenAmount;
  }

  function setTokensForTypes(
    LootBoxRandomnessState storage _state,
    uint256 _typeId,
    uint256[] memory _tokenIds
  ) public {
    require(_typeId < _state.numTypes, "_class out of range");
    _state.typeTotokens[_typeId] = _tokenIds;
  }

  /**
   * @dev Remove all token id for a given class, causing it to fall back to
   * creating/minting into the nft address
   */
  function resetClass(LootBoxRandomnessState storage _state, uint256 _classId) public {
    require(_classId < _state.numClasses, "_class out of range");
    delete _state.classToTokenType[_classId];
  }

  function setOptionSettings(
    LootBoxRandomnessState storage _state,
    uint256 _option,
    uint256[] memory _classIds,
    uint256[] memory _classProbabilities
  ) public {
    require(_option < _state.numOptions, "_option out of range");
    require(_classIds.length == _classProbabilities.length, "_options lenght mismatch");
    require(_classIds.length > 0, "_options lenght is zero");

    OptionSettings memory settings = OptionSettings({
      classIds: _classIds,
      classProbabilities: _classProbabilities
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

  ///////
  // MAIN FUNCTIONS
  //////

  /**
   * @dev Main minting logic for lootboxes
   * This is called via safeTransferFrom when CreatureAccessoryLootBox extends
   * CreatureAccessoryFactory.
   * NOTE: prices and fees are determined by the sell order on OpenSea.
   * WARNING: Make sure msg.sender can mint!
   */
  function _mint(
    LootBoxRandomnessState storage _state,
    uint256 _optionId,
    address _toAddress,
    uint256 _amount,
    bytes memory, /* _data */
    address _owner
  ) internal {
    require(_optionId < _state.numOptions, "_option out of range");
    // Load settings for this box option
    OptionSettings memory settings = _state.optionToSettings[_optionId];

    uint256 totalMinted = 0;
    // Iterate over the quantity of boxes specified
    for (uint256 i = 0; i < _amount; i++) {
      // Iterate over the box's set quantity
      uint256 quantitySent = 0;
      uint256 class = _pickRandomClass(_state, settings.classProbabilities, settings.classIds);
      uint256 quantityOfRandomized = _sendTokensWithClass(_state, class, _toAddress, _owner);
      quantitySent += quantityOfRandomized;

      totalMinted += quantitySent;
    }

    // Event emissions
    emit LootBoxOpened(_optionId, _toAddress, _amount, totalMinted);
  }

  /////
  // HELPER FUNCTIONS
  /////

  // Returns the tokenId sent to _toAddress
  function _sendTokensWithClass(
    LootBoxRandomnessState storage _state,
    uint256 _classId,
    address _toAddress,
    address _owner
  ) internal returns (uint256) {
    require(_classId < _state.numClasses, "_class out of range");
    Factory factory = Factory(_state.factoryAddress);
    uint256 amount = 0;
    for (uint256 i = 0; i < _state.classToTokenType[_classId].length; i++) {
      uint256 typeAmount = _state.classToTypeAmount[_classId][i];
      uint256 tokenType = _state.classToTokenType[_classId][i];
      uint256[] memory tokenIds = _state.typeTotokens[tokenType];

      for (uint256 j = 0; j < typeAmount; j++) {
        uint256 tokenId = tokenIds[_random(_state) % tokenIds.length];
        factory.mint(_toAddress, tokenId, 1, "");
      }

      amount += typeAmount;
    }
    return amount;
  }

  function _pickRandomClass(
    LootBoxRandomnessState storage _state,
    uint256[] memory _classProbabilities,
    uint256[] memory _classIds
  ) internal returns (uint256) {
    uint256 value = uint256(_random(_state) % (INVERSE_BASIS_POINT));
    // Start at top class (length - 1)
    // skip common (0), we default to it
    for (uint256 i = _classProbabilities.length - 1; i > 0; i--) {
      uint256 probability = _classProbabilities[i];
      if (value < probability) {
        return _classIds[i];
      } else {
        value = value - probability;
      }
    }
    //FIXME: assumes zero is common!
    return _classIds[0];
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

  function _addTokenIdToClass(
    LootBoxRandomnessState storage _state,
    uint256 _classId,
    uint256 _tokenId,
    uint256 _tokenAmount
  ) internal {
    // This is called by code that has already checked this, sometimes in a
    // loop, so don't pay the gas cost of checking this here.
    //require(_classId < _state.numClasses, "_class out of range");
    _state.classToTokenType[_classId].push(_tokenId);
    _state.classToTypeAmount[_classId].push(_tokenAmount);
  }
}
