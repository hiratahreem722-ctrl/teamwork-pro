import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const theme = {
    token: {
        colorPrimary:       '#7C3AED',
        colorPrimaryHover:  '#6D28D9',
        colorPrimaryActive: '#4C1D95',
        colorLink:          '#7C3AED',
        colorLinkHover:     '#6D28D9',
        borderRadius:       8,
        borderRadiusLG:     12,
        fontFamily:         'Inter, ui-sans-serif, system-ui, sans-serif',
        colorBgContainer:   '#FFFFFF',
        colorBgLayout:      '#F5F3FF',
        colorBorder:        '#E2E8F0',
        colorBorderSecondary: '#F5F3FF',
    },
    components: {
        Button: {
            borderRadius: 8,
        },
        Input: {
            borderRadius: 8,
        },
        Select: {
            borderRadius: 8,
        },
        Card: {
            borderRadius: 12,
        },
        Modal: {
            borderRadius: 12,
        },
    },
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ConfigProvider theme={theme}>
                <App {...props} />
            </ConfigProvider>
        );
    },
    progress: {
        color: '#7C3AED',
    },
});
