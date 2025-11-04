import {useState} from "react";
import {BrowserProvider, Contract, parseEther} from "ethers";
import {contractData} from "../contract/contractData.jsx";
import "./App.css";
import ViewNft from "./components/ViewNft.jsx";
import ViewCollection from "./components/ViewCollection.jsx";

// ==================================================================
const contractAddress = contractData.contractAddr;
const contractAbi = contractData.contractAbi;

const metadataURI =
    "https://gateway.pinata.cloud/ipfs/bafkreigwnpoidgkb64wlwpb2j3ewgu574kreu6vbzu32hq3kzpgjt5wzgi";
// ==================================================================

function App() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [status, setStatus] = useState(null);
    const [txHash, setTxHash] = useState(null);
    const [viewNft, setViewNft] = useState(false);
    const [nftContract, setNftContract] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [nfts, setNfts] = useState([]);
    const [viewCollection, setViewCollection] = useState(false);
    const [viewMinting, setMintingStatus] = useState(false);

    async function connectWallet() {
        if (!window.ethereum) return alert("Please install MetaMask!");
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setWalletAddress(accounts[0]);

            if (typeof window.ethereum !== "undefined") {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const nftContract = new Contract(
                    contractAddress,
                    contractAbi,
                    signer
                );
                setNftContract(nftContract);
            }
        } catch (error) {
            console.error("User denied access:", error);
        }
    }

    async function handleMint() {
        if (!walletAddress) return alert("Please connect wallet first!");
        try {
            setStatus("⛏️ Minting... Please confirm in MetaMask...");
            setTxHash(null);

            const mintFee = parseEther("0.001");
            const tx = await nftContract.safeMint(walletAddress, metadataURI, {
                value: mintFee,
            });
            await tx.wait();

            setStatus("✅ Mint successful!");
            setTxHash(tx.hash);
        } catch (error) {
            setStatus(`❌ Mint failed: ${error.code}`);
        }
    }

    async function handleViewNft(nftTokenId) {
        setStatus("⛏️ Fetching NFT metadata...");
        if (nftTokenId === "" || isNaN(nftTokenId)) {
            setStatus("❌ Please enter a valid Token ID.");
            setMetadata(null);
            return;
        }
        try {
            const tokenURI = await nftContract.tokenURI(nftTokenId);
            const owner = await nftContract.ownerOf(nftTokenId);

            const metadataResponse = await fetch(tokenURI);
            const metadata = await metadataResponse.json();
            const metadataJson = {
                tokenId: nftTokenId,
                name: metadata.name,
                description: metadata.description,
                image: metadata.image,
                owner: owner,
            };
            setMetadata(metadataJson);
            setStatus("✅ NFT metadata fetched successfully!");
        } catch (error) {
            setStatus(`❌ Failed to fetch Token URI: ${error.code}`);
            setMetadata(null);
        }
    }

    async function handleViewCollection() {
        setStatus("⛏️ Fetching your NFT collection...");
        const totalNfts = await nftContract.balanceOf(walletAddress);
        const nfts = [];
        try {
            for (let i = 0; i < totalNfts; i++) {
                const tokenId = await nftContract.tokenOfOwnerByIndex(
                    walletAddress,
                    i
                );
                const tokenURI = await nftContract.tokenURI(Number(tokenId));
                const metadata = await fetch(tokenURI).then((res) =>
                    res.json()
                );
                nfts.push({
                    tokenId: Number(tokenId),
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                });
            }
            setStatus(`✅ Fetched ${nfts.length} NFTs in your collection.`);
            setNfts(nfts);
            console.log("NFTs:", nfts);
            setViewCollection(true);
        } catch (error) {
            setStatus(`❌ Failed to fetch collection: ${error.code}`);
            setViewCollection(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center py-10 px-5 font-sans text-gray-200">
            <div className="w-full max-w-4xl bg-gray-900/80 shadow-2xl rounded-3xl p-10 border border-gray-700 backdrop-blur-md">
                <h1 className="text-4xl font-bold text-indigo-400 text-center mb-8">
                    My NFT DApp
                </h1>

                <div className="flex justify-center mb-6">
                    <button
                        onClick={connectWallet}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                        {walletAddress
                            ? `Connected: ${walletAddress.substring(
                                  0,
                                  6
                              )}...${walletAddress.substring(38)}`
                            : "Connect Wallet"}
                    </button>
                </div>

                {walletAddress && (
                    <div>
                        <div className="text-center flex flex-col space-y-6">
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => {
                                        handleMint();
                                        setMetadata(null);
                                        setViewCollection(false);
                                        setMintingStatus(true);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                                >
                                    Mint My NFT
                                </button>

                                {viewNft ? (
                                    <input
                                        type="text"
                                        className="bg-gray-800 border-2 border-gray-600 rounded-xl px-4 py-2 w-36 text-center text-gray-200 outline-none focus:border-indigo-500"
                                        placeholder="Token ID"
                                        onChange={(e) =>
                                            setNftTokenId(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleViewNft(
                                                    Number(e.target.value)
                                                );
                                                setViewCollection(false);
                                                setViewNft(true);
                                                setMintingStatus(false);
                                            }
                                        }}
                                    />
                                ) : (
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                                        onClick={() => setViewNft(true)}
                                    >
                                        View NFT
                                    </button>
                                )}
                            </div>

                            <div className="w-1/2 mx-auto">
                                <button
                                    onClick={() => {
                                        handleViewCollection();
                                        setMetadata(null);
                                        setMintingStatus(false);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition w-full"
                                >
                                    Show my collection
                                </button>
                            </div>

                            {status && (
                                <p className="text-gray-300 font-medium">
                                    {status}
                                </p>
                            )}

                            {txHash && viewMinting && (
                                <a
                                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 underline hover:text-indigo-300"
                                >
                                    🔍 View Transaction on Etherscan
                                </a>
                            )}
                        </div>
                        {metadata && (
                            <div className="mt-10">
                                <ViewNft metadata={metadata} />
                            </div>
                        )}
                        {viewCollection && nfts.length > 0 && (
                            <div className="mt-10">
                                <ViewCollection nfts={nfts} />
                            </div>
                        )}
                        {viewCollection && nfts.length == 0 && (
                            <div className="mt-10">No NFTs in collection.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
