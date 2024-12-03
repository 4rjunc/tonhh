import {
  SendTransactionRequest,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";

const Credo = () => {
  const wallet = useTonWallet();

  return (
    <div>
      {wallet ? (
        <h2>Wallet Connected</h2>
      ) : (
        <h2>Connect your wallet to Credo!</h2>
      )}
    </div>
  );
};

export default Credo;
