import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import buildPin from "./models/build-pin"
import {QueryPin} from "./types"

const slice = createSlice({
  name: "TAB_EDITOR",
  initialState: {
    value: "",
    pins: [] as QueryPin[],
    pinEditIndex: null as null | number
  },
  reducers: {
    setValue(s, a: PayloadAction<string>) {
      s.value = a.payload
    },
    setPins(s, a: PayloadAction<QueryPin[]>) {
      s.pins = a.payload
    },
    pinValue(s) {
      s.pins.push({type: "generic", value: s.value})
      s.value = ""
    },
    addPin(s, a: PayloadAction<QueryPin>) {
      s.pins.push(a.payload)
    },
    editPin(s, a: PayloadAction<number>) {
      s.pinEditIndex = a.payload
    },
    disablePin(s, a: PayloadAction<number>) {
      s.pins[a.payload].disabled = true
    },
    enablePin(s, a: PayloadAction<number>) {
      s.pins[a.payload].disabled = false
    },
    deletePin(s, a: PayloadAction<number>) {
      delete s.pins[a.payload]
    },
    updatePin(s, a: PayloadAction<Partial<QueryPin>>) {
      const pin = s.pins[s.pinEditIndex]
      if (!pin) return
      const newPin = {...pin, ...a.payload} as QueryPin

      if (buildPin(newPin).empty()) {
        delete s.pins[s.pinEditIndex]
      } else {
        s.pins[s.pinEditIndex] = newPin
      }
      s.pinEditIndex = null
    },
    cancelPinEdit(s) {
      s.pinEditIndex = null
    }
  }
})

export const reducer = slice.reducer
export const actions = slice.actions
