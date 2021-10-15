import React, { useEffect, useState,useReducer } from "react";
import FruitshopContract from "./contracts/Fruitshop.json";
import getWeb3 from "./getWeb3";

import "./App.css";




const App = () => {
    const [myApple,setMyApple] = useState(0); 
    const initialState = {web3:null, instance:null, account:null}
    const [state,dispatch] = useReducer(reducer,initialState);

    function reducer(state,action){
      switch(action.type){
        case "INIT": 
          let {web3,instance,account} = action; 
          return{
            ...state,
            web3:web3,
            instance:instance,
            account:account, 
          }
        default:
          return{
            ...state,
          }
      }
    }

    const buyApple = async() => {
      //instance 값을 가져와야함.
      const {instance,account,web3} = state;
      await instance.buyApple({
        from:account,
        value:web3.utils.toWei("10","ether"),
        gas:90000,
      });
      setMyApple(prev=>prev+1);
    }

    const sellApple = async() => {
      const {instance,account,web3} = state;
      const applePrice = web3.utils.toWei("10","ether");
      await instance.sellApple(applePrice,{
        from:account,
        gas:90000,
      });
      setMyApple(0);
    }

    const getApple = async()=>{
      const {instance,account} = state; 
      const result = await instance.showMyApple({
        from:account,
      });
      setMyApple(+result);
    }


    const getweb = async() => {
      const contract = require( "@truffle/contract"); 
      const web3 = await getWeb3();  // 
      const fruitshop = contract(FruitshopContract);
      fruitshop.setProvider(web3.currentProvider);
      const instance = await fruitshop.deployed(); //
      const accounts = await web3.eth.getAccounts(); // 
      const InitActions = {
        type:'INIT',
        web3,
        instance,
        account:accounts[0],
      }

      dispatch(InitActions);


    }


    // web3 가져와서 메타마스크에 연결
    useEffect(()=>{
      getweb();
    },[])

    useEffect(()=>{
      if(state.instance!=null) getApple();
    },[state.instance])


  return(
    <div>
      <h1>사과 가게^^</h1>
      <h2>사과 가격: 10 ETH</h2>
      <button onClick={()=>buyApple()}>Buy</button>
      <p>내사과: {myApple}</p>
      <button onClick={()=>sellApple()}>Sell (판매가격은 {myApple*10} ETH)</button>
    </div>
  )
}



export default App;


// class App extends Component {
//   state = { storageValue: 0, web3: null, accounts: null, contract: null };

//   componentDidMount = async () => {
//     try {
//       // Get network provider and web3 instance.
//       const web3 = await getWeb3();

//       // Use web3 to get the user's accounts.
//       const accounts = await web3.eth.getAccounts();

//       // Get the contract instance.
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = SimpleStorageContract.networks[networkId];
//       const instance = new web3.eth.Contract(
//         SimpleStorageContract.abi,
//         deployedNetwork && deployedNetwork.address,
//       );

//       // Set web3, accounts, and contract to the state, and then proceed with an
//       // example of interacting with the contract's methods.
//       this.setState({ web3, accounts, contract: instance }, this.runExample);
//     } catch (error) {
//       // Catch any errors for any of the above operations.
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`,
//       );
//       console.error(error);
//     }
//   };

//   runExample = async () => {
//     const { accounts, contract } = this.state;

//     // Stores a given value, 5 by default.
//     await contract.methods.set(5).send({ from: accounts[0] });

//     // Get the value from the contract to prove it worked.
//     const response = await contract.methods.get().call();

//     // Update state with the result.
//     this.setState({ storageValue: response });
//   };

//   render() {
//     if (!this.state.web3) {
//       return <div>Loading Web3, accounts, and contract...</div>;
//     }
//     return (
//       <div className="App">
//         <h1>Good to Go!</h1>
//         <p>Your Truffle Box is installed and ready.</p>
//         <h2>Smart Contract Example</h2>
//         <p>
//           If your contracts compiled and migrated successfully, below will show
//           a stored value of 5 (by default).
//         </p>
//         <p>
//           Try changing the value stored on <strong>line 42</strong> of App.js.
//         </p>
//         <div>The stored value is: {this.state.storageValue}</div>
//       </div>
//     );
//   }
// }