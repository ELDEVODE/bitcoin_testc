import { useState } from "react";
import { bitcoin_test_backend } from "../../../declarations/bitcoin_test_backend";
import { HashLoader } from "react-spinners";

export default function GetAddress() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [balanceAddress, setBalanceAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [generateAddressLoading, setGenerateAddressLoading] = useState(false);
  const [getBalanceLoading, setGetBalanceLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  async function get_p2pkh_address() {
    setGenerateAddressLoading(true);
    try {
      const address = await bitcoin_test_backend.get_p2pkh_address();
      setAddress(address);
    } catch (error) {
      console.error("Error generating address:", error);
    } finally {
      setGenerateAddressLoading(false);
    }
  }

  async function getBalance() {
    if (!balanceAddress) {
      alert("Please enter an address to get its balance.");
      return;
    }
    setGetBalanceLoading(true);
    try {
      const balanceRes = await bitcoin_test_backend.get_balance(balanceAddress);
      setBalance(balanceRes.toString());
    } catch (error) {
      console.error("Error getting balance:", error);
    } finally {
      setGetBalanceLoading(false);
    }
  }

  async function send() {
    if (!destinationAddress || !amount) {
      alert("Please enter both destination address and amount.");
      return;
    }
    setSendLoading(true);
    try {
      const response = await bitcoin_test_backend.send(
        destinationAddress,
        parseFloat(amount)
      );
      alert(response);
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Failed to send transaction. Please try again.");
    } finally {
      setSendLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="bg-secondary shadow-md rounded-lg p-4 flex-1">
          <h2 className="text-xl font-semibold mb-2">Generate Address</h2>
          <button
            className="btn btn-primary w-full mb-2"
            onClick={get_p2pkh_address}
          >
            Generate Address
          </button>
          {generateAddressLoading ? (
            <div className="flex justify-center items-center p-3">
              <HashLoader color={"white"} width={20} height={20} />
            </div>
          ) : (
            <>
              {" "}
              {address && (
                <div className="bg-gray-100 p-2 rounded">
                  <span className="font-semibold">Address:</span> {address}
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-secondary shadow-md rounded-lg p-4 flex-1">
          <h2 className="text-xl font-semibold mb-2">Check Balance</h2>
          <input
            type="text"
            className="input input-bordered w-full mb-2"
            placeholder="Enter address"
            value={balanceAddress}
            onChange={(e) => setBalanceAddress(e.target.value)}
          />
          <button className="btn btn-primary w-full mb-2" onClick={getBalance}>
            Get Balance
          </button>
          {getBalanceLoading ? (
            <div className="flex justify-center items-center p-3">
              <HashLoader color={"white"} width={20} height={20} />
            </div>
          ) : (
            <>
              {balance && (
                <div className="bg-gray-100 p-2 rounded">
                  <span className="font-semibold">Balance:</span> {balance}
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-secondary shadow-md rounded-lg p-4 flex-1">
          <h2 className="text-xl font-semibold mb-2">Send Transaction</h2>
          <input
            type="text"
            className="input input-bordered w-full mb-2"
            placeholder="Enter destination address"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
          />
          <input
            type="number"
            className="input input-bordered w-full mb-2"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="btn btn-primary w-full" onClick={send}>
            Send
          </button>
          {sendLoading && (
            <div className="flex justify-center items-center p-3">
              <HashLoader color={"white"} width={20} height={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
