import { useEffect } from 'react'
import { Drawer, Form, Input, Button, Select, Space, message, Divider } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import client from '../../api/client.js'

export default function EmploymentForm({ open, onClose, onSaved, editIndex, initialData, companies }) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      initialData ? form.setFieldsValue(initialData) : form.resetFields()
    }
  }, [open, initialData, form])

  const onFinish = async (values) => {
    const payload = {
      company: values.company,
      position: values.position,
      start_date: values.start_date,
      end_date: values.end_date,
      row: values.row ? parseInt(values.row) : undefined,
      responsibilities: (values.responsibilities || []).filter(Boolean),
    }
    try {
      if (editIndex !== null && editIndex !== undefined) {
        await client.put(`/profile/employment/${editIndex}`, payload)
        message.success('Emploi mis à jour')
      } else {
        await client.post('/profile/employment', payload)
        message.success('Emploi ajouté')
      }
      onSaved()
    } catch {
      message.error('Erreur lors de la sauvegarde')
    }
  }

  const companyOptions = companies.map(c => ({ value: c.name, label: c.name }))

  return (
    <Drawer
      title={editIndex !== null && editIndex !== undefined ? 'Modifier l\'emploi' : 'Nouvel emploi'}
      open={open}
      onClose={onClose}
      width={600}
      extra={
        <Space>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="primary" onClick={() => form.submit()}>Enregistrer</Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="company" label="Entreprise" rules={[{ required: true }]}>
          <Select showSearch options={companyOptions} allowClear />
        </Form.Item>
        <Form.Item name="position" label="Poste" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Space size="large">
          <Form.Item name="start_date" label="Début (YYYY-MM)">
            <Input placeholder="2022-09" />
          </Form.Item>
          <Form.Item name="end_date" label="Fin (YYYY-MM ou Present)">
            <Input placeholder="Present" />
          </Form.Item>
          <Form.Item name="row" label="Row">
            <Input type="number" style={{ width: 80 }} />
          </Form.Item>
        </Space>

        <Divider>Responsabilités</Divider>
        <Form.List name="responsibilities">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item {...restField} name={[name]} style={{ marginBottom: 0, flex: 1 }}>
                    <Input placeholder="Responsabilité" style={{ width: 400 }} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Ajouter une responsabilité
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Drawer>
  )
}
