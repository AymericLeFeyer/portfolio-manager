import { useEffect } from 'react'
import { Drawer, Form, Input, Button, Select, Space, message } from 'antd'
import client from '../../api/client.js'
import ImagePicker from '../../components/ImagePicker.jsx'

export default function TechnologyForm({ open, onClose, onSaved, editIndex, initialData }) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      initialData ? form.setFieldsValue(initialData) : form.resetFields()
    }
  }, [open, initialData, form])

  const onFinish = async (values) => {
    try {
      if (editIndex !== null && editIndex !== undefined) {
        await client.put(`/technologies/${editIndex}`, values)
        message.success('Technologie mise à jour')
      } else {
        await client.post('/technologies', values)
        message.success('Technologie ajoutée')
      }
      onSaved()
    } catch {
      message.error('Erreur lors de la sauvegarde')
    }
  }

  const categoryOptions = [
    'Language', 'Framework', 'Library', 'Tool', 'Platform', 'CI/CD',
    'Infrastructure', 'Database', 'Cloud', 'Testing', 'UI Library',
    'Runtime', 'Payment', 'Design',
  ].map(c => ({ value: c, label: c }))

  return (
    <Drawer
      title={editIndex !== null && editIndex !== undefined ? 'Modifier la technologie' : 'Nouvelle technologie'}
      open={open}
      onClose={onClose}
      width={400}
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
        <Form.Item name="category" label="Catégorie" rules={[{ required: true }]}>
          <Select showSearch options={categoryOptions} allowClear />
        </Form.Item>
        <Form.Item name="icon" label="Icône">
          <ImagePicker folder="technologies" />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
