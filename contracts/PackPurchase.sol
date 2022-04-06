 //SPDX-License-Identifier: MIT
//pragma solidity ^0.8.0;

//contract packs {
    
    //address private owner;
    //address public nft;
    //address payable reciever = payable(0x656D444596499433411d60E1C9BAf979cb6C7f0c);
    //mapping (uint => uint) price;
    //bool ongoing = false;
    
    //event purchased();
    
    //constructor (){
        //owner = msg.sender;
    //}
    //function changeReciever(address payable _reciever) public{
        //require (msg.sender == owner, "You are not the owner");
        //reciever = _reciever;
    //}
    //function offeringStatus(bool _offering) public{
        //require (msg.sender ==  owner, "You are not the owner");
        //ongoing = _offering;
    //}
    //function returnStatus() public view returns(bool){
        //return ongoing;
    //}
    //function setnft(address _nft) public {
        //require (msg.sender == owner, "You are not the owner");
        //nft = _nft;
    //}

    //function setPrice(uint _nft, uint _price) public{
        //require (msg.sender == owner, "You are not the owner");
        //price[_nft] = _price;
    //}
    //function checkPrice(uint _nft) public view returns (uint){
        //return price[_nft];
    //}
    //function purchase(uint _nft) public payable {
        //require (msg.value >= price[_nft] * 10**18, "You didn't pay enough");
        //require (balance(_nft) > 0, "None left");
        //require (ongoing == true, "Presale is not started");
        //reciever.transfer(msg.value);
        //IERC1155(nft).safeTransferFrom(address(this), msg.sender, _nft, 1, "");
        //emit purchased();
    //}
    //function rescue(uint _nft) public {
        //require (msg.sender == owner, "You are not the owner");
        //IERC1155(nft).safeTransferFrom(address(this), msg.sender, _nft, balance(_nft), "");
    //}
    
    //function balance(uint _nft) public view returns (uint256){
        //return IERC1155(nft).balanceOf(address(this),_nft);
    //}

//}
