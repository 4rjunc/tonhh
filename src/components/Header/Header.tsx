import { TonConnectButton } from "@tonconnect/ui-react";
import "./header.scss";

export const Header = () => {
  return (
    <header className="header-container">
      <div className="header-title">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center space-x-2">
          <span className="highlight bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
            Credo
          </span>
          <span>🤝</span>
        </h1>
        <p className="subtitle text-lg text-gray-600 mt-2">
          Create Your Social <b className="text-indigo-600">Passport</b>
        </p>
      </div>
      <div className="mt-8">
        <TonConnectButton />
      </div>
    </header>
  );
};
