import React,{useEffect,useState} from "react";
import {ethers} from 'ethers';
import {contractABI,contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumContract= () =>{
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const transcationContract = new ethers.Contract(contractAddress,contractABI,signer);

      return transcationContract;
}



export const TransactionProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formdata,setfromdata] = useState({addressTo:' ',amount : '',keyword:' ',message:''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e, name) => {
        setfromdata((prevState) => ({ ...prevState, [name]: e.target.value }));
      };
      

    const getAllTranscations = async () => {
        try{
            if(ethereum){
            const transactionContract = getEthereumContract();

            const  availableTransactions = await transactionContract.getAllTranscations();

            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
              }));

            console.log(structuredTransactions);

            setTransactions(structuredTransactions)
        }
        }catch(error){
            console.log(error);
        }
    }
    const checkifwalletisconnected = async () => {
      try{
        if(!ethereum) return alert("Please install metamask");

        const accounts= await ethereum.request({method: 'eth_accounts'});
        if(accounts.length){
            setCurrentAccount(accounts[0]);

            getAllTranscations();
        }else{
            console.log('No accounts found');
        }
      }catch(error){
        console.log(error);
      }
       
    }
    const connectWallet = async () => {
        try{
            if(!ethereum) return alert("Please install metamask");
            const accounts = await ethereum.request({method:'eth_requestAccounts'});
            
            setCurrentAccount(accounts[0]);
            window.location.reload();
        }catch(error){
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }
    
    const checkIfTranscationExist = async () =>{
        try{
            if(ethereum){
            const transactionContract = getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem("transactionCount",transactionCount);
        }
        } catch(error){
            console.log(error); 
            throw new Error("No ethereum object");
        }
    };
     const sendTranscation = async() => {
        try{
            if(ethereum){ 
            const {addressTo,amount,keyword,message} = formdata;
            const transcationContract =  getEthereumContract();
            const parseAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method : 'eth_sendTransaction',
                params:[{
                   from: currentAccount,
                   to: addressTo,
                    gas: '0x5208',
                    value: parseAmount._hex,
                }]           
            });

            const transcationHash = await transcationContract.addToBlockchain(addressTo,parseAmount,message,keyword);

            setIsLoading(true);
            console.log('Loading - ${transcationHash.hash}');
            await transcationHash.wait();
            console.log('Success - ${transcationHash.hash}');
            setIsLoading(false);
    
            const transactionsCount = await transcationContract.getTransactionCount();
             
            setTransactionCount(transactionsCount.toNumber());
            window.location.reload()
        }
        }catch(error){
            console.log(error);

            throw new Error("No ethereum object.")
        }
     }

    useEffect(() => {
        checkifwalletisconnected();
        checkIfTranscationExist();
    },[transactionCount]) 

    return (
        <TransactionContext.Provider
          value={{
            transactionCount,
            connectWallet,
            transactions,
            currentAccount,
            isLoading,
            sendTranscation,
            handleChange,
            formdata,
          }}
        >
          {children}
        </TransactionContext.Provider>
      );
}