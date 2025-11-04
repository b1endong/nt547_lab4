import ItemCollection from "./ItemCollection";

export default function ViewCollection({nfts}) {
    return (
        <div className="grid grid-cols-3 items-center gap-4">
            {nfts.map((nft) => (
                <ItemCollection key={nft.tokenId} nft={nft} />
            ))}
        </div>
    );
}
