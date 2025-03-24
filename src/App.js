import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import CreateElection from "./components/CreateElection";
import Vote from "./components/Vote";
import Results from "./components/Results";
import abi from "./contracts/Voting.json";
import './styles.css';

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        try {
          // Cria o provider utilizando o MetaMask
          const provider = new ethers.BrowserProvider(window.ethereum);
          // Solicita acesso à conta e obtém o signer
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();

          // Utilize uma variável de ambiente ou substitua pelo endereço do contrato
          const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "0xYourContractAddressHere";
          
          // Valida se o endereço é válido
          if (!ethers.isAddress(contractAddress)) {
            throw new Error("Endereço do contrato inválido. Verifique se você está utilizando um endereço Ethereum válido.");
          }
          
          const contractABI = abi.abi;
          const votingContract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(votingContract);
          
          // Obtém a conta conectada
          const accounts = await provider.send("eth_requestAccounts", []);
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Erro ao carregar dados da blockchain:", error);
          alert("Erro ao conectar com a blockchain. Veja o console para mais detalhes.");
        }
      } else {
        alert("MetaMask não está instalado!");
      }
    };

    loadBlockchainData();
  }, []);

  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">Sistema de Votação</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/create-election">Configurar Votação</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/vote">Votar</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/results">Resultados</Link>
              </li>
            </ul>
          </div>
          {account && <span className="navbar-text">Conta: {account}</span>}
        </nav>

        <Routes>
          <Route path="/create-election" element={<CreateElection contract={contract} />} />
          <Route path="/vote" element={<Vote contract={contract} />} />
          <Route path="/results" element={<Results contract={contract} />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="text-center mt-5">
      <h2>Bem-vindo ao Sistema de Votação!</h2>
      <p>Escolha uma opção no menu acima.</p>
    </div>
  );
}

export default App;