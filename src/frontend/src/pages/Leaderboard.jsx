import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/Leaderboard.css";
import { useEffect, useState } from "react";


const Leaderboard = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:3000/leaderboard/get');
                const data = res.data?.data ?? res.data ?? [];

                console.log(res.data);

                if (mounted) setRows(Array.isArray(data) ? data : []);
            } catch (e) {
                if (mounted) setError(e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="leaderboard-page">
            <Sidebar/>
            <main className="leaderboard-content">
                <div className="leaderboard-container">
                    <h1>Leaderboard</h1>
                    {loading && <div className="loading">Loading...</div>}
                    {error && <div className="error">Failed to load leaderboard</div>}
                    {!loading && !error && rows.length === 0 && (
                        <div className="empty"><h3>No users to display</h3></div>
                    )}

                    {/* dynamically render one div per row */}
                    {rows.map((row, i) => (
                        <div className="leaderboard-row" key={row.id ?? row.api_key ?? i}>
                            <div className="rank">{i + 1}</div>
                            <div className="user">
                                <div className="name">{(row.name ?? `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim()) || 'Unknown'}</div>
                                <div className="score">{row.score ?? 0}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};


export default Leaderboard;