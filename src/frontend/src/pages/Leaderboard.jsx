import axios from "axios";
import Sidebar from "../components/Sidebar";
import useSocket from "../hooks/useSocket";
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

    // const socketRef = useSocket({ url: "http://localhost:3000", auth: apiKey });

    // useEffect(() => {
    //     const socket = socketRef.current;
    //     if (!socket) return;

    //     const onUpdate = (payload) => {
    //         // adjust according to payload shape
    //         if (Array.isArray(payload)) setRows(payload);
    //         else {
    //             setRows(prev => {
    //                 const i = prev.findIndex(r => r.api_key === payload.api_key);
    //                 if (i === -1) return [payload, ...prev];
    //                 const next = [...prev]; next[i] = { ...next[i], ...payload }; return next;
    //             });
    //         }
    //     };

    //     socket.on("scoreUpdated", onUpdate);
    //     return () => socket.off("scoreUpdated", onUpdate);
    // }, [socketRef]);

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