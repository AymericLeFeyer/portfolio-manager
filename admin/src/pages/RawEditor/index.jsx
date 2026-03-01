import { useState, useEffect, useCallback } from 'react'
import { Tabs, Button, Space, message, Typography } from 'antd'
import { CopyOutlined, DownloadOutlined, SaveOutlined } from '@ant-design/icons'
import client from '../../api/client'

const { Text } = Typography

const FILES = [
  { key: 'profile', label: 'profile.json' },
  { key: 'companies', label: 'companies.json' },
  { key: 'technologies', label: 'technologies.json' },
]

function JsonEditor({ fileKey }) {
  const [text, setText] = useState('')
  const [original, setOriginal] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await client.get(`/raw/${fileKey}`)
      const pretty = JSON.stringify(res.data, null, 2)
      setText(pretty)
      setOriginal(pretty)
      setError(null)
    } catch {
      message.error(`Erreur lors du chargement de ${fileKey}.json`)
    }
  }, [fileKey])

  useEffect(() => { load() }, [load])

  const validate = (value) => {
    try {
      JSON.parse(value)
      setError(null)
      return true
    } catch (e) {
      setError(e.message)
      return false
    }
  }

  const handleChange = (e) => {
    const value = e.target.value
    setText(value)
    validate(value)
  }

  const handleSave = async () => {
    if (!validate(text)) return
    setSaving(true)
    try {
      await client.put(`/raw/${fileKey}`, JSON.parse(text))
      setOriginal(text)
      message.success('Sauvegardé')
    } catch {
      message.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    message.success('Copié dans le presse-papier')
  }

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileKey}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const isDirty = text !== original

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Space>
        <Button icon={<SaveOutlined />} type="primary" onClick={handleSave} loading={saving} disabled={!isDirty || !!error}>
          Sauvegarder
        </Button>
        <Button icon={<CopyOutlined />} onClick={handleCopy}>
          Copier
        </Button>
        <Button icon={<DownloadOutlined />} onClick={handleDownload}>
          Télécharger
        </Button>
        {isDirty && !error && <Text type="warning">Modifications non sauvegardées</Text>}
        {error && <Text type="danger">JSON invalide : {error}</Text>}
      </Space>
      <textarea
        value={text}
        onChange={handleChange}
        spellCheck={false}
        style={{
          width: '100%',
          height: 'calc(100vh - 280px)',
          fontFamily: 'monospace',
          fontSize: 13,
          lineHeight: 1.5,
          padding: 12,
          border: error ? '1px solid #ff4d4f' : '1px solid #d9d9d9',
          borderRadius: 6,
          resize: 'vertical',
          outline: 'none',
          background: '#fafafa',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

export default function RawEditor() {
  return (
    <>
      <h2 style={{ marginTop: 0 }}>Éditeur JSON brut</h2>
      <Tabs
        items={FILES.map(({ key, label }) => ({
          key,
          label,
          children: <JsonEditor fileKey={key} />,
        }))}
      />
    </>
  )
}
