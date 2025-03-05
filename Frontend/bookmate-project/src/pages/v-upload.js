import { useDispatch, useSelector } from "react-redux";
import { upload, updateBook } from "../slices/bookSlice";
import { uploadBuy } from "../slices/buySlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const { serverError, editId, uploaded } = useSelector((state) => state.books);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formInitialValue = {
    title: "",
    rentPrice: "",
    sellPrice: "",
    condition: "",
    isSelling: true,
  };

  const [form, setForm] = useState(formInitialValue);
  const [clientError, setClientError] = useState({});

  const errors = {};
  const runClientValidation = () => {
    if (form.title.trim().length === 0) {
      errors.title = "*Title is required";
    }
    if (form.rentPrice < 0) {
      errors.rentPrice = "*Rent price must be positive";
    }
    if (form.sellPrice < 0) {
      errors.sellPrice = "*Sell price must be positive";
    }
    if (!form.condition) {
      errors.condition = "*Condition is required";
    }
  };

  useEffect(() => {
    if (editId) {
      const book = uploaded.find((ele) => ele._id === editId);
      setForm({ ...book });
    }
  }, [editId, uploaded]);
const resetForm=()=>{
    setForm(formInitialValue)
}
  const handleSubmit = (e) => {
    e.preventDefault();
    runClientValidation();
    if (Object.keys(errors).length === 0) {
      if (editId) {
        dispatch(updateBook({ form, id: editId }));
        navigate("/vhome");
      } else {
        dispatch(upload({ form,resetForm }))
          .then((action) => {
            if (action?.payload?._id) {
              navigate(`/book/${action.payload._id}/uploadrentDetails`);
              dispatch(uploadBuy({ bid: action.payload._id }));
            }
          });
      }
    } else {
      setClientError(errors);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Share Here..!</h2>
      {serverError && (
        <ul className="text-red-500 text-sm mb-4">
          {Array.isArray(serverError) ? (
            serverError.map((ele, index) => <li key={index}>{ele}</li>)
          ) : (
            <li>{serverError}</li>
          )}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg w-96">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter the Title.."
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        {clientError.title && <p className="text-red-500 text-sm">{clientError.title}</p>}

        <div className="mb-2">
          <label className="block text-gray-700">Is Selling?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isSelling"
                value="true"
                checked={form.isSelling === true}
                onChange={() => setForm({ ...form, isSelling: true })}
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isSelling"
                value="false"
                checked={form.isSelling === false}
                onChange={() => setForm({ ...form, isSelling: false })}
              />
              No
            </label>
          </div>
        </div>

        <label className="block text-gray-700">Condition</label>
        <select
          value={form.condition}
          onChange={(e) => setForm({ ...form, condition: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        >
          <option value="" disabled>Select</option>
          <option value="fair">Fair</option>
          <option value="new">New</option>
          <option value="good">Good</option>
        </select>
        {clientError.condition && <p className="text-red-500 text-sm">{clientError.condition}</p>}

        <input
          type="number"
          value={form.rentPrice}
          onChange={(e) => setForm({ ...form, rentPrice: e.target.value })}
          placeholder="Enter the Rent Price"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        {clientError.rentPrice && <p className="text-red-500 text-sm">{clientError.rentPrice}</p>}

        {form.isSelling && (
          <>
            <input
              type="number"
              value={form.sellPrice}
              onChange={(e) => setForm({ ...form, sellPrice: e.target.value })}
              placeholder="Enter the Sell Price"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            {clientError.sellPrice && <p className="text-red-500 text-sm">{clientError.sellPrice}</p>}
          </>
        )}

        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-2 rounded mt-4 hover:bg-orange-600 transition"
        >
          {editId ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
