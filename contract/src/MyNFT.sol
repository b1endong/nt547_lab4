// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import các hợp đồng cần thiết từ thư viện OpenZeppelin
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Hợp đồng của chúng ta kế thừa từ các hợp đồng của OpenZeppelin
contract MyNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    // Khai báo biến mintFee
    uint256 public mintFee = 0.001 ether;
    // Giới hạn tổng cung
    uint256 public constant MAX_SUPPLY = 100;

    // Sử dụng thư viện Counters để tạo tokenId một cách an toàn
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Constructor: được gọi khi hợp đồng được triển khai
    // Nó khởi tạo bộ sưu tập NFT với tên và ký hiệu
    constructor() ERC721("MyNFTCollection", "MNC") {}

    // Hàm để mint một NFT mới
    // Chỉ "owner" của hợp đồng mới có thể gọi hàm này
    function safeMint(address to, string memory uri) public payable {
        // Kiểm tra xem tổng số NFT đã mint có vượt quá giới hạn không
        require(_tokenIds.current() < MAX_SUPPLY, "Max supply reached");

        // Kiểm tra xem người gọi có gửi đủ phí mint không
        require(msg.value >= mintFee, "Insufficient minting fee");

        // Lấy tokenId hiện tại và tăng nó lên cho lần mint tiếp theo
        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();

        // Mint token mới và gán cho địa chỉ "to"
        _safeMint(to, tokenId);

        // Đặt URI metadata cho token mới được mint
        _setTokenURI(tokenId, uri);

        // Gửi phí mint cho chủ sở hữu hợp đồng
        (bool sent, ) = owner().call{value: msg.value}("");
        require(sent, "Failed to send ETH to owner");
    }
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
