import "./App.css";
import { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import { WebBundlr } from '@bundlr-network/client';
import BStorage from "./abis/BStorage.json";
import Layout from "./components/Layout";
import ConnectButton from "./components/ConnectButton";
import AccountModal from "./components/AccountModal";
import UploadFile from "./components/UploadFile";
import Files from "./components/Files";
import MessageModal from "./components/MessageModal";
import BigNumber from 'bignumber.js';

function App() {
  const [isOpen, setOpen] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");  
  const [walletAccount, setWalletAccount] = useState("");
  const [currentChain, setCurrentChain] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [ethBalance, setEthBalance] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [curAcc, setcurAcc] = useState("");
  const [storageContract, setStorageContract] = useState<ethers.Contract>();
  const [posts, setPosts] = useState<{}[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [deployed, setDeployed] = useState(false);
  const [state, setState] = useState('idle');
  const [bundlrInstance, setBundlrInstance] = useState<WebBundlr>();
  const [balance, setBalance] = useState<string>('');
  const [URI, setURI] = useState<string>();

  // Initialize the application and MetaMask Event Handlers
  useEffect(() => {
    // Setup Listen Handlers on MetaMask change events
    if (typeof window.ethereum !== "undefined") {
      // Add Listener when accounts switch
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        console.log("Account changed: ", accounts[0]);
        messageOpener("Account changed: " + accounts[0]);
        setWalletAccount(accounts[0]);
      });

      // Do something here when Chain changes
      (window as any).ethereum.on("chainChanged", (chaindId: string) => {
        console.log("Chain ID changed: ", chaindId);
        messageOpener("Chain ID changed: " + chaindId);
        setCurrentChain(chaindId);
      });
    } else {
      alert("Please install MetaMask to use this service!");
    }
  }, []);

  useEffect(() => {
    setIsConnected(walletAccount ? true : false);
  }, [walletAccount]);

  useEffect(() => {
    if (bundlrInstance) {
        fetchBalance();
    }
  }, [bundlrInstance])

  //Get selected account in MetaMask
  useEffect(() => {
    getAccount();
    getContract();
  }, []);

  const getAccount = async () => {
    (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
      setSelectedWallet(accounts[0]);
    });

    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    setcurAcc(accounts[0]);
  };

  const getContract = async () => {
    const networkId = await (window as any).ethereum.request({
      method: "net_version",
    });

    const networkData = BStorage.networks[networkId as keyof typeof BStorage.networks];

    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const signer = provider.getSigner();

    if (networkData) {
      if (await provider.getCode(networkData.address) == "0x") {
        alert("Contract not deployed! at " + networkData.address);
        console.log("Contract not deployed! at " + networkData.address);
      }
      setDeployed(true);
      const BStoragecontract = new ethers.Contract(
        networkData.address,
        BStorage.abi,
        signer
      );

      setStorageContract(BStoragecontract);
      loadFiles();
    } else {
      window.alert("BStorage contract not deployed to detected network.");
    }
  };

  const initialiseBundlr = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const bundlr = new WebBundlr(
        "https://devnet.bundlr.network",
        "matic",
        provider,
        {
            providerUrl:
                process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL,
        }
    );
    await bundlr.ready();
    setBundlrInstance(bundlr);

    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];

    console.log("Account: ", account);
    setWalletAccount(account);
    handleGetBalance();
    fetchBalance();

    loadFiles();
  }

  async function fetchBalance() {
    if (bundlrInstance) {
        const bal = await bundlrInstance.getLoadedBalance();
        console.log("bal: ", utils.formatEther(bal.toString()));
        setBalance(utils.formatEther(bal.toString()));
    }
  }

  function parseInput(input: number) {
    const conv = new BigNumber(input).multipliedBy(bundlrInstance!.currencyConfig.base[1])
    if (conv.isLessThan(1)) {
        console.log('error: value too small')
        messageOpener("error: value too small");
        return
    } else {
        return conv
    }
  }

  function messageOpener(msg: string) {
    setCurrentMessage(msg);
    setOpenMessageModal(true);
        setTimeout(function () {
          setOpenMessageModal(false);
      }, 5000);
  }

  async function fundWallet(amount: number) {
    try {
        if (bundlrInstance) {
            if (!amount) return
            const amountParsed = parseInput(amount)
            if (amountParsed) {
                console.log('Adding funds please wait')
                messageOpener("Adding funds please wait");
                let response = await bundlrInstance.fund(amountParsed)
                console.log('Wallet funded: ', response)
                messageOpener("Wallet funded: " + response);
            }
            fetchBalance()
        }
    } catch (error) {
        console.log("error", error);
        // alert("insufficient funds for gas");
        messageOpener("insufficient funds for gas");
    }
  }

  function readFileAsync(file: File) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
  
      reader.onload = () => {
        resolve(reader.result);
      };
  
      reader.onerror = reject;
  
      reader.readAsArrayBuffer(file);
    })
  }

  const uploadPost = async (description: string) => {
    if(deployed == false) { alert("Contract is not deployed!"); setState('error'); return }
    
    if (selectedFile) {
      if (storageContract) {
        try{
          let contentBuffer = await readFileAsync(selectedFile) as ArrayBuffer;
          console.log("ContentBuffer: ", contentBuffer);
          if(!contentBuffer) { setState('error'); return }

          let uploadFile = await bundlrInstance?.uploader.upload(Buffer.from(contentBuffer))
          console.log(uploadFile);
          let hash = uploadFile!.data.id;
          setURI(`http://arweave.net/${hash}`);
          fetchBalance();

          const tx = await storageContract.uploadPost(hash, description,selectedFile.name).catch((e: any) => {
            if (e.code === 4001){
                setState('error');
            } 
          });
          console.log(tx);
          const txhash = tx.hash;

          let transactionReceipt = null
          while (transactionReceipt == null) { // Waiting until the transaction is mined
            transactionReceipt = await (window as any).ethereum.request({
              method: "eth_getTransactionReceipt",
              params: [txhash],
            });
          }

          console.log(transactionReceipt);
          setState('success');
          loadFiles();
        }catch (error){
          console.log(error);
          setState('error');
          messageOpener("Not enough (bundlr) funds to send data");
        }
      }
    } else {
      alert("No file selected!");
      setState('error');
      return;
    }
  };

  // Get the Accounts current Balance and convert to Wei and ETH
  const handleGetBalance = async () => {
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];

    const balance = await (window as any).ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });

    // Returns a hex value of Wei
    const wei = parseInt(balance, 16);
    const eth = wei / Math.pow(10, 18); // parse to ETH

    setEthBalance(eth);
  };

  // const showPosts = () => {
  //   if (posts) {
  //     console.log("posts: ");
  //     console.log(posts);
  //     for (var i = 0; i < posts.length; i++) {
  //       console.log("current song: ");
  //       console.log(posts[i].song);
  //       console.log("current song hash: ");
  //       console.log(posts[i].song.hash);
  //     }
  //   }
  // };

  const loadFiles = async () => {
    console.log(storageContract);
    if (storageContract) {
      const postCount = await storageContract.postCount();
      //showPosts();
      if (postCount) {
        console.log("postCount: ");
        console.log(postCount);

        setPosts([]); // set posts to an empty array

        // load songs
        for (var i = 1; i <= postCount; i++) {
          const file = await storageContract.posts(i);

          //setPosts((prev) => [...prev, { posts: [...posts, song] }]);
          setPosts((prev) => [...prev, file]);
        }
        if (posts) {
          console.log("posts: ");
          console.log(posts);
        }
      }
    }
  };

  return (
    <Layout>
      <ConnectButton
        fundWallet={fundWallet}
        balance={balance}
        isOpen={isOpen}
        setOpen={setOpen}
        setWalletAccount={setWalletAccount}
        isConnected={isConnected}
        ethBalance={ethBalance}
        handleGetBalance={handleGetBalance}
        curAcc={curAcc}
      />
      <AccountModal
        isOpen={isOpen}
        setOpen={setOpen}
        isConnected={isConnected}
        setIsConnected={setIsConnected}
        setWalletAccount={setWalletAccount}
      />

      {bundlrInstance ? 
        <div className="flex justify-between">
          <Files posts={posts} />
          <UploadFile uploadPost={uploadPost} setSelectedFile={setSelectedFile} selectedFile={selectedFile} state={state} setState={setState} />
          <button className="absolute bottom-0" onClick={loadFiles}>Load files</button>
        </div>
        :
        <div className="absolute bg-orange-400 -ml-36 top-1/3 left-1/2 w-72 h-72 rounded-full shadow-2xl">
          <button className="ml-20 mt-32 px-1 py-1 border-2 bg-white rounded-xl"
                  onClick={initialiseBundlr}>Initialise Bundlr</button>
        </div>
      }      

      <MessageModal
        openMessageModal={openMessageModal}
        setOpenMessageModal={setOpenMessageModal}
        currentMessage={currentMessage}
      />
    </Layout>
  );
}

export default App;
