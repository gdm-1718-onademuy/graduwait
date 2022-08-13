import React from "react";
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';

// styling
import "./Info.scss";

// components
import LoggedIn from "../../auth/components/LoggedIn";
import LayoutFull from '../components/Layout/LayoutFull';
import Title from '../components/Title';


export default function Info() {
  const { t } = useTranslation()

  return ( <>
    <LoggedIn/>

    <LayoutFull>
      <Title>{t('Info.1')}</Title>
      <Typography mb={2} component="p" >{t('Info.1')}</Typography>

      <Title>{t('Info.3')}</Title>
      <Typography mb={2} component="p" >{t('Info.4')}</Typography>

      <Title>{t('Info.5')}</Title>
      <Typography mb={2} component="p" >{t('Info.6')}</Typography>

      <Title>{t('Info.7')}</Title>
      <Typography mb={2} component="p" >{t('Info.8')}</Typography>

    </LayoutFull>         
  </>);
}