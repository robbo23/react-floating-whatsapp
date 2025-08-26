import React, { useReducer, useEffect, useCallback, useRef, useMemo } from 'react'
import { reducer } from '../reducer'
import { WhatsappSVG, CloseSVG, CheckSVG, SendSVG } from './Icons'
import '../tailwind.css'

import darkBG from './assets/bg-chat-tile-light.png'
import lightBG from './assets/bg-chat-tile-dark.png'
import dummyAvatar from './assets/uifaces-avatar.jpg'
import SoundBeep from './assets/whatsapp-notification.mp3'

export interface FloatingWhatsAppProps {
  /** Callback function fires on click */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  /** Callback function fires on submit with event and form input value passed */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>, formValue: string) => void
  /** Callback function fires on close */
  onClose?: () => void
  /** Callback function fired when notification runs */
  onNotification?: () => void
  /** Callback function called when notification loop done */
  onLoopDone?: () => void

  /** Phone number in [intenational format](https://faq.whatsapp.com/general/contacts/how-to-add-an-international-phone-number) */
  phoneNumber: string
  /** Account Name */
  accountName: string
  /** Set chat box height */
  chatboxHeight?: number
  /** Inline style applied to chat box */
  chatboxStyle?: React.CSSProperties
  /** CSS className applied to chat box */
  chatboxClassName?: string
  /** Change user avatar using [static assets](https://create-react-app.dev/docs/adding-images-fonts-and-files/) */
  avatar?: string
  /** Text below the account username */
  statusMessage?: string
  /** Text inside the chat box */
  chatMessage?: string
  /** Input placeholder */
  placeholder?: string

  /** Time delay after which the chatMessage is displayed (in seconds) */
  messageDelay?: number

  /** Allow notifications (Disabled after user opens the chat box) */
  notification?: boolean
  /** Time delay between notifications in seconds */
  notificationDelay?: number
  /** Repeat notifications loop */
  notificationLoop?: number
  /** Enable notification sound */
  notificationSound?: boolean
  /** Notification sound custom src */
  notificationSoundSrc?: string
  /** Inline style applied to notification */
  notificationStyle?: React.CSSProperties
  /** CSS className applied to notification */
  notificationClassName?: string

  /** Closes the chat box if click outside the chat box */
  allowClickAway?: boolean
  /** Closes the chat box if `Escape` key is clicked */
  allowEsc?: boolean
  /** Enable / Disable dark mode */
  darkMode?: boolean
  /** Inline style  applied to the main wrapping `Div` */
  style?: React.CSSProperties
  /** CSS className applied to the main wrapping `Div` */
  className?: string

  /** Inline style applied to button */
  buttonStyle?: React.CSSProperties
  /** CSS className applied to button */
  buttonClassName?: string
}

