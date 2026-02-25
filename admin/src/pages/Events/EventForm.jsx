import { useEffect } from 'react'
import { Drawer, Form, Input, Button, Select, Space, message } from 'antd'
import client from '../../api/client.js'
import ImagePicker from '../../components/ImagePicker.jsx'

export default function EventForm({ open, onClose, onSaved, editIndex, initialData }) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      initialData ? form.setFieldsValue(initialData) : form.resetFields()
    }
  }, [open, initialData, form])

  const onFinish = async (values) => {
    try {
      if (editIndex !== null && editIndex !== undefined) {
        await client.put(`/profile/events/${editIndex}`, values)
        message.success('Évènement mis à jour')
      } else {
        await client.post('/profile/events', values)
        message.success('Évènement ajouté')
      }
      onSaved()
    } catch {
      message.error('Erreur lors de la sauvegarde')
    }
  }

  const typeOptions = [
    { value: 'talk', label: 'Talk' },
    { value: 'certification', label: 'Certification' },
    { value: 'conference', label: 'Conférence' },
    { value: 'other', label: 'Autre' },
  ]

  return (
    <Drawer
      title={editIndex !== null && editIndex !== undefined ? 'Modifier l\'évènement' : 'Nouvel évènement'}
      open={open}
      onClose={onClose}
      width={500}
      extra={
        <Space>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="primary" onClick={() => form.submit()}>Enregistrer</Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Nom" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="date" label="Date (YYYY-MM)" rules={[{ required: true }]}>
          <Input placeholder="2024-07" />
        </Form.Item>
        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
          <Select options={typeOptions} />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="icon" label="Icône">
          <ImagePicker folder="misc" />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
