import { useAccount, useBalance } from "wagmi";

type Props = {
  isOpen: boolean;
  isConnected: boolean;
  setOpen: any;
  setIsConnected: any;
  setWalletAccount: any;
};

export default function AccountModal({
  isOpen,
  isConnected,
  setOpen,
  setIsConnected,
  setWalletAccount,
}: Props) {
  async function handleDisconnect() {
    console.log("Disconnecting MetaMask...");
    setIsConnected(false);
    setWalletAccount("");
  }

  function handleClick() {
    setOpen(!isOpen);
    handleDisconnect();
  }

  return isConnected ? (
    <div
      className={`${
        isOpen ? "absolute" : "hidden"
      }`}
    >
      <h3>Does this WORK????</h3>
      <button
        className="h-8 w-full hover:bg-gray-600 font-semibold"
        onClick={handleClick}
      >
        Disconnect Wallet
      </button>
    </div>
  ) : (
    <div></div>
  );
}
