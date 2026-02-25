import { useEffect, useState } from 'react'
import { Button, Table, Typography, Popconfirm, message, Space, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import client from '../../api/client.js'
import MissionForm from './MissionForm.jsx'

const { Title } = Typography

export default function Missions() {
  const [missions, setMissions] = useState([])
  const [companies, setCompanies] = useState([])
  const [technologies, setTechnologies] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  const load = async () => {
    const [m, c, t] = await Promise.all([
      client.get('/profile/missions'),
      client.get('/companies'),
      client.get('/technologies'),
    ])
    setMissions(m.data)
    setCompanies(c.data)
    setTechnologies(t.data)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (idx) => {
    try {
      await client.delete(`/profile/missions/${idx}`)
      message.success('Mission supprimée')
      load()
    } catch {
      message.error('Erreur lors de la suppression')
    }
  }

  const handleEdit = (idx) => {
    setEditIndex(idx)
    setDrawerOpen(true)
  }

  const handleAdd = () => {
    setEditIndex(null)
    setDrawerOpen(true)
  }

  const columns = [
    { title: 'Titre', dataIndex: 'title', key: 'title' },
    { title: 'Entreprise', dataIndex: 'company', key: 'company' },
    { title: 'Début', dataIndex: 'start_date', key: 'start_date' },
    { title: 'Fin', dataIndex: 'end_date', key: 'end_date' },
    {
      title: 'Side project',
      dataIndex: 'is_side_project',
      key: 'is_side_project',
      render: (v) => v ? <Tag color="blue">Oui</Tag> : <Tag>Non</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, __, idx) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(idx)} size="small" />
          <Popconfirm title="Supprimer cette mission ?" onConfirm={() => handleDelete(idx)}>
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Missions</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Ajouter
        </Button>
      </div>
      <Table
        dataSource={missions}
        columns={columns}
        rowKey={(_, idx) => idx}
        pagination={{ pageSize: 20 }}
      />
      <MissionForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={() => { setDrawerOpen(false); load() }}
        editIndex={editIndex}
        initialData={editIndex !== null ? missions[editIndex] : null}
        companies={companies}
        technologies={technologies}
      />
    </>
  )
}
