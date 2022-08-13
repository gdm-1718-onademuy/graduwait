import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import {useTranslation} from 'react-i18next';


function preventDefault(event) {
  event.preventDefault();
} 

export default function HuidigeSessie() {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <Title>{t('Dashboard.1')}</Title>
      <Typography component="p">
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
      {t('Dashboard.5')}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
        </Link>
      </div>
    </React.Fragment>
  );
}