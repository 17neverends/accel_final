import GearIcon from '@rsuite/icons/Gear';
import EmailIcon from '@rsuite/icons/Email';
import VisibleIcon from '@rsuite/icons/Visible';


export default function getSteps() { return  [
    {
        title: 'Конфигурация',
        description: 'Выберите комбайн и задайте параметры',
        icon: <GearIcon style={{ fontSize: 40 }} />,
    },
    {
        title: 'Мониторинг',
        description: 'Получайте данные исходя из конфигурации',
        icon: <VisibleIcon style={{ fontSize: 40 }} />,
    },
    {
        title: 'Сохранение данных',
        description: 'Введите данные для отправки',
        icon: <EmailIcon style={{ fontSize: 40 }} />,
    },

]};