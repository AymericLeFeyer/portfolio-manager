import { useEffect } from 'react'
import { Drawer, Form, Input, Button, Space, message } from 'antd'
import client from '../../api/client.js'
import ImagePicker from '../../components/ImagePicker.jsx'

export default function CompanyForm({ open, onClose, onSaved, editIndex, initialData }) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      initialData ? form.setFieldsValue(initialData) : form.resetFields()
    }
  }, [open, initialData, form])

  const onFinish = async (values) => {
    try {
      if (editIndex !== null && editIndex !== undefined) {
        await client.put(`/companies/${editIndex}`, values)
        message.success('Entreprise mise à jour')
      } else {
        await client.post('/companies', values)
        message.success('Entreprise ajoutée')
      }
      onSaved()
    } catch {
      message.error('Erreur lors de la sauvegarde')
    }
  }

  return (
    <Drawer
      title={editIndex !== null && editIndex !== undefined ? 'Modifier l\'entreprise' : 'Nouvelle entreprise'}
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
        <Form.Item name="icon" label="Icône">
          <ImagePicker folder="companies" />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
