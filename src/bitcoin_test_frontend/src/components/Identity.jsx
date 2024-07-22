import React, { useState, useEffect, useCallback } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

const webapp_id = process.env.REACT_APP_CANISTER_ID_BITCOIN_TEST_BACKEND;

const webapp_idl = ({ IDL }) => {
  return IDL.Service({
    whoami: IDL.Func([], [IDL.Principal], ["query"]),
  });
};

function Identity() {
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [iiUrl, setIiUrl] = useState("");

  useEffect(() => {
    const initAuthClient = async () => {
      const client = await AuthClient.create({
        idleOptions: {
          idleTimeout: 1000 * 60 * 30, // 30 minutes
          disableDefaultIdleCallback: true,
        },
      });
      setAuthClient(client);
    };

    initAuthClient();
  }, []);

  useEffect(() => {
    let url;
    if (process.env.REACT_APP_DFX_NETWORK === "local") {
      url = `http://localhost:4943/?canisterId=${process.env.REACT_APP_CANISTER_ID_BITCOIN_TEST_FRONTEND}`;
    } else if (process.env.REACT_APP_DFX_NETWORK === "ic") {
      url = `https://${process.env.REACT_APP_CANISTER_ID_BITCOIN_TEST_FRONTEND}.icp0.io`;
    }
    setIiUrl(url);
  }, []);

  const handleLogin = useCallback(async () => {
    if (!authClient) return;

    try {
      await new Promise((resolve, reject) => {
        authClient.login({
          identityProvider: iiUrl,
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
          onSuccess: resolve,
          onError: reject,
        });
      });

      const identity = authClient.getIdentity();
      setIdentity(identity);
      setLoginStatus("Logged in successfully");
    } catch (error) {
      console.error("Login error:", error);
      setLoginStatus(`Login failed: ${error.message}`);
    }
  }, [authClient, iiUrl]);

  const handleWhoAmI = useCallback(async () => {
    if (!identity) {
      setLoginStatus("Please login first");
      return;
    }

    const agent = new HttpAgent({ identity });
    if (process.env.REACT_APP_DFX_NETWORK !== "ic") {
      await agent.fetchRootKey();
    }

    const webapp = Actor.createActor(webapp_idl, {
      agent,
      canisterId: webapp_id,
    });

    try {
      const principal = await webapp.whoami();
      setPrincipal(principal.toText());
    } catch (error) {
      console.error("Error calling whoami:", error);
      setPrincipal("Error: " + error.message);
    }
  }, [identity]);

  useEffect(() => {
    if (authClient) {
      authClient.idleManager?.registerCallback?.(() => {
        setLoginStatus("Session expired. Please login again.");
        setIdentity(null);
        setPrincipal("");
      });
    }
  }, [authClient]);

  return (
    <div>
      <main>
        <img src="logo2.svg" alt="DFINITY logo" />
        <br />
        <br />
        <input
          type="text"
          value={iiUrl}
          onChange={(e) => setIiUrl(e.target.value)}
          placeholder="Identity Provider URL"
        />
        <br />
        <button onClick={handleLogin}>Login!</button>
        <div>{loginStatus}</div>
        <br />
        <button onClick={handleWhoAmI}>Who Am I</button>
        <section>{principal}</section>
      </main>
    </div>
  );
}

export default Identity;
