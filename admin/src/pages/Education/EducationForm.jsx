import { useEffect } from 'react'
import { Drawer, Form, Input, Button, Space, message } from 'antd'
import client from '../../api/client.js'
import ImagePicker from '../../components/ImagePicker.jsx'

export default function EducationForm({ open, onClose, onSaved, editIndex, initialData }) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      initialData ? form.setFieldsValue(initialData) : form.resetFields()
    }
  }, [open, initialData, form])

  const onFinish = async (values) => {
    try {
      if (editIndex !== null && editIndex !== undefined) {
        await client.put(`/profile/education/${editIndex}`, values)
        message.success('Formation mise à jour')
      } else {
        await client.post('/profile/education', values)
        message.success('Formation ajoutée')
      }
      onSaved()
    } catch {
      message.error('Erreur lors de la sauvegarde')
    }
  }

  return (
    <Drawer
      title={editIndex !== null && editIndex !== undefined ? 'Modifier la formation' : 'Nouvelle formation'}
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
        <Form.Item name="institution" label="Établissement" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="degree" label="Diplôme / Intitulé" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Space size="large">
          <Form.Item name="start_date" label="Début (YYYY-MM)">
            <Input placeholder="2020-09" />
          </Form.Item>
          <Form.Item name="end_date" label="Fin (YYYY-MM)">
            <Input placeholder="2022-06" />
          </Form.Item>
        </Space>
        <Form.Item name="icon" label="Icône">
          <ImagePicker folder="misc" />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
