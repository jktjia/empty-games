import { useCallback, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import type { UseNavigateResult } from "@tanstack/react-router"
// import { abandonedMessages } from "@/lib/messages"
import { EmptyContext } from "@/components/providers/empty-provider"

const timeoutModifier = 1

const gamePaths = ['/', '/minesweeper']

export function useEmptyProvider({ navigate }: {
    navigate: UseNavigateResult<string>
}) {
    const [title, setTitle] = useState<string>("A Website")
    const [startTime, setStartTime] = useState<Date>(new Date())
    const [lastActivity, setLastActivity] = useState<Date>(new Date())

    const [abandoned, setAbandoned] = useState<number>(0)
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

    const updateActivity = useCallback(() => {
        const now = new Date()
        setLastActivity(now)
        setAbandoned(0)
    }, [setLastActivity, setAbandoned, timeoutId, setTimeoutId])

    const afkMessage = useCallback(() => {
        const now = new Date()
        const diff = now.valueOf() - lastActivity.valueOf()
        console.log("last activity: %d minutes ago", diff / (60 * 1000))
        if (diff < 5 * 60 * 1000 * timeoutModifier) {
            const id = setTimeout(afkMessage, (5 * 60 * 1000 - diff) * timeoutModifier)
            setTimeoutId(id)
            console.log("timeout reset")
        } else {
            setAbandoned(a => {
                // const message = abandonedMessages[Math.min(a, abandonedMessages.length - 1)]
                // toast(message.title, {
                //     description: message.description
                // })
                toast('Where did you go?', {
                    description: `last activity: ${Math.floor(diff / (60 * 1000))} minutes, ${Math.floor((diff / 1000) % 60)} seconds ago`
                })
                return a + 1
            })
            const time = abandoned < 4 ? 60 * 1000 + Math.floor(Math.random() * 240 * 1000) : abandoned < 8 ? 240 * 1000 + Math.floor(Math.random() * 360 * 1000) : 600 * 1000 + Math.floor(Math.random() * 1200 * 1000)
            const id = setTimeout(afkMessage, time * timeoutModifier)
            setTimeoutId(id)
            console.log("timeout set")
        }
    }, [setAbandoned])

    useEffect(() => {
        if (!timeoutId) {
            const id = setTimeout(afkMessage, 300 * 1000 * timeoutModifier)
            setTimeoutId(id)
            console.log("timeout set")
        } else {
            console.log("timeout not set")
        }
    }, [])

    useEffect(() => {
        const next = gamePaths[Math.floor(Math.random() * gamePaths.length)]
        console.log(next)
        setTimeout(() => {
            setStartTime(new Date())
            navigate({ to: next })
        }, 10 * 60 * 1000 * timeoutModifier)
    }, [startTime])

    return { title, setTitle, lastActivity, updateActivity }
}

export default function useEmptyContext() { return useContext(EmptyContext) }