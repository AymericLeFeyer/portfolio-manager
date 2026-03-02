import { useEffect, useState } from 'react'
import { Button, Table, Typography, Popconfirm, message, Space, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import client from '../../api/client.js'
import EventForm from './EventForm.jsx'

const { Title } = Typography

export default function Events() {
  const [events, setEvents] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  const load = () => client.get('/profile/events').then(r => setEvents(r.data))

  useEffect(() => { load() }, [])

  const handleDelete = async (idx) => {
    try {
      await client.delete(`/profile/events/${idx}`)
      message.success('Évènement supprimé')
      load()
    } catch {
      message.error('Erreur lors de la suppression')
    }
  }

  const typeColor = { talk: 'blue', certification: 'green' }

  const columns = [
    { title: 'Nom', dataIndex: 'name', key: 'name' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (v) => <Tag color={typeColor[v] || 'default'}>{v}</Tag>,
    },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const idx = events.indexOf(record)
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
        <Title level={2}>Évènements</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditIndex(null); setDrawerOpen(true) }}>
          Ajouter
        </Button>
      </div>
      <Table dataSource={events} columns={columns} rowKey={(record) => events.indexOf(record)} pagination={{ pageSize: 20 }} />
      <EventForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={() => { setDrawerOpen(false); load() }}
        editIndex={editIndex}
        initialData={editIndex !== null ? events[editIndex] : null}
      />
    </>
  )
}
