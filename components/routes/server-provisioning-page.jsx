import React, { Component} from 'react';
import cx from 'classnames';
import Page from '../page';
import ServerProvisioningCard from '../server-provisioning/server-provisioning-card';
import styles from './server-provisioning-page.scss';


export default class ServerProvisioningPage extends Component {

render() {
    const classNames = {
      container: cx('container', styles.container),
      row: cx('row', styles.row)
    };
    
   return (
      <Page>
        <header className={styles['header-text']}>
            Server Provisioning
        </header>
        
        <div className={classNames.container}>
          <div className={classNames.row}>
            <div className="col-xs-12">
              <ServerProvisioningCard  />
            </div>
          </div>
        </div>
      </Page>
    );
  }
  
}
