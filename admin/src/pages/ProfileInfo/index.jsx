import { useEffect, useState } from 'react'
import { Form, Input, Button, Typography, message, Card, Space } from 'antd'
import client from '../../api/client.js'

const { Title } = Typography

export default function ProfileInfo() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    client.get('/profile/bio').then(res => {
      const { name, role, contacts } = res.data
      form.setFieldsValue({
        name,
        role,
        email: contacts?.email,
        phone: contacts?.phone,
        linkedin: contacts?.linkedin,
        github: contacts?.github,
      })
    })
  }, [form])

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await client.put('/profile/bio', {
        name: values.name,
        role: values.role,
        contacts: {
          email: values.email,
          phone: values.phone,
          linkedin: values.linkedin,
          github: values.github,
        },
      })
      message.success('Profil mis à jour')
    } catch {
      message.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Title level={2}>Informations du profil</Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Nom" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Rôle" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Title level={4}>Contacts</Title>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Téléphone">
            <Input />
          </Form.Item>
          <Form.Item name="linkedin" label="LinkedIn">
            <Input />
          </Form.Item>
          <Form.Item name="github" label="GitHub">
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Enregistrer
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}
