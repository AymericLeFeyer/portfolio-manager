import { useEffect, useState } from 'react'
import { Button, Table, Typography, Popconfirm, message, Space, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import client from '../../api/client.js'
import TechnologyForm from './TechnologyForm.jsx'

const { Title } = Typography

export default function Technologies() {
  const [technologies, setTechnologies] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  const load = () => client.get('/technologies').then(r => setTechnologies(r.data))

  useEffect(() => { load() }, [])

  const handleDelete = async (idx) => {
    try {
      await client.delete(`/technologies/${idx}`)
      message.success('Technologie supprimée')
      load()
    } catch {
      message.error('Erreur lors de la suppression')
    }
  }

  const columns = [
    { title: 'Nom', dataIndex: 'name', key: 'name' },
    {
      title: 'Catégorie',
      dataIndex: 'category',
      key: 'category',
      render: (v) => <Tag>{v}</Tag>,
    },
    { title: 'Icône', dataIndex: 'icon', key: 'icon', ellipsis: true },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, __, idx) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => { setEditIndex(idx); setDrawerOpen(true) }} size="small" />
          <Popconfirm title="Supprimer ?" onConfirm={() => handleDelete(idx)}>
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Technologies</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditIndex(null); setDrawerOpen(true) }}>
          Ajouter
        </Button>
      </div>
      <Table dataSource={technologies} columns={columns} rowKey={(_, idx) => idx} pagination={{ pageSize: 30 }} />
      <TechnologyForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={() => { setDrawerOpen(false); load() }}
        editIndex={editIndex}
        initialData={editIndex !== null ? technologies[editIndex] : null}
      />
    </>
  )
}
