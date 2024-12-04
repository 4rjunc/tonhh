import { TonConnectButton } from "@tonconnect/ui-react";
import "./header.scss";

export const Header = () => {
  return (
    <header>
      <span>Credo 🤝</span>
      <TonConnectButton />
    </header>
  );
};
