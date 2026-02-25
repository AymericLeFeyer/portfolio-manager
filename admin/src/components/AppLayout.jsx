import { Layout, Menu } from 'antd'
import {
  UserOutlined,
  RocketOutlined,
  BankOutlined,
  BookOutlined,
  CalendarOutlined,
  ShopOutlined,
  CodeOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

const { Sider, Content } = Layout

const menuItems = [
  { key: '/profile', icon: <UserOutlined />, label: 'Profil' },
  { key: '/missions', icon: <RocketOutlined />, label: 'Missions' },
  { key: '/employment', icon: <BankOutlined />, label: 'Emploi' },
  { key: '/education', icon: <BookOutlined />, label: 'Formation' },
  { key: '/events', icon: <CalendarOutlined />, label: 'Évènements' },
  { key: '/companies', icon: <ShopOutlined />, label: 'Entreprises' },
  { key: '/technologies', icon: <CodeOutlined />, label: 'Technologies' },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{ background: '#001529' }}
      >
        <div style={{ padding: '16px', color: '#fff', fontWeight: 'bold', fontSize: 16, borderBottom: '1px solid #1f3a5f' }}>
          Portfolio Manager
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px', background: '#fff', padding: '24px', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
