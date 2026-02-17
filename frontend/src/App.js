import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchStandings();
    const interval = setInterval(fetchStandings, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchStandings() {
    const res = await axios.get(
      "http://localhost:5000/api/standings/635285"
    );
    setRows(res.data.rows);
  }

  return (
    <div>
      <h1>Live Standings</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Handle</th>
            <th>Points</th>
            <th>Penalty</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row.rank}</td>
              <td>{row.party.members[0].handle}</td>
              <td>{row.points}</td>
              <td>{row.penalty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
