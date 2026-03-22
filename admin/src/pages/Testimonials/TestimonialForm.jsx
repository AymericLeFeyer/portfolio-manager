import { useEffect } from 'react'
import { Drawer, Form, Input, Button, Space, message } from 'antd'
import client from '../../api/client.js'

export default function TestimonialForm({ open, onClose, onSaved, editIndex, initialData }) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      initialData ? form.setFieldsValue(initialData) : form.resetFields()
    }
  }, [open, initialData, form])

  const onFinish = async (values) => {
    try {
      if (editIndex !== null && editIndex !== undefined) {
        await client.put(`/profile/testimonials/${editIndex}`, values)
        message.success('Témoignage mis à jour')
      } else {
        await client.post('/profile/testimonials', values)
        message.success('Témoignage ajouté')
      }
      onSaved()
    } catch {
      message.error('Erreur lors de la sauvegarde')
    }
  }

  return (
    <Drawer
      title={editIndex !== null && editIndex !== undefined ? 'Modifier le témoignage' : 'Nouveau témoignage'}
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
        <Form.Item name="role" label="Rôle" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="company" label="Entreprise">
          <Input />
        </Form.Item>
        <Form.Item name="message" label="Message" rules={[{ required: true }]}>
          <Input.TextArea rows={5} />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
