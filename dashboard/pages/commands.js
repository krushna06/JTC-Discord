import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Commands.module.css';

export default function Commands() {
  const [commands, setCommands] = useState([]);

  useEffect(() => {
    axios.get('https://3000-krushna06-jtcdiscord-zw8iggsnfge.ws-us115.gitpod.io/api/v1/info/commands')
      .then(response => {
        setCommands(response.data.commands);
      })
      .catch(error => {
        console.error('Error fetching commands:', error);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Commands</h1>
      <div className={styles.commandsList}>
        {commands.map(command => (
          <div key={command.name} className={styles.commandCard}>
            <h3 className={styles.commandName}>{command.name}</h3>
            <p className={styles.commandDescription}>{command.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
