import React, { Component } from 'react';
import { walletDetector, BrowserWindowMessageConnection, RpcConnectionDenyError, RpcRejectedByUserError } from '@aeternity/aepp-sdk';
import { connect } from 'react-redux';
import { store } from './store';

class Connect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connectMethod: 'default',
            walletConnected: false,
            walletConnecting: null,
            reverseIframe: null,
            reverseIframeWalletUrl: process.env.REACT_APP_WALLET_URL ?? `http://${window.location.hostname}:3000`,
            walletInfo: null,
            cancelWalletDetection: null,
        };
    }

    detectWallets = async () => {
        const connection = new BrowserWindowMessageConnection();
        console.log("conn-after", connection);

        return new Promise((resolve, reject) => {
            const stopDetection = walletDetector(connection, async ({ newWallet }) => {
                console.log(stopDetection);
                if (window.confirm(`Do you want to connect to wallet ${newWallet.info.name} with id ${newWallet.info.id}`)) {
                    stopDetection();
                    resolve(newWallet.getConnection());
                    this.setState({ cancelWalletDetection: null });
                }
            });

            this.setState({
                cancelWalletDetection: () => {
                    reject(new Error('Wallet detection cancelled'));
                    stopDetection();
                    this.setState({ cancelWalletDetection: null });
                    if (this.state.reverseIframe) this.setState({ reverseIframe: null });
                },
            });
        });
    };

    connect = async () => {
        this.setState({ walletConnecting: true });

        store.onDisconnect = () => {
            this.setState({
                walletConnected: false,
                walletInfo: null,
            });
            console.log('process-1');
        };

        console.log('process-2');

        try {
            const connection = await this.detectWallets();
            console.log(connection);
            console.log("1",store);
            console.log("2", store.getState().aeSdk);

            // console.log("2",store.aeSdk);

            try {
                this.setState({ walletInfo: await store.getState().aeSdk.connectToWallet(connection) });
              
            } catch (error) {
                if (error instanceof RpcConnectionDenyError) connection.disconnect();
                throw error;
            }
            

            this.setState({ walletConnected: true });
            console.log(Object.keys(current)[0]);

            const { address: { current } } = await store.getState().aeSdk.subscribeAddress('subscribe', 'connected');


            console.log('process-6');

        } catch (error) {
            console.error('Error in connect:', error);
            console.log('process-7');

            if (
                error.message === 'Wallet detection cancelled'
                || error instanceof RpcConnectionDenyError
                || error instanceof RpcRejectedByUserError
            ) {
                console.log('Handling expected error');
            } else {
                console.error('Unexpected error:', error);
            }
        } finally {
            this.setState({ walletConnecting: false });
            console.log('process-8');
        }
    };

    disconnect = () => {
        store.disconnectWallet();
    };

    render() {
        console.log('Render');

        const { connectMethod, walletConnected, walletConnecting, cancelWalletDetection, walletInfo } = this.state;
        const walletName = !walletConnected ? 'Wallet is not connected' : walletInfo?.name;

        return (
            <div>
                <div className="group">
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="default"
                                checked={connectMethod === 'default'}
                                onChange={() => this.setState({ connectMethod: 'default' })}
                            />
                            Iframe or WebExtension
                        </label>
                    </div>

                    <button style={{ display: walletConnected ? 'inline-block' : 'none' }} onClick={this.disconnect}>
                        Disconnect
                    </button>

                    <button
                        style={{ display: connectMethod && !walletConnected ? 'inline-block' : 'none' }}
                        disabled={walletConnecting}
                        onClick={this.connect}
                    >
                        Connect
                    </button>

                    <button
                        style={{ display: cancelWalletDetection ? 'inline-block' : 'none' }}
                        onClick={cancelWalletDetection}
                    >
                        Cancel detection
                    </button>
                </div>

                <div className="group">
                    <div>
                        <div>SDK status</div>
                        <div>
                            {walletConnected && 'Wallet connected'}
                            {cancelWalletDetection && 'Wallet detection'}
                            {walletConnecting && 'Wallet connecting'}
                            {!walletConnected && !cancelWalletDetection && !walletConnecting && 'Ready to connect to wallet'}
                        </div>
                    </div>
                    <div>
                        <div>Wallet name</div>
                        <div>{walletName}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Connect;