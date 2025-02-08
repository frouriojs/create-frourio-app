'use client';

import useAspidaSWR from '@aspida/swr';
import type { Task } from 'common/types';
import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import styles from './page.module.css';

export default function Home() {
  const { data: tasks, error, mutate } = useAspidaSWR(apiClient.tasks);
  const [label, setLabel] = useState('');
  const inputLabel = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value),
    [],
  );
  const createTask = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!label) return;

      await apiClient.tasks.post({ body: { label } });

      setLabel('');
      mutate();
    },
    [label, mutate],
  );

  const toggleDone = useCallback(
    async (task: Task) => {
      await apiClient.tasks._taskId(task.id).patch({ body: { done: !task.done } });
      mutate();
    },
    [mutate],
  );

  const deleteTask = useCallback(
    async (task: Task) => {
      await apiClient.tasks._taskId(task.id).delete();
      mutate();
    },
    [mutate],
  );

  if (error) return <div>failed to load</div>;

  if (!tasks) return <div>loading...</div>;

  return (
    <>
      <h1 className={styles.title}>
        Welcome to <a href="https://nextjs.org">Next.js!</a>
      </h1>

      <p className={styles.description}>frourio-todo-app</p>

      <div>
        <form style={{ textAlign: 'center' }} onSubmit={createTask}>
          <input value={label} type="text" onChange={inputLabel} />
          <input type="submit" value="ADD" />
        </form>
        <ul className={styles.tasks}>
          {tasks.map((task) => (
            <li key={task.id}>
              <label>
                <input type="checkbox" checked={task.done} onChange={() => toggleDone(task)} />
                <span>{task.label}</span>
              </label>
              <input
                type="button"
                value="DELETE"
                style={{ float: 'right' }}
                onClick={() => deleteTask(task)}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
