import { useEffect, useState } from 'react'
import { Button, Table, Typography, Popconfirm, message, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import client from '../../api/client.js'
import EmploymentForm from './EmploymentForm.jsx'

const { Title } = Typography

export default function Employment() {
  const [employment, setEmployment] = useState([])
  const [companies, setCompanies] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  const load = async () => {
    const [e, c] = await Promise.all([
      client.get('/profile/employment'),
      client.get('/companies'),
    ])
    setEmployment(e.data)
    setCompanies(c.data)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (idx) => {
    try {
      await client.delete(`/profile/employment/${idx}`)
      message.success('Emploi supprimé')
      load()
    } catch {
      message.error('Erreur lors de la suppression')
    }
  }

  const columns = [
    { title: 'Entreprise', dataIndex: 'company', key: 'company' },
    { title: 'Poste', dataIndex: 'position', key: 'position' },
    { title: 'Début', dataIndex: 'start_date', key: 'start_date' },
    { title: 'Fin', dataIndex: 'end_date', key: 'end_date' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const idx = employment.indexOf(record)
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
        <Title level={2}>Emploi</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditIndex(null); setDrawerOpen(true) }}>
          Ajouter
        </Button>
      </div>
      <Table dataSource={employment} columns={columns} rowKey={(record) => employment.indexOf(record)} pagination={{ pageSize: 20 }} />
      <EmploymentForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={() => { setDrawerOpen(false); load() }}
        editIndex={editIndex}
        initialData={editIndex !== null ? employment[editIndex] : null}
        companies={companies}
      />
    </>
  )
}
