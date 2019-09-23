import AuthService from "../services/authService";

class Navigation {
    static buildTabs() {
        let tabs = [
            {
                id: 'home_link',
                name: 'Home',
                disabled: false,
                href: '/',
            },
            {
                id: 'vehicle_list',
                name: 'Vehicles',
                disabled: false,
                href: '/vehicles',
            },
            {
                id: 'review_list',
                name: 'Reviews',
                disabled: false,
                href: '/reviews',
            },
        ];
        !AuthService.getCurrentUser() && tabs.push(
            {
                id: 'login',
                name: 'Login',
                disabled: false,
                href: '/login',
            },
            {
                id: 'register',
                name: 'Register',
                disabled: false,
                href: '/register',
            }
        );

        AuthService.isAdmin() && tabs.push({
            id: 'review_report_list',
            name: 'Review Reports',
            disabled: false,
            href: '/reviews-reports',
        });

        AuthService.getCurrentUser() && tabs.push({
            id: 'logout',
            name: 'Logout',
            disabled: false,
            href: "/logout"
        });

        return tabs;
    }
}
export default Navigation;
