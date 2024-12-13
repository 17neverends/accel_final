import InputTextField from "../configInput/configInput";
import GlobalIcon from '@rsuite/icons/Global';
import BarChartIcon from '@rsuite/icons/BarChart';
import { useState, useEffect } from "react";
import styles from "./sending.module.css";
import { Button } from 'rsuite';
import { Session } from "../../interfaces/session";

export default function Sending() {
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const [mail, setMail] = useState<string>('');
    const [sessionData, setSessionData] = useState<Session[]>([]);

    useEffect(() => {
        window.addEventListener('online', () => setIsOnline(true));
        window.addEventListener('offline', () => setIsOnline(false));

        const sessions: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('session_')) {
                const session = localStorage.getItem(key);
                if (session) {
                    sessions.push(session);
                }
            }
        }
        setSessionData(sessions.map(session => JSON.parse(session)));
        
    }, []);

    const handleSendToEmail = (data: Session) => {
        if (mail) {
            console.log(`Sending session data to ${mail}:`, data);
        } else {
            alert("Please enter a valid email address.");
        }
    };
    console.log(sessionData);
    return (
        <div className={styles.info}>
            <div className={styles.details}>
                <InputTextField
                    value={mail}
                    onChange={setMail}
                    label="Почта"
                    placeholder="Почта"
                />
                <div className={styles.icon}>
                    {isOnline ? <GlobalIcon style={{ fontSize: "3em" }} /> : <BarChartIcon style={{ fontSize: "3em" }} />}
                </div>
            </div>

            { !isOnline ? 
            <div className={styles.cardsContainer} style={{ overflowY: sessionData.length > 4 ? 'auto' : 'hidden' }}>
                {sessionData.map((data, index) => (
                    <div key={index} className={styles.card}>
                        <h3>13.12.2024</h3>
                        <Button
                            appearance="ghost"
                            onClick={() => handleSendToEmail(data)}
                            disabled={mail === ""}
                        >
                            Отправить
                        </Button>
                    </div>
                ))}
            </div> : <h2>Offline</h2> }

        </div>
    );
}