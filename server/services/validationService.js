export const validateGeneratePayload = (body) => {
  const errors = []
  if (!body.selectedTools || !Array.isArray(body.selectedTools)) {
    errors.push('selectedTools must be an array')
  } else if (body.selectedTools.length === 0) {
    errors.push('At least one tool must be selected')
  } else {
    body.selectedTools.forEach((t, i) => {
      if (!t.toolId) errors.push(`Tool at index ${i} missing toolId`)
      if (!t.version) errors.push(`Tool at index ${i} missing version`)
    })
  }
  return errors
}
