import React, { useState } from "react";

const Vote = ({ contract }) => {
    const [pin, setPin] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [selected, setSelected] = useState(null);

    const fetchCandidates = async () => {
        try {
            const count = await contract.getCandidateCount(pin);
            let tempCandidates = [];
            for (let i = 0; i < count; i++) {
                let candidate = await contract.getCandidateInfo(pin, i);
                tempCandidates.push({ name: candidate[0], votes: candidate[1] });
            }
            setCandidates(tempCandidates);
        } catch (error) {
            alert("Erro ao carregar candidatos. Verifique o PIN.");
        }
    };

    const vote = async () => {
        try {
            await contract.vote(pin, selected);
            alert("Voto registrado com sucesso!");
        } catch (error) {
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