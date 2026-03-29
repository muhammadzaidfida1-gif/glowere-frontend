export default function QuickReplies({ buttons, onAction }) {
    if (!buttons?.length) return null
    return (
        <div className="quick-replies">
            {buttons.map((btn) => (
                <button
                    key={btn.action}
                    className="quick-reply-btn"
                    onClick={() => onAction(btn.action, btn.label)}
                >
                    {btn.label}
                </button>
            ))}
        </div>
    )
}
