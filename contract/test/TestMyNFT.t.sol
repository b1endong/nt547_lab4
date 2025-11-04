// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyNFT.sol";

contract TestMyNFT is Test {
    MyNFT private myNFT;
    address private owner = makeAddr("owner");
    address private user = makeAddr("user");
    address private anotherUser = makeAddr("anotherUser");
    string private uri =
        "ipfs://bafkreicwti62dzx54dgv3otjhalhz4duupqa4iz7hqnbkyul6bkwtz722i";
    uint256 balance = 1 ether;

    function setUp() public {
        vm.prank(owner);
        myNFT = new MyNFT();
        vm.deal(user, balance);
        vm.deal(anotherUser, balance);
    }

    function testSetUp() public {
        assertEq(myNFT.mintFee(), 0.001 ether);
        assertEq(myNFT.MAX_SUPPLY(), 100);
    }

    function testMintingByOwner() public {
        uint256 initialBalance = owner.balance;

        // Mint NFT as owner
        vm.prank(user);
        myNFT.safeMint{value: 0.001 ether}(user, uri);

        // Verify ownership and URI
        assertEq(myNFT.ownerOf(0), user);
        assertEq(myNFT.tokenURI(0), uri);

        // Verify owner's balance increased by mint fee
        assertEq(owner.balance, initialBalance + 0.001 ether);
        assertEq(user.balance, balance - 0.001 ether);
    }

    function testMintingExceedsMaxSupply() public {
        // Mint up to max supply
        for (uint256 i = 0; i < myNFT.MAX_SUPPLY(); i++) {
            myNFT.safeMint{value: 0.001 ether}(user, uri);
        }

        // Attempt to mint one more should fail
        vm.expectRevert("Max supply reached");
        myNFT.safeMint{value: 0.001 ether}(user, uri);
    }

    function testMintingWithInsufficientFee() public {
        // Attempt to mint with insufficient fee should fail
        vm.expectRevert("Insufficient minting fee");
        vm.prank(user);
        myNFT.safeMint{value: 0.0005 ether}(user, uri);
    }

    function testERC721Enumerable() public {
        // Mint multiple NFTs
        vm.prank(user);
        myNFT.safeMint{value: 0.001 ether}(user, uri);
        vm.prank(anotherUser);
        myNFT.safeMint{value: 0.001 ether}(anotherUser, uri);
        vm.prank(user);
        myNFT.safeMint{value: 0.001 ether}(user, uri);

        assertEq(myNFT.balanceOf(user), 2);
        assertEq(myNFT.balanceOf(anotherUser), 1);

        // Verify tokenOfOwnerByIndex
        assertEq(myNFT.tokenOfOwnerByIndex(user, 0), 0);
        assertEq(myNFT.tokenOfOwnerByIndex(user, 1), 2);
    }
}
