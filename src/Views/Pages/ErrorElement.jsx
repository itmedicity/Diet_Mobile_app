// @ts-nocheck
import React, { memo } from 'react'
import { useRouteError, useNavigate } from 'react-router-dom'
import { COLORS, FONT } from '../../Style/designTokens'

// Shown when a page cannot be found or fails to load
const ErrorElement = () => {

    const error = useRouteError()
    const navigate = useNavigate()
    const { status, statusText } = error ?? {}
    const notFound = status === 404

    return (
        <div
            role="alert"
            style={{
                minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignItems: 'center', textAlign: 'center', padding: 24, boxSizing: 'border-box',
                background: COLORS.wash, fontFamily: FONT, color: COLORS.ink,
            }}
        >
            <h1 style={{ margin: 0, fontSize: 24 }}>
                {notFound ? 'This page does not exist' : 'Something went wrong'}
            </h1>
            <p style={{ margin: '8px 0 24px', fontSize: 16, color: COLORS.muted, maxWidth: 320 }}>
                {notFound
                    ? 'Check the address, or go back to the login page.'
                    : `The page could not be shown${statusText ? ` (${statusText})` : ''}. Try again, or go back to the login page.`}
            </p>
            <button
                type="button"
                onClick={() => navigate('/', { replace: true })}
                style={{
                    height: 52, padding: '0 28px', border: 0, borderRadius: 14, cursor: 'pointer',
                    background: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 17, fontWeight: 700,
                }}
            >
                Go to login
            </button>
        </div>
    )
}

export default memo(ErrorElement)
