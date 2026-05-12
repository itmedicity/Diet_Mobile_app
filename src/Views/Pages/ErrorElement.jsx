// @ts-nocheck
import React, { memo } from 'react'
import { useRouteError } from 'react-router-dom'

const ErrorElement = () => {

    const error = useRouteError()
    const { status, statusText, data } = error
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: '#fff4ed',
            }}
        >
            <div style={{
                color: '#d84b9a',
                fontSize: '10rem',
                opacity: 0.8,
                fontFamily: 'cursive',
                fontWeight: 'bold',
                filter: 'drop-shadow(2px 4px 6px black)'
            }} >{status}</div>
            <div
                style={{
                    fontSize: '2rem',
                    fontFamily: 'cursive',
                    fontWeight: 'bold',
                    color: '#1788ca'
                }}
            >{statusText}</div>
            <div
                style={{
                    fontSize: '0.90rem',
                    fontFamily: 'cursive',
                    fontWeight: 'bold',
                    color: '#1788ca'
                }}
            >{data}</div>
        </div>
    )
}

export default memo(ErrorElement)