import { useState } from "react";
import { bitcoin_test_backend } from "declarations/bitcoin_test_backend";
import GetAddress from "./components/GetAddress";
import Identity from "./components/Identity";

function App() {
  const [greeting, setGreeting] = useState("");
  const [address, setAddress] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    bitcoin_test_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  function get_p2pkh_address() {
    bitcoin_test_backend.get_p2pkh_address().then((address) => {
      setAddress(address);
    });
  }

  return (
    <main>
      <img src="/logo2.svg" className="mt-4" alt="DFINITY logo" />
      <br />
      <br />
      <h1 className="text-2xl font-bold text-center">Bitcoin Wallet</h1>
      <GetAddress />
      <Identity />

      <section id="greeting">{greeting}</section>
    </main>
  );
}

export default App;
