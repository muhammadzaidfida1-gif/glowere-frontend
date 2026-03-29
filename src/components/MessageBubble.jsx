// Converts *bold*, basic markdown-like formatting to JSX
export function formatText(text) {
    if (!text) return null
    // Split on ** or * for bold
    const parts = text.split(/(\*[^*]+\*)/g)
    return parts.map((part, i) => {
        if (part.startsWith('*') && part.endsWith('*')) {
            return <strong key={i}>{part.slice(1, -1)}</strong>
        }
        return part
    })
}

export default function MessageBubble({ msg }) {
    const isBot = msg.role === 'bot'
    return (
        <div className={`msg-row ${isBot ? 'bot' : 'user'}`}>
            {isBot && <div className="msg-avatar">🌿</div>}
            <div className="msg-bubble">
                {formatText(msg.text)}
            </div>
        </div>
    )
}
