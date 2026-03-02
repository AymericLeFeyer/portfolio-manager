import { useState, useCallback } from 'react'
import { Modal, Upload, Input, Button, Spin, Space, theme, message } from 'antd'
import { PictureOutlined, CheckOutlined, UploadOutlined } from '@ant-design/icons'
import client from '../api/client'

export default function ImagePicker({ value, onChange, folder = 'misc' }) {
  const [open, setOpen] = useState(false)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const { token } = theme.useToken()

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
    setSelected(value || null)
    setSearch('')
    setOpen(true)
    fetchImages()
  }

  const handleOk = () => {
    onChange?.(selected)
    setOpen(false)
  }

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const { data } = await client.post(`/upload?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setImages(prev => [...prev, { path: data.path, name: data.name, folder }])
      setSelected(data.path)
      onSuccess(data)
    } catch (err) {
      message.error('Erreur lors de l\'upload')
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
      <Space align="center">
        {value ? (
          <img
            src={value}
            alt=""
            style={{
              width: 48, height: 48, objectFit: 'contain',
              border: '1px solid #d9d9d9', borderRadius: 4, padding: 4,
            }}
          />
        ) : (
          <div style={{
            width: 48, height: 48, display: 'flex', alignItems: 'center',
            justifyContent: 'center', border: '1px dashed #d9d9d9',
            borderRadius: 4, color: '#bfbfbf',
          }}>
            <PictureOutlined style={{ fontSize: 20 }} />
          </div>
        )}
        <div>
          {value && (
            <div style={{ fontSize: 11, color: '#888', maxWidth: 220, wordBreak: 'break-all' }}>
              {value}
            </div>
          )}
          <Button size="small" onClick={handleOpen}>Changer</Button>
        </div>
      </Space>

      <Modal
        title="Choisir une image"
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        width={640}
        okText="OK"
        cancelText="Annuler"
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
                    gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                    gap: 8, marginBottom: 12,
                  }}>
                    {imgs.map(img => (
                      <div
                        key={img.path}
                        onClick={() => setSelected(img.path)}
                        style={{
                          position: 'relative',
                          border: `2px solid ${selected === img.path ? token.colorPrimary : '#d9d9d9'}`,
                          borderRadius: 6, padding: 6, cursor: 'pointer',
                          textAlign: 'center',
                          background: selected === img.path ? token.colorPrimaryBg : '#fff',
                        }}
                      >
                        <img
                          src={img.path}
                          alt={img.name}
                          style={{ width: 56, height: 56, objectFit: 'contain' }}
                        />
                        <div style={{
                          fontSize: 10, color: '#666', marginTop: 4,
                          wordBreak: 'break-all', lineHeight: 1.2,
                        }}>
                          {img.name}
                        </div>
                        {selected === img.path && (
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
                    ))}
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
