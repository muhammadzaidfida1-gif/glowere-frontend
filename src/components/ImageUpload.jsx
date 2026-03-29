import { useState, useRef } from 'react'
import { analyzeSkin } from '../services/api'

export default function ImageUpload({ onResult }) {
    const [preview, setPreview] = useState(null)
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const inputRef = useRef()

    const handleFile = (e) => {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f)
        setPreview(URL.createObjectURL(f))
    }

    const handleAnalyze = async () => {
        if (!file) return
        setLoading(true)
        try {
            const result = await analyzeSkin(file)
            onResult(result)
        } catch (err) {
            onResult({ error: 'Could not analyze image. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="upload-area" onClick={() => !preview && inputRef.current?.click()}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
            />
            {!preview ? (
                <>
                    <div className="upload-icon">📸</div>
                    <div className="upload-text">
                        Tap to upload a clear selfie<br />
                        <span style={{ fontSize: '11px' }}>(Good lighting, no filter)</span>
                    </div>
                    <button className="upload-btn" onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}>
                        Choose Photo
                    </button>
                </>
            ) : (
                <div onClick={(e) => e.stopPropagation()}>
                    <img src={preview} alt="Preview" className="upload-preview" />
                    <button
                        className="analyze-btn"
                        onClick={handleAnalyze}
                        disabled={loading}
                    >
                        {loading ? '🔬 Analyzing...' : '🔬 Analyze My Skin'}
                    </button>
                    <div style={{ marginTop: 8 }}>
                        <button
                            className="quick-reply-btn"
                            style={{ fontSize: 12, marginTop: 4 }}
                            onClick={() => { setPreview(null); setFile(null) }}
                        >
                            ✕ Change Photo
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
