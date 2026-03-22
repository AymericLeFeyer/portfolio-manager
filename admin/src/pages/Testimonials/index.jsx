import { useEffect, useState } from 'react'
import { Button, Table, Typography, Popconfirm, message, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import client from '../../api/client.js'
import TestimonialForm from './TestimonialForm.jsx'

const { Title } = Typography

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  const load = () => client.get('/profile/testimonials').then(r => setTestimonials(r.data))

  useEffect(() => { load() }, [])

  const handleDelete = async (idx) => {
    try {
      await client.delete(`/profile/testimonials/${idx}`)
      message.success('Témoignage supprimé')
      load()
    } catch {
      message.error('Erreur lors de la suppression')
    }
  }

  const columns = [
    { title: 'Nom', dataIndex: 'name', key: 'name', width: 180 },
    { title: 'Rôle', dataIndex: 'role', key: 'role', width: 180 },
    { title: 'Entreprise', dataIndex: 'company', key: 'company', width: 180 },
    { title: 'Message', dataIndex: 'message', key: 'message', ellipsis: true },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => {
        const idx = testimonials.indexOf(record)
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
        <Title level={2}>Témoignages</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditIndex(null); setDrawerOpen(true) }}>
          Ajouter
        </Button>
      </div>
      <Table dataSource={testimonials} columns={columns} rowKey={(_, i) => i} pagination={{ pageSize: 20 }} />
      <TestimonialForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={() => { setDrawerOpen(false); load() }}
        editIndex={editIndex}
        initialData={editIndex !== null ? testimonials[editIndex] : null}
      />
    </>
  )
}
