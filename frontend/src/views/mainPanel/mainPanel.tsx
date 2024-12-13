import { Steps, Button, Container, Header, Content, Footer } from 'rsuite';
import React from 'react';
import styles from "./mainPanel.module.css";
import getSteps from '../../utils/steps';
import Config from '../../components/config/config';
import Monitoring from '../../components/monitoring/monitoring';
import Sending from '../../components/sending/sending';

export default function mainPanel() {
  const [step, setStep] = React.useState(0);
  const steps = getSteps();
  const [current, setCurrent] = React.useState<React.ReactNode>(null);
  const size = steps.length;
  const onChange = (nextStep: React.SetStateAction<number>) => {
    setStep(nextStep as number < 0 ? 0 : nextStep as number  > size ? size : nextStep);
  };

  React.useEffect(() => {
    if (step === 0) {
      setCurrent(<Config/>);
    } else if (step === 1) {
      setCurrent(<Monitoring/>);
    } else  if (step === 2) {
      setCurrent(<Sending/>);
    } else {
      setCurrent(null);
    }
  }, [step]);

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);

  return (
        <Container className={styles.container}>
            <Header className={styles.header}>
                <Steps current={step}>
                    {steps.map((s) => (
                    <Steps.Item key={s.title} title={s.title} icon={s.icon} />
                    ))}
                </Steps>
            </Header>
            <Content className={styles.content}>
                {current}
            </Content>
            <Footer className={styles.footer}>

                <Button  appearance="ghost" onClick={onPrevious} disabled={step === 0} style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>
                    Предыдущий шаг
                </Button>
                <Button  appearance="ghost" onClick={onNext} disabled={step === size - 1} style={{ visibility: step === size - 1 ? 'hidden' : 'visible' }}>
                    Следующий шаг
                </Button>
            </Footer>
        </Container>
  );
};

