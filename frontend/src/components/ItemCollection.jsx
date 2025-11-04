export default function ItemCollection({nft}) {
    console.log("ItemCollection nft:", nft);
    const imageURL = nft.image?.startsWith("ipfs://")
        ? nft.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
        : nft.image;

    return (
        <div className="border border-gray-700 cols-span-1 rows-span-1 w-full h-full rounded-2xl shadow-lg overflow-hidden p-5 text-gray-100 hover:shadow-2xl hover:border-gray-500 transition-all duration-300 ease-in-out ">
            {/* NFT Image */}
            <div className="relative w-full overflow-hidden rounded-xl mb-4">
                {imageURL ? (
                    <img
                        src={imageURL}
                        alt={nft.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
                        No image
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-80 text-xs px-2 py-1 rounded-md border border-gray-600">
                    #{nft.tokenId}
                </div>
            </div>

            {/* NFT Info */}
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-white truncate">
                    {nft.name || "Unnamed NFT"}
                </h3>
                <p className="text-sm text-gray-400 leading-snug line-clamp-3">
                    {nft.description || "No description provided."}
                </p>
            </div>
        </div>
    );
}
