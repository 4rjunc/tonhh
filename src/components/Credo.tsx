import {
  SendTransactionRequest,
  useTonConnectUI,
  useTonWallet,
  TonConnectButton
} from "@tonconnect/ui-react";

import ReclaimDemo from "./Reclaim";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Header } from "./Header/Header";

const Credo = () => {
  const wallet = useTonWallet();

  // const wallet = true;


  return (
    <div>
      {wallet ? (
        
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6">
            <Header />
            <div className="text-center"> 
              <h2 className="text-2xl font-semibold text-green-600 flex items-center justify-center space-x-2 mt-6">
                <RiVerifiedBadgeFill className="text-4xl" />
                <span>Wallet Connected</span>
              </h2>

              <div className="mt-8">
                <ReclaimDemo onProofReceived={(proof) => console.log(proof)} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6">
            <Header />
            <h2 className="text-3xl font-semibold text-center mb-6 mt-6" >
              Connect Your Wallet to <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">Credo</span>!
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Credo;
