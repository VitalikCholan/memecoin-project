import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { TokenomicsComponent } from './pages/tokenomics/tokenomics.component';
import { HowToBuyComponent } from './pages/how-to-buy/how-to-buy.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'tokenomics',
    component: TokenomicsComponent,
  },
  {
    path: 'how-to-buy',
    component: HowToBuyComponent,
  },
];
