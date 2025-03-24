import React, { useState } from "react";

const CreateElection = ({ contract }) => {
    const [candidates, setCandidates] = useState([""]);
    const [pin, setPin] = useState("");

    const addCandidate = () => setCandidates([...candidates, ""]);

    const handleCandidateChange = (index, value) => {
        const updated = [...candidates];
        updated[index] = value;
        setCandidates(updated);
    };

    const startElection = async () => {
        const generatedPin = Math.random().toString(36).substring(2, 8).toUpperCase();
        setPin(generatedPin);
        await contract.createElection(generatedPin, candidates);
        alert(`Votação criada! PIN: ${generatedPin}`);
    };

    return (
        <div className="container mt-4">
            <h2>Configurar Votação</h2>
            {candidates.map((c, index) => (
                <input key={index} type="text" value={c} onChange={(e) => handleCandidateChange(index, e.target.value)} className="form-control my-2" />
            ))}
            <button className="btn btn-primary" onClick={addCandidate}>Adicionar Candidato</button>
            <button className="btn btn-success ms-2" onClick={startElection}>Iniciar Votação</button>
            {pin && <p>PIN gerado: {pin}</p>}
        </div>
    );
};

export default CreateElection;