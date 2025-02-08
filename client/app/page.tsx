'use client';

import useAspidaSWR from '@aspida/swr';
import type { LocalPathInfo } from 'api/localPath';
import { cmdEscapeSingleInput, shellEscapeSingleInput } from 'common/escape';
import type { Answers } from 'common/prompts';
import { cfaPrompts, getAllDefaultAnswers, isAnswersValid } from 'common/prompts';
import { CommandInput } from 'components/CommandInput';
import { PrimaryButton } from 'components/PrimaryButton';
import { Question } from 'components/Question';
import { useCallback, useEffect, useState } from 'react';
import styles from 'styles/Home.module.css';
import questionStyles from 'styles/Question.module.css';
import { apiClient } from 'utils/apiClient';

export default function Home() {
  const { data: serverStatus, mutate } = useAspidaSWR(apiClient.status);
  const [touched, setTouched] = useState<true | { [key: string]: true }>({});
  const [answers, setAnswers] = useState(getAllDefaultAnswers());
  const [created, setCreated] = useState(false);
  const [localPathInfo, setLocalPathInfo] = useState<LocalPathInfo | undefined>();
  const [localPathInfoFetching, setlocalPathInfoFetching] = useState(true);
  const { dir } = answers;
  const canCreate = isAnswersValid(answers);
  const choice = useCallback(
    (name: keyof Answers, val: string) =>
      setAnswers({ ...getAllDefaultAnswers(), ...answers, [name]: val }),
    [answers],
  );
  const create = useCallback(async () => {
    setTouched(true);
    if (!canCreate) {
      alert('Cannot proceed because conditions are not met. Please review your configurations.');
      return;
    }

    const info = await apiClient.localPath.$post({ body: { path: dir || '' } });

    setLocalPathInfo(info);
    setlocalPathInfoFetching(false);

    if (info.canContinue !== null) {
      alert(info.canContinue);
      return;
    }

    await apiClient.answers.$patch({ body: answers });

    mutate();
    setCreated(true);
  }, [answers, canCreate, dir, mutate]);

  if (serverStatus?.status === 'installing' && !created) {
    setCreated(true);
  }

  useEffect(() => {
    let canceled = false;
    setlocalPathInfoFetching(true);
    if (typeof dir === 'string') {
      apiClient.localPath.$post({ body: { path: dir } }).then((info) => {
        if (!canceled) {
          setLocalPathInfo(info);
          setlocalPathInfoFetching(false);
        }
      });
    } else {
      setLocalPathInfo(undefined);
    }

    return () => void (canceled = true);
  }, [dir]);

  return (
    <>
      <img src="/images/logo.svg" alt="Frourio Logo" className={styles.logo} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{' '}
          <a href="https://github.com/frouriojs/frourio" target="_brank">
            frourio!
          </a>
        </h1>

        <p className={styles.description}>create-frourio-app</p>

        <div>
          {cfaPrompts.map((question) => (
            <Question
              key={question.name}
              answers={answers}
              question={question}
              onChoice={choice}
              touched={touched === true || (touched[question.name] ?? false)}
              addError={question.name === 'dir' && localPathInfo?.canContinue}
              addInfo={question.name === 'dir' && localPathInfo?.absPath}
              onTouch={() => {
                if (touched !== true) setTouched({ ...touched, [question.name]: true });
              }}
            />
          ))}
        </div>
        {process.env.NODE_ENV === 'development' && (
          <>
            <div className={questionStyles.card}>
              <h4 className={questionStyles.message}>Shell</h4>
              <div className={questionStyles.ctrls}>
                <CommandInput
                  value={`npm init frourio-app --answers ${shellEscapeSingleInput(
                    JSON.stringify(answers),
                  )}`}
                />
              </div>
            </div>
            <div className={questionStyles.card}>
              <h4 className={questionStyles.message}>Command Prompt</h4>
              <div className={questionStyles.ctrls}>
                <CommandInput
                  value={`npm init frourio-app --answers ${cmdEscapeSingleInput(
                    JSON.stringify(answers),
                  )}`}
                />
              </div>
            </div>
          </>
        )}

        {serverStatus?.status === 'installing' && (
          <div style={{ marginTop: '16px', paddingBottom: 32, fontSize: 20 }}>
            Installing on terminal...
          </div>
        )}
      </main>

      {serverStatus?.status === 'waiting' && (
        <div style={{ marginTop: '16px', paddingBottom: 32 }}>
          <PrimaryButton
            onClick={create}
            disabled={
              (!canCreate && touched === true) ||
              localPathInfoFetching ||
              localPathInfo?.canContinue !== null
            }
          >
            Create
          </PrimaryButton>
        </div>
      )}
    </>
  );
}
