// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;
pragma experimental ABIEncoderV2;

contract JankenGame {
    struct JankenGameLog {
        uint16 winnerId;
        uint16 looserId;
        uint16 playerId1;
        uint16 playerId2;
        uint16 podSize;
        string playerHand1;
        string playerHand2;
        uint date;
    }
    string public playerHand1;
    string public playerHand2;
    uint16 playerId1;
    uint16 playerId2;
    uint16 podSize;

    JankenGameLog[] JankenGameLogs;

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function addJankenGameLog(uint16 winnerId, uint16 looserId) private  {
        JankenGameLogs.push(JankenGameLog(winnerId, looserId, playerId1, playerId2, podSize, playerHand1, playerHand2, block.timestamp));
    }
    function setPlayerHand1(string memory _playerHand1, uint16 _playerId1) public {
        //require(podSize > 0, "set podSize first!");
        //require(compareStrings(playerHand1, ""), "hand already set!");
        playerHand1 = _playerHand1;
        playerId1 = _playerId1;
    }
    function setPlayerHand2(string memory _playerHand2, uint16 _playerId2) public {
        //require(podSize > 0, "set podSize first!");
        //require(compareStrings(playerHand2, ""), "hand already set!");
        playerHand2 = _playerHand2;
        playerId2 = _playerId2;
    }
    function setPodSize(uint16 _podSize) public {
        podSize = _podSize;
    }
    function calcGame() public {
        if(compareStrings(playerHand1, playerHand2)) {
            addJankenGameLog(0, 0);
        }
        if(compareStrings(playerHand1, "G") && compareStrings(playerHand2, "C")) {
            addJankenGameLog(playerId1, playerId2);
        }
        if(compareStrings(playerHand1, "G") && compareStrings(playerHand2, "P")) {
            addJankenGameLog(playerId2, playerId1);
        }
        if(compareStrings(playerHand1, "C") && compareStrings(playerHand2, "P")) {
            addJankenGameLog(playerId1, playerId2);
        }
        if(compareStrings(playerHand1, "C") && compareStrings(playerHand2, "G")) {
            addJankenGameLog(playerId2, playerId1);
        }
        if(compareStrings(playerHand1, "P") && compareStrings(playerHand2, "G")) {
            addJankenGameLog(playerId1, playerId2);
        }
        if(compareStrings(playerHand1, "P") && compareStrings(playerHand2, "C")) {
            addJankenGameLog(playerId2, playerId1);
        }
        playerId1 = 0;
        playerId2 = 0;
        playerHand1 = "";
        playerHand2 = "";
        podSize = 0;
    }
    function getAllGameLog() public view returns (JankenGameLog[] memory) {
        return JankenGameLogs;
    }
}
