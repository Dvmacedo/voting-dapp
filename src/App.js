// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import CreateElection from "./components/CreateElection";
import Vote from "./components/Vote";
import Results from "./components/Results";
import Home from "./components/Home"; 
import abi from "./contracts/Voting.json";
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 

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
          const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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
      {/* Container do Bootstrap para dar margens e centralizar o conteúdo */}
      <Container>
        {/* Navbar do Bootstrap com tema escuro */}
        <Navbar bg="dark" variant="dark" expand="lg"> {/* bg="dark" e variant="dark" para tema escuro */}
          <Container>
            <Navbar.Brand as={Link} to="/">Sistema de Votação</Navbar.Brand> {/* Navbar.Brand para o título */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* Navbar.Toggle para responsividade em telas menores */}
            <Navbar.Collapse id="basic-navbar-nav"> {/* Navbar.Collapse para agrupar os links */}
              <Nav className="me-auto"> {/* Nav para os links de navegação */}
                <Nav.Link as={Link} to="/create-election">Configurar Votação</Nav.Link> {/* Nav.Link para cada item do menu */}
                <Nav.Link as={Link} to="/vote">Votar</Nav.Link>
                <Nav.Link as={Link} to="/results">Resultados</Nav.Link>
              </Nav>
            </Navbar.Collapse>
            <Navbar.Text className="ms-auto"> {/* Navbar.Text para o texto da conta, ms-auto para alinhar à direita */}
              {account ? `Conta: ${account}` : 'Conectando...'}
            </Navbar.Text>
          </Container>
        </Navbar>

        {/* Conteúdo principal do aplicativo */}
        <Routes>
          <Route path="/create-election" element={<CreateElection contract={contract} />} />
          <Route path="/vote" element={<Vote contract={contract} />} />
          <Route path="/results" element={<Results contract={contract} />} />
          <Route path="/" element={<Home />} /> {/* Rota para a página inicial */}
        </Routes>
      </Container>
    </Router>
  );
}


export default App;