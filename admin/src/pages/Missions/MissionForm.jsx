import { useEffect } from 'react'
import {
  Drawer, Form, Input, Button, Switch, Select, Slider, Space, Typography, message, Divider
} from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import client from '../../api/client.js'

const { Title } = Typography

export default function MissionForm({ open, onClose, onSaved, editIndex, initialData, companies, technologies }) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          link_url: initialData.link?.url,
          link_text: initialData.link?.text,
        })
      } else {
        form.resetFields()
      }
    }
  }, [open, initialData, form])

  const onFinish = async (values) => {
    const payload = {
      title: values.title,
      context: values.context,
      company: values.company,
      start_date: values.start_date,
      end_date: values.end_date,
      row: values.row ? parseInt(values.row) : undefined,
      is_side_project: values.is_side_project || false,
      technologies: (values.technologies || []).map(t => ({
        name: t.name,
        frequency: t.frequency ?? 1,
        comments: t.comments || '',
      })),
      tasks: (values.tasks || []).filter(Boolean),
    }
    if (values.link_url) {
      payload.link = { url: values.link_url, text: values.link_text || '' }
    }
    try {
      if (editIndex !== null && editIndex !== undefined) {
        await client.put(`/profile/missions/${editIndex}`, payload)
        message.success('Mission mise à jour')
      } else {
        await client.post('/profile/missions', payload)
        message.success('Mission ajoutée')
      }
      onSaved()
    } catch {
      message.error('Erreur lors de la sauvegarde')
    }
  }

  const companyOptions = companies.map(c => ({ value: c.name, label: c.name }))
  const techOptions = technologies.map(t => ({ value: t.name, label: t.name }))

  return (
    <Drawer
      title={editIndex !== null && editIndex !== undefined ? 'Modifier la mission' : 'Nouvelle mission'}
      open={open}
      onClose={onClose}
      width={720}
      extra={
        <Space>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="primary" onClick={() => form.submit()}>Enregistrer</Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Titre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="context" label="Contexte">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="company" label="Entreprise">
          <Select showSearch options={companyOptions} allowClear />
        </Form.Item>
        <Space style={{ width: '100%' }} size="large">
          <Form.Item name="start_date" label="Début (YYYY-MM)">
            <Input placeholder="2024-01" />
          </Form.Item>
          <Form.Item name="end_date" label="Fin (YYYY-MM ou Present)">
            <Input placeholder="Present" />
          </Form.Item>
          <Form.Item name="row" label="Row">
            <Input type="number" style={{ width: 80 }} />
          </Form.Item>
        </Space>
        <Form.Item name="is_side_project" label="Side project" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="link_url" label="Lien URL">
          <Input />
        </Form.Item>
        <Form.Item name="link_text" label="Lien texte">
          <Input />
        </Form.Item>

        <Divider>Technologies</Divider>
        <Form.List name="technologies">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8, alignItems: 'flex-start' }} align="start">
                  <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Nom requis' }]}>
                    <Select showSearch options={techOptions} placeholder="Technologie" style={{ width: 180 }} allowClear />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'frequency']} label="Fréquence" initialValue={1}>
                    <Slider min={0} max={1} step={0.1} style={{ width: 120 }} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'comments']}>
                    <Input placeholder="Commentaire" style={{ width: 200 }} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} style={{ marginTop: 8, color: 'red' }} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Ajouter une technologie
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider>Tâches</Divider>
        <Form.List name="tasks">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item {...restField} name={[name]} style={{ marginBottom: 0, flex: 1 }}>
                    <Input placeholder="Tâche" style={{ width: 400 }} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Ajouter une tâche
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Drawer>
  )
}