export function FloatingWhatsApp({
  onClick,
  onSubmit,
  onClose,
  onNotification,
  onLoopDone,

  phoneNumber = '1234567890',
  accountName = 'Account Name',
  avatar = dummyAvatar,
  statusMessage = 'Typically replies within 1 hour',
  chatMessage = 'Hello there! 🤝 \nHow can we help?',
  placeholder = 'Type a message..',

  messageDelay = 2,

  allowClickAway = false,
  allowEsc = false,

  notification = true,
  notificationDelay = 60,
  notificationLoop = 0,
  notificationSound = false,
  notificationSoundSrc = SoundBeep,
  notificationStyle,
  notificationClassName = 'floating-whatsapp-notification',

  buttonStyle,
  buttonClassName = 'floating-whatsapp-button',

  chatboxHeight = 320,
  chatboxStyle,
  chatboxClassName = 'floating-whatsapp-chatbox',

  darkMode = false,
  style,
  className = 'floating-whatsapp'
}: FloatingWhatsAppProps) {
  const [{ isOpen, isDelay, isNotification }, dispatch] = useReducer(reducer, {
    isOpen: false,
    isDelay: true,
    isNotification: false
  })

  const timeNow = useMemo(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), [])

  const inputRef = useRef<HTMLInputElement | null>(null)
  const soundRef = useRef<HTMLAudioElement | null>(null)
  const loops = useRef(0)
  const notificationInterval = useRef(0)

  const handleNotification = useCallback(() => {
    if (!notification) return

    dispatch({ type: 'notification' })
    if (onNotification) onNotification()
    if (notificationLoop > 0) {
      loops.current += 1

      if (notificationSound) {
        if (soundRef.current) {
          soundRef.current.currentTime = 0
          soundRef.current.play()
        }
      }
      if (loops.current === notificationLoop) {
        clearInterval(notificationInterval.current)
        if (onLoopDone) onLoopDone()
      }
    }
  }, [notification, notificationLoop, notificationSound, onNotification, onLoopDone])

  useEffect(() => {
    const delayInSecond = notificationDelay * 1000
    if (delayInSecond < 10) return console.error('notificationDelay prop value must be at least 10 seconds.')

    notificationInterval.current = window.setInterval(handleNotification, delayInSecond)

    return () => clearInterval(notificationInterval.current)
  }, [handleNotification, notificationDelay])

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()

      if (isOpen) return

      clearInterval(notificationInterval.current)
      dispatch({ type: 'open' })
      setTimeout(() => dispatch({ type: 'delay' }), messageDelay * 1000)
      if (onClick) onClick(event)
    },
    [isOpen, onClick, messageDelay]
  )

  const handleClose = useCallback(() => {
    dispatch({ type: 'close' })

    if (onClose) onClose()
  }, [onClose])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!inputRef.current?.value) return

    window.open(`https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${inputRef.current.value}`)
    if (onSubmit) onSubmit(event, inputRef.current.value)
    inputRef.current.value = ''
  }

  useEffect(() => {
    const onClickOutside = () => {
      if (!allowClickAway || !isOpen) return

      handleClose()
    }
    document.addEventListener('click', onClickOutside, false)

    return () => document.removeEventListener('click', onClickOutside)
  }, [allowClickAway, isOpen, handleClose])

  useEffect(() => {
    const onEscKey = (event: KeyboardEvent) => {
      if (!allowEsc || !isOpen) return

      if (event.key === 'Escape') handleClose()
    }

    document.addEventListener('keydown', onEscKey, false)

    return () => document.removeEventListener('keydown', onEscKey)
  }, [allowEsc, isOpen, handleClose])

  return (
    <div className={`w-full h-full text-left relative font-sans ${darkMode ? 'dark ' : ''}${className}`} style={style}>
      <div
        className={`w-[60px] h-[60px] flex justify-center items-center fixed bottom-8 right-8 cursor-pointer bg-whatsapp-green rounded-full select-none shadow-lg z-[9998] relative ${buttonClassName}`}
        onClick={handleOpen}
        style={buttonStyle}
        aria-hidden='true'
      >
        <div className="absolute inset-0 rounded-full animate-pulse-whatsapp"></div>
        <WhatsappSVG />
        {isNotification && (
          <span className={`flex flex-wrap justify-center items-center absolute box-border font-inherit font-medium text-xs min-w-5 leading-none px-1.5 h-5 rounded-lg z-[1] transition-transform duration-200 ease-in-out bg-red-600 text-white top-0 right-2.5 transform scale-100 translate-x-1/2 -translate-y-1/2 origin-top-right ${notificationClassName}`} style={notificationStyle}>
            1
          </span>
        )}
      </div>

      <div
        className={`flex flex-col justify-between rounded-lg overflow-hidden bg-white touch-auto fixed bottom-28 right-16 w-96 opacity-0 transition-all duration-200 ease-out shadow-lg z-[9999] max-[575px]:right-0 max-[575px]:left-0 max-[575px]:max-w-[90%] max-[575px]:mx-auto ${isOpen ? 'animate-bounce-in' : 'animate-bounce-out'} ${chatboxClassName}`}
        onClick={(event) => event.stopPropagation()}
        aria-hidden='true'
        style={{ height: isOpen ? chatboxHeight : 0, ...chatboxStyle }}
      >
        <header className="bg-whatsapp-dark grid items-center p-1 grid-cols-[20%_60%_1fr] gap-[1%]">
          <div className="p-1 relative">
            <img src={avatar} width='60' height='60' alt='whatsapp-avatar' className="align-middle rounded-full h-[60px] w-[60px] border border-white/50" />
            <div className="absolute w-2.5 h-2.5 bg-whatsapp-light border border-white rounded-full bottom-1 right-2"></div>
          </div>
          <div className="text-white flex flex-col p-2">
            <span className="text-base font-bold">{accountName}</span>
            <span className="text-sm text-gray-100">{statusMessage}</span>
          </div>
          <div className="p-4 cursor-pointer text-center" onClick={handleClose} aria-hidden='true'>
            <CloseSVG />
          </div>
        </header>

        <div className={`p-5 bg-cover bg-repeat max-h-96 h-full opacity-90 ${darkMode ? 'bg-gray-900' : 'bg-stone-200'}`} style={{ backgroundImage: `url(${darkMode ? darkBG : lightBG})` }}>
          {isDelay ? (
            <div className={`inline-block p-4 px-7 rounded-2xl rounded-bl-sm ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className="flex items-center h-4">
                <div className={`animate-typing rounded-full h-1.5 w-1.5 mr-1 align-middle inline-block typing-dot-1 ${darkMode ? 'bg-green-300/70' : 'bg-green-800/70'}`} />
                <div className={`animate-typing rounded-full h-1.5 w-1.5 mr-1 align-middle inline-block typing-dot-2 ${darkMode ? 'bg-green-300/70' : 'bg-green-800/70'}`} />
                <div className={`animate-typing rounded-full h-1.5 w-1.5 mr-0 align-middle inline-block typing-dot-3 ${darkMode ? 'bg-green-300/70' : 'bg-green-800/70'}`} />
              </div>
            </div>
          ) : (
            <div className={`py-1.5 px-3.5 pb-1.5 rounded-tr-lg rounded-b-lg relative max-w-[calc(100%-120px)] z-[2] shadow-sm ${darkMode ? 'bg-teal-700 shadow-black/70' : 'bg-white shadow-black/13'}`}>
              <span className={`inline-block absolute -left-2.5 top-0 triangle-left ${darkMode ? 'triangle-left-dark' : ''}`} />
              <span className={`text-xs font-bold leading-4 ${darkMode ? 'text-white/50' : 'text-black/50'}`}>{accountName}</span>
              <p className={`text-sm leading-5 mt-1 whitespace-pre-wrap ${darkMode ? 'text-gray-100/90' : 'text-black'}`}>{chatMessage}</p>
              <span className={`flex mt-1 text-xs leading-4 justify-end ${darkMode ? 'text-white/50' : 'text-black/50'}`}>
                {timeNow}
                <span style={{ marginLeft: 5 }}>
                  <CheckSVG />
                </span>
              </span>
            </div>
          )}
        </div>

        <footer className={`p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <form onSubmit={handleSubmit} className="grid items-center grid-cols-[85%_15%] p-1">
            <input className={`rounded-2xl px-2.5 border-none min-h-[45px] transition-shadow duration-200 ease-in-out placeholder-gray-500 focus:outline-none focus:shadow-[0_0_0_1px_rgb(7_94_84_/_50%)] ${darkMode ? 'bg-gray-700 text-gray-100 focus:border-teal-500 focus:shadow-[0_0_0_1px_rgb(13_168_150_/_50%)]' : 'bg-white border-whatsapp-dark'}`} placeholder={placeholder} ref={inputRef} dir='auto' />
            <button type='submit' className="bg-transparent border-0 cursor-pointer disabled:pointer-events-none disabled:opacity-50">
              <SendSVG />
            </button>
          </form>
        </footer>
      </div>
      {notificationSound && <audio ref={soundRef} hidden src={notificationSoundSrc} />}
    </div>
  )
}
