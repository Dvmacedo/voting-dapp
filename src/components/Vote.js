import React, { useState } from "react";

const Vote = ({ contract }) => {
    const [pin, setPin] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [selected, setSelected] = useState(null);

    const fetchCandidates = async () => {
        try {
            console.log("Verificando PIN:", pin);
    
            // Chama a nova função getter
            const electionInfo = await contract.getElectionInfo(pin);
            console.log("Status da eleição:", electionInfo);
    
            const candidateCount = Number(electionInfo[1]); // Converte para número
            console.log("Número de candidatos encontrados:", candidateCount);
    
            if (candidateCount === 0) {
                alert("Nenhuma eleição encontrada com este PIN.");
                return;
            }
    
            let tempCandidates = [];
            for (let i = 0; i < candidateCount; i++) {
                let candidate = await contract.getCandidateInfo(pin, i);
                tempCandidates.push({ name: candidate[0], votes: Number(candidate[1]) });
            }
            setCandidates(tempCandidates);
        } catch (error) {
            console.error("Erro ao buscar candidatos:", error);
            alert("Erro ao carregar candidatos. Verifique o PIN.");
        }
    };
    
    
    const vote = async () => {
        try {
            const election = await contract.elections(pin);
            if (!election.active) {
                alert("A eleição foi encerrada e não permite mais votos.");
                return;
            }
    
            await contract.vote(pin, selected);
            alert("Voto registrado com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Erro ao votar. Verifique se já votou ou se o PIN é válido.");
        }
    };
  
    return (
        <div className="container mt-4">
            <h2>Votação</h2>
            <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Informe o PIN" className="form-control my-2" />
            <button className="btn btn-info" onClick={fetchCandidates}>Carregar Candidatos</button>
            {candidates.length > 0 && (
                <div>
                    {candidates.map((c, i) => (
                        <button key={i} className={`btn m-1 ${selected === i ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setSelected(i)}>
                            {c.name}
                        </button>
                    ))}
                    <button className="btn btn-success mt-2" onClick={vote}>Votar</button>
                </div>
            )}
        </div>
    );
};

export default Vote;