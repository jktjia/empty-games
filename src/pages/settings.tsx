import { useTheme } from '@/components/providers/theme-provider'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import useEmptyContext from '@/hooks/use-empty-context'

export default function Settings() {
  const { interfereAllowed, setInterfereAllowed } = useEmptyContext()
  const { theme, setTheme } = useTheme()

  return (
    <div className="w-2xl flex flex-col items-start gap-5 h-full p-2">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Separator />
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="set-theme">Theme</FieldLabel>
          <FieldDescription className="flex items-start">
            Focus is shared across devices, and turns off when you leave the
            app.
          </FieldDescription>
        </FieldContent>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="game-interfere">Game Interference</FieldLabel>
          <FieldDescription className="flex items-start">
            Increases difficulty by adding random interference to gameplay
          </FieldDescription>
        </FieldContent>
        <Switch
          id="game-interfere"
          checked={interfereAllowed}
          onCheckedChange={setInterfereAllowed}
        />
      </Field>
    </div>
  )
}
