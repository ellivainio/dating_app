import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Etusivu from './Etusivu';
import Deittaile from './Deittaile';
import OmaProfiili from './OmaProfiili';
import Asetukset from './Asetukset';
import KirjauduUlos from './LogoutScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
      <Drawer.Navigator initialRouteName="Etusivu">
        <Drawer.Screen name="Etusivu" component={Etusivu} />
        <Drawer.Screen name="Deittaile" component={Deittaile} />
        <Drawer.Screen name="Oma Profiili" component={OmaProfiili} />
        <Drawer.Screen name="Asetukset" component={Asetukset} />
        <Drawer.Screen name="Kirjaudu ulos" component={KirjauduUlos} />
      </Drawer.Navigator>
  );
}

export default DrawerNavigator;