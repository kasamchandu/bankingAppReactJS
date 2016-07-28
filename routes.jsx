import BaseLayout from './components/layout/base-layout';
import ApplicationLayout from './components/layout/application-layout';
import LoginPage from './components/routes/login-page';
import CustomersPage from './components/routes/customers-page';
import NewCustomerPage from './components/routes/new-customer-page';
import EditCustomerPage from './components/routes/edit-customer-page';
import CustomerDetailPage from './components/routes/customer-detail-page';
import LocationDetailPage from './components/routes/location-detail-page';
import EnergyServicesPage from './components/routes/energy-services-page';
import SectionDetailPage from './components/routes/section-detail-page';
import ServerDetailPage from './components/routes/server-detail-page';
import ServerPage from './components/routes/server-page';
import SpaceManagementPage from './components/routes/space-management-page';
import NotFoundPage from './components/routes/not-found-page';
import ServerProvisioningPage from './components/routes/server-provisioning-page';
import auth from './lib/auth';
const { BASE_URL, BROWSER } = process.env;

function requireAuth(nextState, replaceState) {
  if (!auth.loggedIn()) {
    replaceState({ nextPathname: nextState.location.pathname }, `${BASE_URL}/login`);
  }
}

const routes = {
  path: '/',
  component: BaseLayout,
  childRoutes: [
    { path: 'login', component: LoginPage },
    {
      component: ApplicationLayout,
      indexRoute: { component: CustomersPage },
      onEnter: requireAuth,
      childRoutes: [
        { path: 'provisioning', component: ServerProvisioningPage },
        {
          path: 'customers',
          childRoutes: [
            { path: 'new', component: NewCustomerPage },
            { path: ':customerId', component: CustomerDetailPage },
            { path: ':customerId/edit', component: EditCustomerPage }
          ]
        },
        {
          path: 'customers/:customerId',
          childRoutes: [
            { path: 'energy', component: EnergyServicesPage },
            { path: 'space', component: SpaceManagementPage },
            { path: 'locations/:locationId', component: LocationDetailPage },
            { path: 'locations/:locationId/sections/:sectionId', component: SectionDetailPage },
            { path: 'locations/:locationId/energy', component: EnergyServicesPage },
            { path: 'locations/:locationId/space', component: SpaceManagementPage },
            { path: 'locations/:locationId/servers/:serverId', component: ServerDetailPage },
            { path: 'locations/:locationId/servers', component: ServerPage }
          ]
        }
      ]
    }
  ]
};

if (BROWSER) {
  let appLayoutPath = routes.childRoutes[1];
  appLayoutPath.childRoutes.push({
    path: '*',
    component: NotFoundPage
  });
}

function getRoutes(base) {
  if (base) {
    routes.path = base;
  }

  return routes;
}

export { getRoutes };
