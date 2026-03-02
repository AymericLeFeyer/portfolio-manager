import { useEffect, useState } from 'react'
import { Button, Table, Typography, Popconfirm, message, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import client from '../../api/client.js'
import EducationForm from './EducationForm.jsx'

const { Title } = Typography

export default function Education() {
  const [education, setEducation] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  const load = () => client.get('/profile/education').then(r => setEducation(r.data))

  useEffect(() => { load() }, [])

  const handleDelete = async (idx) => {
    try {
      await client.delete(`/profile/education/${idx}`)
      message.success('Formation supprimée')
      load()
    } catch {
      message.error('Erreur lors de la suppression')
    }
  }

  const columns = [
    { title: 'Établissement', dataIndex: 'institution', key: 'institution' },
    { title: 'Diplôme', dataIndex: 'degree', key: 'degree' },
    { title: 'Début', dataIndex: 'start_date', key: 'start_date' },
    { title: 'Fin', dataIndex: 'end_date', key: 'end_date' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const idx = education.indexOf(record)
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
        <Title level={2}>Formation</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditIndex(null); setDrawerOpen(true) }}>
          Ajouter
        </Button>
      </div>
      <Table dataSource={education} columns={columns} rowKey={(record) => education.indexOf(record)} pagination={{ pageSize: 20 }} />
      <EducationForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={() => { setDrawerOpen(false); load() }}
        editIndex={editIndex}
        initialData={editIndex !== null ? education[editIndex] : null}
      />
    </>
  )
}
