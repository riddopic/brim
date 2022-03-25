import {cssVar, darken, lighten} from "polished"
import React, {useRef} from "react"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import useListener from "src/js/components/hooks/useListener"
import styled from "styled-components"
import {GenericQueryPin} from "./reducer"

const Dialog = styled.dialog`
  z-index: 999;
  text-align: left;
  padding: 10px;
  padding-top: 16px;
  border: none;
  border-radius: 5px;
  box-shadow: var(--shadow-elevation-medium);
  min-width: 260px;
  top: 50px;
`

const Field = styled.div`
  margin-bottom: 10px;
  label {
    font-weight: 500;
    display: block;
    margin-bottom: 6px;
  }
  input,
  textarea {
    background: var(--input-background);
    border: none;
    border-radius: 5px;
    font-family: var(--mono-font);
    line-height: 1.5;
  }
  input {
    width: 66%;
    height: 26px;
    padding: 0 6px;
  }
  textarea {
    width: 100%;
    padding: 6px;
    height: calc(26px * 3);
  }
`

const Actions = styled.div`
  margin-top: 26px;
  text-align: center;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`

const Button = styled.button`
  background: var(--control-background);
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  color: var(--foreground-color);
  padding: 0 8px;
  min-width: 60px;
  font-weight: 500;
  &:hover {
    background: var(--control-hover);
  }
  &:active {
    background: var(--control-active);
  }
`

const primary = cssVar("--primary-color") as string
const hover = lighten(0.03, primary)
const active = darken(0.03, primary)
const PrimaryButton = styled(Button)`
  background: var(--primary-color);
  color: white;
  &:hover {
    background: ${hover};
  }
  &:active {
    background: ${active};
  }
`

export function GenericPinDialog(props: {
  open: boolean
  pin: GenericQueryPin
  onSubmit: (d: {label: string; value: string}) => void
  onReset: () => void
}) {
  const [dialog, ref] = useCallbackRef<HTMLDialogElement>()
  const form = useRef<HTMLFormElement>()

  useListener(dialog, "close", () => {
    const d = dialog
    if (!d) return
    if (d.returnValue === "ok") {
      props.onSubmit(getFormData(form.current))
    } else {
      props.onReset()
    }
  })

  return (
    <Dialog open={props.open} ref={ref}>
      <form method="dialog" ref={form}>
        <Field>
          <label htmlFor="value">Value</label>
          <textarea autoFocus name="value">
            {props.pin.value}
          </textarea>
        </Field>

        <Field>
          <label htmlFor="label">Label</label>
          <input
            name="label"
            placeholder="Same as value"
            defaultValue={props.pin.label}
          />
        </Field>

        <Actions>
          <Button value="cancel">Cancel</Button>
          <PrimaryButton value="ok">OK</PrimaryButton>
        </Actions>
      </form>
    </Dialog>
  )
}

function getFormData(form: HTMLFormElement) {
  const obj = {}
  for (let [name, value] of new FormData(form).entries()) {
    obj[name] = value
  }
  return obj as {value: string; label: string}
}
