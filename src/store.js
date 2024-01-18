import { configureStore, createSlice } from "@reduxjs/toolkit";
import { AeSdkAepp, Node, CompilerHttp } from "@aeternity/aepp-sdk";
// import thunk from 'redux-thunk';
import { useDispatch } from "react-redux";

const TESTNET_NODE_URL = "https://testnet.aeternity.io";
const COMPILER_URL = "https://v7.compiler.aepps.com";

const initialState = {
  address: undefined,
  networkId: undefined,
  aeSdk: new AeSdkAepp({
    name: "Simple æpp",
    nodes: [
      {
        name: "testnet",
        instance: new Node(TESTNET_NODE_URL),
      },
    ],
    onCompiler: new CompilerHttp(COMPILER_URL),
    onNetworkChange: async ({ networkId }) => {
      const [{ name }] = (await this.getNodesInPool()).filter(
        (node) => node.nodeNetworkId === networkId
      );
      this.selectNode(name);
      dispatch(setNetworkId(networkId));
      console.log(networkId);
    },
    onAddressChange: ({ current }) =>
      this.setState({ address: Object.keys(current)[0] }),
  }),
};
console.log(initialState);
const userSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action;
    },
    setNetworkId: (state, action) => {
      state.networkId = action;
    },
  },
});

export const store = configureStore({
  reducer: userSlice.reducer,
  devTools: false,
  // middleware: [thunk],
});

export const { setAddress, setNetworkId } = userSlice.actions;
const dispatch = useDispatch();

export default function App() {
 return ();
}