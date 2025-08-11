'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

// Componente para upload de foto de perfil do usuário
const FotoPerfilUploader: React.FC = () => {
  const { data: session } = useAuth()
  const usuario = session?.user
  const [foto, setFoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState<string | null>(null)

  // Atualiza preview ao selecionar arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFoto(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  // Envia foto para API
  const handleUpload = async () => {
    if (!foto) return
    setLoading(true)
    setMensagem(null)
    const formData = new FormData()
    formData.append('foto', foto)
    try {
      const res = await fetch('/api/usuario/foto', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        setMensagem('Foto atualizada com sucesso!')
      } else {
        setMensagem('Erro ao atualizar foto.')
      }
    } catch {
      setMensagem('Erro de conexão.')
    }
    setLoading(false)
  }

  if (!usuario) return null

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ fontWeight: 600 }}>Foto de Perfil:</label>
      <input type='file' accept='image/*' onChange={handleFileChange} disabled={loading} />
      {/* Exibe Skeleton enquanto preview está carregando */}
      {loading ? (
        <div style={{ margin: '12px 0' }}>
          <Skeleton className='h-[120px] w-[120px] rounded-full' />
        </div>
      ) : preview ? (
        <div style={{ margin: '12px 0' }}>
          <Image
            src={preview}
            alt='Preview'
            width={120}
            height={120}
            style={{ borderRadius: '50%' }}
            unoptimized
          />
        </div>
      ) : null}
      <button onClick={handleUpload} disabled={loading || !foto} style={{ marginTop: 8 }}>
        {loading ? 'Enviando...' : 'Salvar Foto'}
      </button>
      {mensagem && (
        <div style={{ color: mensagem.includes('sucesso') ? 'green' : 'red', marginTop: 8 }}>
          {mensagem}
        </div>
      )}
    </div>
  )
}

export default FotoPerfilUploader
// Comentário: Este componente permite ao usuário logado selecionar e enviar uma foto de perfil, que será salva via API. O preview é exibido antes do envio.
