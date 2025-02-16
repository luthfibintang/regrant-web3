const ItemCard = ({ item }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <img
        src={`https://picsum.photos/200?random=${item._id}`}
        alt={item.itemName}
        className="w-full h-52 object-cover rounded-lg"
      />
      <h2 className="text-lg font-bold mt-2">{item.itemName}</h2>
      <p className="text-gray-500">
        Owner: {item.ownerAddress.slice(0, 10)}...
      </p>
      <p className="text-primary font-semibold">{item.rentalFee} ETH/day</p>
    </div>
  );
};

export default ItemCard;
