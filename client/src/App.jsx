import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import JankenGameContract from "./contracts/JankenGame.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    web3: null, accounts: null,
    playerId1: 1, playerId2: 2,
    playerHand1: "G", playerHand2: "G",
    podAddress: "0x619CE08A99B863Ba3D899506A4840F72711F1842",
    playerPodSize: "5",
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      this.setState({ web3, accounts, }, this.getPlayers);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExampleSendEthTransaction = async () => {
    const { web3, accounts } = this.state;
    
    const account = accounts[0];

    const toAddress = "0xb633f3A0E5D19F61Ea60dB7fcDfCB7672D48EFd9";
    const amount = "3";
    const amountToSend = web3.utils.toWei(amount, "ether");
    await web3.eth.sendTransaction({ from: account, to: toAddress, value: amountToSend });
  };

  runExampleTransaction = async () => {
    const { web3 } = this.state;

    const transaction = await web3.eth.getTransaction("0x717378d0fb3248ab80aeb7d0b8efc2341676eb5c8ebae0033fdd738ed9fc732a");
    console.log(transaction);
  };

  runExampleGetBalance = async () => {
    const { web3 } = this.state;

    const balance = await web3.eth.getBalance("0x4E72Aae7FBBc87A46A4Ff8CBBa34da10BC3666f9");
    console.log(balance);
  };


  getJankenGameContract = async () => {
    const { web3 } = this.state;

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = JankenGameContract.networks[networkId];
    const contract = new web3.eth.Contract(
      JankenGameContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    return contract;
  };
  setJankenGamePlayer1 = async () => {
    const { accounts, } = this.state;

    const contract = await this.getJankenGameContract();

    await contract.methods.setPlayerHand1(this.state.playerHand1, this.state.playerId1).send({ from: accounts[0] });
  };
  setJankenGamePlayer2 = async () => {
    const { accounts, } = this.state;

    const contract = await this.getJankenGameContract();

    await contract.methods.setPlayerHand2(this.state.playerHand2, this.state.playerId2).send({ from: accounts[0] });
  };
  calcJankenGame = async () => {
    const { accounts, } = this.state;

    const contract = await this.getJankenGameContract();

    await contract.methods.calcGame().send({ from: accounts[0] });
    const gamelogs = await contract.methods.getAllGameLog().call({ from: accounts[0] });
    console.log(gamelogs);
  };
  updateJankenGameHands = async () => {
    const { accounts, } = this.state;

    const contract = await this.getJankenGameContract();

    const playerHand1 = await contract.methods.playerHand1().call({ from: accounts[0] });
    const playerHand2 = await contract.methods.playerHand2().call({ from: accounts[0] });
    this.setState({playerHand1,playerHand2});
  };

  sendCoinToPod = async (coin_size) => {
    const { web3, accounts } = this.state;
    
    const account = accounts[0];

    const amountToSend = web3.utils.toWei(String(coin_size), "ether");
    await web3.eth.sendTransaction({ from: account, to: this.state.podAddress, value: amountToSend });
  }

  handleChangeNameStr = (e) => {
    this.setState({
      name_str: e.target.value,
    });
  }
  handleClickCreateUser = async () => {
    await this.createNewPokerPlayer(this.state.name_str);
  }
  handleChangePlayerHand1 = (e) => {
    this.setState({
      playerHand1: e.target.value,
    });
  }
  handleChangePlayerHand2 = (e) => {
    this.setState({
      playerHand2: e.target.value,
    });
  }
  handleSubmitPlayerHand1 = async () => {
    await this.setJankenGamePlayer1();
  }
  handleSubmitPlayerHand2 = async () => {
    await this.setJankenGamePlayer2();
  }
  handleSubmitCalcGame = async () => {
    await this.calcJankenGame();
  }
  handleUpdateHands = async () => {
    await this.updateJankenGameHands();
  }
  handleChangePlayerPodSize = async (e) => {
    this.setState({
      playerPodSize: e.target.value,
    });
  }
  handleChangePodAddress = async (e) => {
    this.setState({
      podAddress: e.target.value,
    });
  }
  handleClickPodSend = async () => {
    await this.sendCoinToPod(this.state.playerPodSize);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>ジャンケンゲーム</h1>
        <h3>ポッドへ送信</h3>
        <Form>
          <Col xs={6} sm={6} md={4} lg={3}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>ポッドウォレットアドレス</Form.Label>
              <Form.Control type="text" placeholder="ポッドのアドレスを指定" onChange={this.handleChangePodAddress} value={this.state.podAddress}  />
              <Form.Text className="text-muted">
                資金を送るためのポッドのアドレスを記入
              </Form.Text>
            </Form.Group>
          </Col>
          <Col xs={6} sm={6} md={4} lg={3}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>送るEthサイズを指定</Form.Label>
              <Form.Control type="text" placeholder="ポッドへ送るEthサイズ" onChange={this.handleChangePlayerPodSize} value={this.state.playerPodSize}  />
              <Form.Text className="text-muted">
                ポッドへ送るEthを指定
              </Form.Text>
            </Form.Group>
          </Col>
          <Button onClick={this.handleClickPodSend}>ポッドへ送る</Button>
        </Form>

        <h3>プレーヤーのハンドを選択</h3>
        <Form>
          <Col xs={6} sm={6} md={4} lg={3}>
            <b>Player1:</b>
            <Form.Select aria-label="player1 hand" value={this.state.playerHand1} onChange={this.handleChangePlayerHand1}>
              <option value="G">G</option>
              <option value="C">C</option>
              <option value="P">P</option>
            </Form.Select>
          </Col>
          <Col xs={6} sm={6} md={4} lg={3}>
            <b>Player2:</b>
            <Form.Select aria-label="player2 hand" value={this.state.playerHand2} onChange={this.handleChangePlayerHand2}>
              <option value="G">G</option>
              <option value="C">C</option>
              <option value="P">P</option>
            </Form.Select>
          </Col>
        </Form>
        
        <Button variant="secondary" onClick={this.handleSubmitPlayerHand1}>Player1のハンド設定</Button>
        <Button variant="secondary" onClick={this.handleSubmitPlayerHand2}>Player2のハンド設定</Button>
        <Button onClick={this.handleSubmitCalcGame}>ゲーム実行</Button>
        <Button variant="secondary" onClick={this.handleUpdateHands}>Update</Button>

      </div>
    );
  }
}

export default App;
