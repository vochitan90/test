import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from 'app/app.module';
import { environment } from 'environments/environment';
import { hmrBootstrap } from 'hmr';
// import { LicenseManager } from '@ag-grid-enterprise/core';
// import { ModuleRegistry, AllCommunityModules } from '@ag-grid-community/';
// LicenseManager.setLicenseKey('Evaluation_License_Valid_Until__7_November_2018__MTU0MTU0ODgwMDAwMA==85765fef4e02a59e323b51600fb9fea3');

if ( environment.production )
{
    enableProdMode();
}
// ModuleRegistry.registerModules(AllCommunityModules);

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if ( environment.hmr )
{
    if ( module['hot'] )
    {
        hmrBootstrap(module, bootstrap);
    }
    else
    {
        console.error('HMR is not enabled for webpack-dev-server!');
        console.log('Are you using the --hmr flag for ng serve?');
    }
}
else
{
    bootstrap().catch(err => console.log(err));
}
