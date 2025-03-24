import React, { useState } from "react";

const Results = ({ contract }) => {
    const [pin, setPin] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [electionStatus, setElectionStatus] = useState(null);

    const fetchResults = async () => {
        try {
            const count = await contract.getCandidateCount(pin);
            let tempCandidates = [];
            
            for (let i = 0; i < count; i++) {
                let candidate = await contract.getCandidateInfo(pin, i);
                tempCandidates.push({ name: candidate[0], votes: candidate[1].toString() });
            }
            
            setCandidates(tempCandidates);

            // Verifica se a votação ainda está ativa
            const status = await contract.elections(pin);
            setElectionStatus(status.active);
        } catch (error) {
            alert("Erro ao buscar os resultados. Verifique o PIN.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Consultar Resultados</h2>
            <input 
                type="text" 
                value={pin} 
                onChange={(e) => setPin(e.target.value)} 
                placeholder="Informe o PIN" 
                className="form-control my-2" 
            />
            <button className="btn btn-info" onClick={fetchResults}>Buscar Resultados</button>

            {candidates.length > 0 && (
                <div className="mt-4">
                    <h3>Resultados da Votação</h3>
                    <p><strong>Status da votação:</strong> {electionStatus ? "Ativa" : "Encerrada"}</p>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Candidato</th>
                                <th>Votos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map((candidate, index) => (
                                <tr key={index}>
                                    <td>{candidate.name}</td>
                                    <td>{candidate.votes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Results;