import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeFromCart, clearCart } from "../slices/cartSlice";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import AuthContext from "../context/authContext";

export default function Cart() {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const { cartData } = useSelector((state) => state.carts);
  console.log("cartData", cartData);

  const handleRemove = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(removeFromCart(id));
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure?")) {
      dispatch(clearCart());
    }
  };

  const handleRent = () => {
    navigate("/order-placing");
  };
  const handleBuy = () => {
    navigate("/order-placing");
  };
 

  return (
    <div className="min-h-screen bg-[#F4F1DE] p-6">
      {/* Header */}
      <header className="w-full h-16 bg-[#2C3E50] text-white p-4 flex justify-between items-center px-6 left-0 top-0 shadow-md">
        <h1 className="text-2xl font-bold">Bookmate</h1>
        <div className="ml-auto flex gap-4">
          <Link to="/profile" className="flex items-center gap-2 text-white hover:underline">
            <AiOutlineUser size={24} /> Profile
          </Link>
          <Link to="/cart" className="flex items-center gap-2 text-white hover:underline">
            <AiOutlineShoppingCart size={24} /> Cart
          </Link>
          <li>
            <button
              onClick={() => {
                const confirm = window.confirm("Logged out?");
                if (confirm) {
                  handleLogout();
                  localStorage.removeItem("token");
                  navigate("/login");
                }
              }}
              className="text-white hover:underline"
            >
              Logout
            </button>
          </li>
        </div>
      </header>

      {/* Cart Content */}
      <div className="max-w-4xl mx-auto bg-[#F8F8F8] p-8 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold text-center text-[#1A1A1A] mb-6">
          My Cart ({cartData?.length})
        </h2>

        {cartData?.length === 0 ? (
          <p className="text-center text-[#3D405B]">Your cart is empty</p>
        ) : (
          <>
            {/* Cart Items */}
            {cartData?.map((ele) => (
              <div
                key={ele._id}
                className="flex flex-col md:flex-row gap-6 border border-[#3D405B] rounded-lg p-4 mb-4 bg-white"
              >
                {/* Book Cover Image */}
                <img
                  src={ele.book?.coverImage}
                  alt={ele.book?.modifiedTitle}
                  className="w-32 h-48 object-cover rounded-lg shadow-md"
                />

                {/* Book Details */}
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-[#1A1A1A]">
                    {ele.book?.modifiedTitle}
                  </h2>
                  <h3 className="text-[#3D405B]">Vendor: {ele.book?.vendor.name}</h3>

                  {/* Rent Details */}
                  {ele.rent && (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-[#3D405B]">
                        <span className="font-semibold">Duration:</span> {ele.rent?.period} days
                      </h3>
                      <h3 className="text-[#3D405B]">
                        <span className="font-semibold">Amount to Pay:</span> ₹
                        {ele.rent?.pricing.cautionDeposit +
                          ele.rent?.pricing.deliveryFee +
                          ele.rent?.pricing.platformFee +
                          ele.rent?.pricing.readingFee}
                      </h3>
                    </div>
                  )}

                  {/* Buy Details */}
                  {ele.buy && (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-[#3D405B]">
                        <span className="font-semibold">Sell Price:</span> ₹{ele.book?.sellPrice}
                      </h3>
                      <h3 className="text-[#3D405B]">
                        <span className="font-semibold">Total Amount to Pay:</span> ₹
                        {ele.book?.sellPrice + 10 + 30}
                      </h3>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(ele._id)}
                    className="mt-4 bg-[#E07A5F] text-white px-4 py-2 rounded-lg hover:bg-[#D56A4F] transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            {cartData?.length > 0 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleClear}
                  className="bg-[#3D405B] text-white px-6 py-2 rounded-lg hover:bg-[#2C3E50] transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}

            {/* Proceed Buttons */}
            {cartData?.length > 0 && (
              <div className="flex justify-end gap-4 mt-6">
                {cartData.some((item) => item.rent) && (
                  <button
                    onClick={handleRent}
                    className="bg-[#3D405B] text-white px-6 py-2 rounded-lg hover:bg-[#3D405B] transition-colors"
                  >
                    Proceed to Rent
                  </button>
                )}
                {cartData.some((item) => item.buy) && (
                  <button
                    onClick={handleBuy}
                    className="bg-[#3D405B] text-white px-6 py-2 rounded-lg hover:bg-[#3D405B] transition-colors"
                  >
                    Proceed to Buy
                  </button>
                )}
                
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}