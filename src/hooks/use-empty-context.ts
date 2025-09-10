import { useCallback, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

import { abandonedMessages } from "@/lib/messages"
import { EmptyContext } from "@/contexts/empty-provider"

export function useEmptyProvider() {
    const [title, setTitle] = useState<string>("A Website")
    const [lastActivity, setLastActivity] = useState<Date>(new Date())

    const [abandoned, setAbandoned] = useState<number>(0)
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

    const updateActivity = useCallback(() => {
        setLastActivity(new Date())
        setAbandoned(0)
        timeoutId && clearTimeout(timeoutId)
        setTimeoutId(undefined)
    }, [setLastActivity, setAbandoned, timeoutId, setTimeoutId])

    const afkMessage = useCallback(() => {
        setAbandoned(a => {
            console.log(a)
            const message = abandonedMessages[Math.min(a, abandonedMessages.length - 1)]
            console.log(message)
            toast(message.title, {
                description: message.description
            })
            return a + 1
        })

        const time = abandoned < 4 ? 60 * 1000 + Math.floor(Math.random() * 240 * 1000) : abandoned < 8 ? 240 * 1000 + Math.floor(Math.random() * 360 * 1000) : 600 * 1000 + Math.floor(Math.random() * 1200 * 1000)
        const id = setTimeout(afkMessage, time)
        setTimeoutId(id)
    }, [setAbandoned])

    useEffect(() => {
        if (!timeoutId) {
            const id = setTimeout(afkMessage, 300 * 1000)
            setTimeoutId(id)
            console.log("timeout set")
        } else {
            console.log("timeout not set")
        }
    }, [timeoutId, setTimeoutId, afkMessage])

    return { title, setTitle, lastActivity, updateActivity }
}

export default function useEmptyContext() { return useContext(EmptyContext) }