import { setCssVar } from 'quasar'
export default function useBrand () {
  const setBrand = (primary, secondary) => {
    if (primary) {
      setCssVar('primary', primary)
    }

    if (secondary) {
      setCssVar('secondary', secondary)
    }
  }

  return {
    setBrand
  }
}
