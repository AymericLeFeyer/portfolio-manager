import { useEffect, useState } from 'react'
import { Button, Table, Typography, Popconfirm, message, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import client from '../../api/client.js'
import CompanyForm from './CompanyForm.jsx'

const { Title } = Typography

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  const load = () => client.get('/companies').then(r => setCompanies(r.data))

  useEffect(() => { load() }, [])

  const handleDelete = async (idx) => {
    try {
      await client.delete(`/companies/${idx}`)
      message.success('Entreprise supprimée')
      load()
    } catch {
      message.error('Erreur lors de la suppression')
    }
  }

  const columns = [
    { title: 'Nom', dataIndex: 'name', key: 'name' },
    { title: 'Icône', dataIndex: 'icon', key: 'icon', ellipsis: true },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const idx = companies.indexOf(record)
        return (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => { setEditIndex(idx); setDrawerOpen(true) }} size="small" />
            <Popconfirm title="Supprimer ?" onConfirm={() => handleDelete(idx)}>
              <Button icon={<DeleteOutlined />} danger size="small" />
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Entreprises</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditIndex(null); setDrawerOpen(true) }}>
          Ajouter
        </Button>
      </div>
      <Table dataSource={companies} columns={columns} rowKey={(record) => companies.indexOf(record)} pagination={{ pageSize: 30 }} />
      <CompanyForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={() => { setDrawerOpen(false); load() }}
        editIndex={editIndex}
        initialData={editIndex !== null ? companies[editIndex] : null}
      />
    </>
  )
}
