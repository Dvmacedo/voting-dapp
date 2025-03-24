import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import CreateElection from "./components/CreateElection";
import Vote from "./components/Vote";
import Results from "./components/Results";
import abi from "./contracts/Voting.json";

function App() {
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contractAddress = "ENDERECO_DO_CONTRATO";
                const contractABI = abi.abi; 
                const votingContract = new ethers.Contract(contractAddress, contractABI, signer);

                setContract(votingContract);

                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]);
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