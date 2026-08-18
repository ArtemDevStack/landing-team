/**
 * Formats a raw phone/contact input into a standard masked phone number:
 * +7 (XXX) XXX-XX-XX for Russian/Kazakh numbers,
 * while seamlessly supporting Telegram handles (@user) and Email addresses.
 */
export function formatPhoneOrContact(val: string, prevVal: string = ''): string {
  if (!val) return ''

  // Telegram handle starting with @
  if (val.startsWith('@')) {
    return val
  }

  // Email or string username with alphabetic characters (and not starting with +)
  const hasAlpha = /[a-zA-Zа-яА-Я]/.test(val)
  if (hasAlpha && !val.startsWith('+')) {
    return val
  }

  // Extract only digits
  const digits = val.replace(/\D/g, '')

  // Deletion handling when backspacing over phone mask prefix (+7 ()
  if (prevVal && prevVal.length > val.length) {
    if (digits === '7' || digits === '8') {
      if (val.length <= 3) {
        return ''
      }
    }
    if (!digits) {
      return ''
    }
  }

  if (!digits) {
    if (val.startsWith('+')) return '+'
    return ''
  }

  // Format Russian / Kazakh numbers (+7)
  let formatted = ''
  let startDigitIndex = 0

  if (digits[0] === '7' || digits[0] === '8') {
    formatted = '+7 ('
    startDigitIndex = 1
  } else if (digits[0] === '9') {
    formatted = '+7 ('
    startDigitIndex = 0
  } else {
    // International number (e.g. +1, +375, +380)
    const intlDigits = digits.slice(0, 15)
    return '+' + intlDigits
  }

  const phoneDigits = digits.slice(startDigitIndex, startDigitIndex + 10)

  for (let i = 0; i < phoneDigits.length; i++) {
    if (i === 3) {
      formatted += ') '
    } else if (i === 6 || i === 8) {
      formatted += '-'
    }
    formatted += phoneDigits[i]
  }

  return formatted
}
