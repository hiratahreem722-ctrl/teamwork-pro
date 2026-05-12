import { useState, PropsWithChildren } from 'react';
import { Layout } from 'antd';
import Sidebar from '@/Components/Sidebar';
import TopBar from '@/Components/TopBar';

const { Content } = Layout;

interface Props {
    title?: string;
}

export default function AppLayout({ title = 'Dashboard', children }: PropsWithChildren<Props>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh', background: '#F5F3FF' }}>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main area offset so it sits beside the fixed sidebar */}
            <Layout className="app-main-layout" style={{ background: '#F5F3FF' }}>
                <TopBar title={title} onMenuClick={() => setSidebarOpen(true)} />

                <Content className="content-pad" style={{ overflowY: 'auto' }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
