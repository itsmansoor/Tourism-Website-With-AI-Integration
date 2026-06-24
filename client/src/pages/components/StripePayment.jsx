import { useState } from "react";
import { usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";
import { useNavigate } from "react-router-dom";

const StripePayment = () => {
  const navigate = useNavigate();

  const {
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps,
  } = usePaymentInputs();

  const [card, setCard] = useState({
    number: "",
    cvc: "",
    exp_month: "",
    exp_year: "",
  });

  const handleNumberChange = (e) => {
    const value = e.target.value;
    setCard({ ...card, number: value });
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value;
    const month = value.split("/")[0];
    const year = value.split("/")[1];

    setCard({
      ...card,
      exp_month: month,
      exp_year: year,
    });
  };

  const handleCVCChange = (e) => {
    const value = e.target.value;
    setCard({ ...card, cvc: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formatNumber = card.number.replace(/\s+/g, "");
    const formatMonth = card.exp_month.trim();
    const formatYear = card.exp_year.trim();
    const formatCVC = card.cvc.trim();

    try {
      const res = await fetch(
        "http://localhost:8000/payment/create-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: "1000",
            exp_month: formatMonth,
            exp_year: formatYear,
            number: formatNumber,
            cvc: formatCVC,
          }),
        }
      );

      const result = await res.json();

      console.log("result", result);

      if (result.success) {
        navigate("/");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex justify-center items-center py-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
          Payment Details
        </h2>

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="relative mb-4">
            <input
              {...getCardNumberProps({
                onChange: handleNumberChange,
              })}
              placeholder="Card Number"
              required
              className="w-full p-2 pl-4 pr-12 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            <svg
              {...getCardImageProps({ images })}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-5"
            />
          </div>

          <div className="flex justify-between items-center mb-4 space-x-4">
            <input
              {...getExpiryDateProps({
                onChange: handleExpiryDateChange,
              })}
              placeholder="MM/YY"
              required
              className="w-1/2 p-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            <input
              {...getCVCProps({
                onChange: handleCVCChange,
              })}
              placeholder="CVC"
              required
              maxLength={3}
              className="w-1/2 p-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default StripePayment;