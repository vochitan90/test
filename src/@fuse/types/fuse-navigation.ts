export interface FuseNavigationItem {
    parentId?: any;
    menuCode?: any;
    menuName?: any;
    urlPropertyName?: any;
    moduleName?: any;
    menuOrder?: any;
    menuType?: any;
    sys?: any;
    superAdmin?: any;
    historyToken?: any;
    menuPublic?: any;
    id?: string;
    title?: string;
    type?: 'item' | 'group' | 'collapsable';
    translate?: string;
    icon?: string;
    hidden?: boolean;
    url?: string;
    classes?: string;
    exactMatch?: boolean;
    externalUrl?: boolean;
    openInNewTab?: boolean;
    function?: any;
    badge?: {
        title?: string;
        translate?: string;
        bg?: string;
        fg?: string;
    };
    children?: any;
    // children?: FuseNavigationItem[];
}

export interface FuseNavigation extends FuseNavigationItem {
    // children?: FuseNavigationItem[];
    children?: any;
}
