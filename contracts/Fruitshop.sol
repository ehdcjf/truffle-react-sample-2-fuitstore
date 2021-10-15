// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/*
  1. 보낸 사람의 계정에서 사과를 총 몇 개 가지고 있는지 확인
  2. 사과를 구매했을 떄 해당 계정(주소)에 사과를 추가한다. 
  3. 사과를 판매할 시 내가 가지고 있는 사과* 사과 구매가격 만큼 토큰을 반환해주고. 
      보유하고 있는 사과의 개수를 조정한다. 
 */

contract Fruitshop {

  mapping(address => uint) myApple;

  constructor() public {

  }

  function buyApple() payable external {
    myApple[msg.sender]++;
  }

  function showMyApple() public view returns(uint){
    return myApple[msg.sender]; 
  }

  function sellApple(uint _applePrice) payable external {
    require(showMyApple()!=0);
    uint totalPrice = (myApple[msg.sender] * _applePrice);
    myApple[msg.sender]  = 0;
    msg.sender.transfer(totalPrice);

  }
}
