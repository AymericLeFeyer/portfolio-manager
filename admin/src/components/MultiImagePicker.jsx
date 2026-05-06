import { useState, useCallback } from 'react'
import { Modal, Upload, Input, Button, Spin, Space, theme, message } from 'antd'
import { PictureOutlined, CheckOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import client from '../api/client'

export default function MultiImagePicker({ value = [], onChange, folder = 'missions' }) {
  const [open, setOpen] = useState(false)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const { token } = theme.useToken()

  const selected = value || []

  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await client.get('/images')
      setImages(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  const handleOpen = () => {
    setSearch('')
    setOpen(true)
    fetchImages()
  }

  const toggleImage = (path) => {
    if (selected.includes(path)) {
      onChange?.(selected.filter(p => p !== path))
    } else {
      onChange?.([...selected, path])
    }
  }

  const removeImage = (path) => {
    onChange?.(selected.filter(p => p !== path))
  }

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const { data } = await client.post(`/upload?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setImages(prev => [...prev, { path: data.path, name: data.name, folder }])
      onChange?.([...selected, data.path])
      onSuccess(data)
    } catch (err) {
      message.error("Erreur lors de l'upload")
      onError(err)
    }
  }

  const filtered = images.filter(img =>
    img.name.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = filtered.reduce((acc, img) => {
    const key = img.folder || 'misc'
    if (!acc[key]) acc[key] = []
    acc[key].push(img)
    return acc
  }, {})

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        {selected.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selected.map(path => (
              <div key={path} style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={path}
                  alt=""
                  style={{
                    width: 80, height: 80, objectFit: 'cover',
                    border: '1px solid #d9d9d9', borderRadius: 6,
                  }}
                />
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeImage(path)}
                  style={{
                    position: 'absolute', top: 2, right: 2,
                    padding: '0 4px', minWidth: 'unset', height: 20, fontSize: 10,
                  }}
                />
              </div>
            ))}
          </div>
        )}
        <Button icon={<PictureOutlined />} onClick={handleOpen}>
          {selected.length > 0 ? `Gérer les images (${selected.length})` : 'Ajouter des images'}
        </Button>
      </Space>

      <Modal
        title="Images de la mission"
        open={open}
        onCancel={() => setOpen(false)}
        footer={<Button type="primary" onClick={() => setOpen(false)}>Fermer</Button>}
        width={680}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Upload.Dragger customRequest={handleUpload} showUploadList={false} accept="image/*">
            <p style={{ margin: 0 }}>
              <UploadOutlined style={{ fontSize: 20, marginRight: 8 }} />
              Glisser-déposer ou cliquer pour uploader
            </p>
          </Upload.Dragger>

          <Input.Search
            placeholder="Filtrer par nom..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: 32 }}><Spin /></div>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {Object.entries(grouped).map(([folderName, imgs]) => (
                <div key={folderName}>
                  <div style={{
                    fontWeight: 600, marginBottom: 8, marginTop: 8,
                    color: '#555', fontSize: 12, textTransform: 'uppercase',
                  }}>
                    {folderName}
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: 8, marginBottom: 12,
                  }}>
                    {imgs.map(img => {
                      const isSelected = selected.includes(img.path)
                      return (
                        <div
                          key={img.path}
                          onClick={() => toggleImage(img.path)}
                          style={{
                            position: 'relative',
                            border: `2px solid ${isSelected ? token.colorPrimary : '#d9d9d9'}`,
                            borderRadius: 6, padding: 6, cursor: 'pointer',
                            textAlign: 'center',
                            background: isSelected ? token.colorPrimaryBg : '#fff',
                          }}
                        >
                          <img
                            src={img.path}
                            alt={img.name}
                            style={{ width: 72, height: 72, objectFit: 'cover' }}
                          />
                          <div style={{
                            fontSize: 10, color: '#666', marginTop: 4,
                            wordBreak: 'break-all', lineHeight: 1.2,
                          }}>
                            {img.name}
                          </div>
                          {isSelected && (
                            <div style={{
                              position: 'absolute', top: 4, right: 4,
                              background: token.colorPrimary, borderRadius: '50%',
                              width: 18, height: 18,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <CheckOutlined style={{ color: '#fff', fontSize: 10 }} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              {Object.keys(grouped).length === 0 && (
                <div style={{ textAlign: 'center', color: '#888', padding: 32 }}>
                  Aucune image trouvée
                </div>
              )}
            </div>
          )}
        </Space>
      </Modal>
    </>
  )
}
