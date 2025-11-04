export default function ViewNft({metadata}) {
    if (!metadata) return null;

    const imageURL = metadata.image?.startsWith("ipfs://")
        ? metadata.image.replace(
              "ipfs://",
              "https://gateway.pinata.cloud/ipfs/"
          )
        : metadata.image;

    return (
        <div className="flex items-center bg-gray-900 border border-gray-700 rounded-2xl shadow-lg overflow-hidden p-6 text-gray-200">
            {/* NFT Image */}
            <div className=" w-56 h-56 rounded-xl overflow-hidden border border-gray-700">
                {imageURL ? (
                    <img
                        src={imageURL}
                        alt={metadata.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                        No image
                    </div>
                )}
            </div>

            {/* NFT Info */}
            <div className="ml-8 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-indigo-400 mb-2">
                    {metadata.name}
                </h2>
                <p className="text-gray-300 mb-3">{metadata.description}</p>

                <div className="text-sm space-y-1">
                    <p>
                        <span className="font-semibold text-gray-400">
                            Token ID:
                        </span>{" "}
                        {metadata.tokenId}
                    </p>
                    <p>
                        <span className="font-semibold text-gray-400">
                            Owner:
                        </span>{" "}
                        <span className="text-indigo-300">
                            {metadata.owner}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
